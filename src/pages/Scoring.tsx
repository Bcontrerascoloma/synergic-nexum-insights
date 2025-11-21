import { useState, useMemo } from 'react';
import { Target, Save, Copy, Trash2, Download, Info } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  KPI_DEFINITIONS,
  KPIKey,
  calculateSupplierScores,
  getPresetWeights,
  getDefaultWeights,
} from '@/lib/scoring';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

export default function Scoring() {
  const { suppliers, scoringModels, activeModelId, setScoringModels, setActiveModelId } = useAppStore();
  
  const allKpis = Object.keys(KPI_DEFINITIONS) as KPIKey[];
  const [activeKpis, setActiveKpis] = useState<KPIKey[]>(allKpis.filter(kpi => kpi !== 'distance_km')); // distance_km optional
  const [weights, setWeights] = useState<Record<string, number>>(getDefaultWeights(activeKpis));

  // Calculate scores
  const scoredSuppliers = useMemo(
    () => calculateSupplierScores(suppliers.filter(s => s.is_active), activeKpis, weights),
    [suppliers, activeKpis, weights]
  );

  // Toggle KPI active state
  const toggleKpi = (kpi: KPIKey) => {
    if (activeKpis.includes(kpi)) {
      const newActive = activeKpis.filter(k => k !== kpi);
      setActiveKpis(newActive);
      setWeights(getDefaultWeights(newActive));
    } else {
      const newActive = [...activeKpis, kpi];
      setActiveKpis(newActive);
      setWeights(getDefaultWeights(newActive));
    }
  };

  // Update weight
  const updateWeight = (kpi: KPIKey, value: number) => {
    setWeights({ ...weights, [kpi]: value });
  };

  // Load preset
  const loadPreset = (preset: string) => {
    const presetData = getPresetWeights(preset);
    setActiveKpis(presetData.activeKpis);
    setWeights(presetData.weights);
    toast.success(`Preset "${preset}" cargado`);
  };

  // Export ranking
  const exportRanking = () => {
    const csv = [
      ['Rank', 'Supplier ID', 'Name', 'Total Score', ...activeKpis.map(k => KPI_DEFINITIONS[k].label)],
      ...scoredSuppliers.map(s => {
        const supplier = suppliers.find(sup => sup.supplier_id === s.supplier_id)!;
        return [
          s.rank,
          s.supplier_id,
          supplier.name,
          s.total_score.toFixed(4),
          ...activeKpis.map(k => s.scores[k]?.toFixed(4) || ''),
        ];
      }),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `supplier-ranking-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Ranking exportado como CSV');
  };

  // Get top 3 for radar
  const top3 = scoredSuppliers.slice(0, 3);
  const radarData = activeKpis.map((kpi) => {
    const point: any = { kpi: KPI_DEFINITIONS[kpi].label };
    top3.forEach((s, i) => {
      point[`Top${i + 1}`] = s.scores[kpi] || 0;
    });
    return point;
  });

  // Total weight
  const totalWeight = activeKpis.reduce((sum, k) => sum + (weights[k] || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Scoring & Ranking</h1>
          <p className="text-muted-foreground mt-1">
            Sistema de ponderación multi-criterio y ranking de proveedores
          </p>
        </div>
        <Button onClick={exportRanking} className="bg-primary hover:bg-primary/90">
          <Download className="h-4 w-4 mr-2" />
          Exportar Ranking
        </Button>
      </div>

      {/* Preset selector */}
      <Card className="rounded-2xl shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Presets de Ponderación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => loadPreset('cost')}>
              Enfoque Costo
            </Button>
            <Button variant="outline" onClick={() => loadPreset('proximity')}>
              Cercanía
            </Button>
            <Button variant="outline" onClick={() => loadPreset('quality_service')}>
              Calidad/Servicio
            </Button>
            <Button variant="outline" onClick={() => loadPreset('balanced')}>
              Balanceado
            </Button>
            <Button variant="outline" onClick={() => loadPreset('cash_flow')}>
              Flujo de Caja
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Weight panel */}
      <Card className="rounded-2xl shadow-[var(--shadow-card)]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Ponderación de KPIs</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Total:</span>
              <Badge variant={Math.abs(totalWeight - 100) < 1 ? 'default' : 'destructive'}>
                {totalWeight.toFixed(1)}%
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {allKpis.map((kpi) => {
              const def = KPI_DEFINITIONS[kpi];
              const isActive = activeKpis.includes(kpi);
              const weight = weights[kpi] || 0;

              return (
                <div key={kpi} className="flex items-center gap-4">
                  <Switch checked={isActive} onCheckedChange={() => toggleKpi(kpi)} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <Label className={!isActive ? 'text-muted-foreground' : ''}>
                        {def.label}
                        <span className="text-xs text-muted-foreground ml-2">
                          ({def.type === 'benefit' ? 'Mayor es mejor' : 'Menor es mejor'})
                        </span>
                      </Label>
                      <span className="text-sm font-medium">{weight.toFixed(1)}%</span>
                    </div>
                    <Slider
                      value={[weight]}
                      onValueChange={(v) => updateWeight(kpi, v[0])}
                      max={100}
                      step={1}
                      disabled={!isActive}
                      className="w-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {Math.abs(totalWeight - 100) >= 1 && (
            <div className="mt-4 p-3 bg-warning/10 border border-warning rounded-lg flex items-start gap-2">
              <Info className="h-5 w-5 text-warning mt-0.5" />
              <p className="text-sm text-warning">
                La suma de pesos debe ser 100%. Actualmente: {totalWeight.toFixed(1)}%
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ranking table */}
      <Card className="rounded-2xl shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle>Ranking de Proveedores</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>País</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Score Total</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scoredSuppliers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No hay datos para calcular ranking
                  </TableCell>
                </TableRow>
              ) : (
                scoredSuppliers.map((score) => {
                  const supplier = suppliers.find((s) => s.supplier_id === score.supplier_id)!;
                  const tercile =
                    score.rank <= scoredSuppliers.length / 3
                      ? 'default'
                      : score.rank <= (2 * scoredSuppliers.length) / 3
                      ? 'outline'
                      : 'secondary';

                  return (
                    <TableRow key={score.supplier_id}>
                      <TableCell className="font-bold">{score.rank}</TableCell>
                      <TableCell className="font-mono text-sm">{score.supplier_id}</TableCell>
                      <TableCell className="font-medium">{supplier.name}</TableCell>
                      <TableCell>{supplier.country}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{supplier.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {score.total_score.toFixed(4)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={tercile}>
                          {tercile === 'default' ? 'Top' : tercile === 'outline' ? 'Medio' : 'Bajo'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Radar comparison */}
      {top3.length >= 2 && (
        <Card className="rounded-2xl shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle>Comparación Top 3 (Radar)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="kpi" stroke="hsl(var(--foreground))" />
                <PolarRadiusAxis domain={[0, 1]} stroke="hsl(var(--muted-foreground))" />
                <Radar
                  name={suppliers.find((s) => s.supplier_id === top3[0]?.supplier_id)?.name || 'Top 1'}
                  dataKey="Top1"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                />
                {top3.length >= 2 && (
                  <Radar
                    name={suppliers.find((s) => s.supplier_id === top3[1]?.supplier_id)?.name || 'Top 2'}
                    dataKey="Top2"
                    stroke="hsl(var(--accent))"
                    fill="hsl(var(--accent))"
                    fillOpacity={0.3}
                  />
                )}
                {top3.length >= 3 && (
                  <Radar
                    name={suppliers.find((s) => s.supplier_id === top3[2]?.supplier_id)?.name || 'Top 3'}
                    dataKey="Top3"
                    stroke="hsl(var(--success))"
                    fill="hsl(var(--success))"
                    fillOpacity={0.3}
                  />
                )}
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
