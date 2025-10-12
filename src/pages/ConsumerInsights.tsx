import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';
import { KPICard } from '@/components/KPICard';
import { Eye, RefreshCw, Clock, Star } from 'lucide-react';
import { calculateStockoutRate, calculateSubstitutionRate, calculateMedianDecisionTime } from '@/lib/kpis';

export default function ConsumerInsights() {
  const { consumerEvents } = useAppStore();

  const stockoutRate = calculateStockoutRate(consumerEvents);
  const substitutionRate = calculateSubstitutionRate(consumerEvents);
  const medianDecisionTime = calculateMedianDecisionTime(consumerEvents);
  
  const avgLabelClarity = consumerEvents.length > 0
    ? consumerEvents.reduce((sum, e) => sum + e.label_clarity_1_5, 0) / consumerEvents.length
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Consumer Insights</h1>
        <p className="text-muted-foreground mt-1">
          Métricas de comportamiento en punto de venta
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPICard
          title="Tasa de Quiebres"
          value={stockoutRate}
          unit="%"
          status={stockoutRate <= 5 ? 'success' : stockoutRate <= 10 ? 'warning' : 'danger'}
          icon={<Eye className="h-5 w-5" />}
        />
        <KPICard
          title="Tasa de Sustitución"
          value={substitutionRate}
          unit="%"
          status={substitutionRate <= 15 ? 'success' : substitutionRate <= 25 ? 'warning' : 'danger'}
          icon={<RefreshCw className="h-5 w-5" />}
        />
        <KPICard
          title="Tiempo de Decisión (mediana)"
          value={medianDecisionTime}
          unit="seg"
          status={medianDecisionTime <= 30 ? 'success' : medianDecisionTime <= 60 ? 'warning' : 'danger'}
          icon={<Clock className="h-5 w-5" />}
        />
        <KPICard
          title="Claridad de Etiqueta"
          value={avgLabelClarity}
          unit="/5"
          status={avgLabelClarity >= 4 ? 'success' : avgLabelClarity >= 3 ? 'warning' : 'danger'}
          icon={<Star className="h-5 w-5" />}
        />
      </div>

      <Card className="rounded-2xl shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle>Análisis por Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from(new Set(consumerEvents.map(e => e.category))).map(category => {
              const categoryEvents = consumerEvents.filter(e => e.category === category);
              const catStockout = (categoryEvents.filter(e => e.stockout_flag).length / categoryEvents.length) * 100;
              const catSubstitution = (categoryEvents.filter(e => e.substitution_flag).length / categoryEvents.length) * 100;
              
              return (
                <div key={category} className="p-4 bg-secondary/50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium text-foreground">{category}</p>
                    <p className="text-sm text-muted-foreground">{categoryEvents.length} observaciones</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Quiebres</p>
                      <p className="text-xl font-bold text-foreground">{catStockout.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Sustituciones</p>
                      <p className="text-xl font-bold text-foreground">{catSubstitution.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
