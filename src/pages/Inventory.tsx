import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';
import { KPICard } from '@/components/KPICard';
import { Package, AlertTriangle, TrendingUp } from 'lucide-react';
import { calculateInventoryHealth } from '@/lib/kpis';

export default function Inventory() {
  const { inventory } = useAppStore();

  const inventoryHealth = calculateInventoryHealth(inventory);
  const lowStockItems = inventory.filter(i => i.on_hand < i.safety_stock);
  const stockoutItems = inventory.filter(i => i.on_hand === 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Inventario</h1>
        <p className="text-muted-foreground mt-1">
          Monitoreo de niveles de stock y quiebres
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Salud de Inventario"
          value={inventoryHealth}
          unit="%"
          status={inventoryHealth >= 85 ? 'success' : inventoryHealth >= 70 ? 'warning' : 'danger'}
          icon={<Package className="h-5 w-5" />}
        />
        <KPICard
          title="Items con Stock Bajo"
          value={lowStockItems.length}
          status={lowStockItems.length < 10 ? 'success' : lowStockItems.length < 20 ? 'warning' : 'danger'}
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <KPICard
          title="Quiebres de Stock"
          value={stockoutItems.length}
          status={stockoutItems.length === 0 ? 'success' : stockoutItems.length < 5 ? 'warning' : 'danger'}
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      <Card className="rounded-2xl shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle>Resumen por Sitio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from(new Set(inventory.map(i => i.site))).map(site => {
              const siteInventory = inventory.filter(i => i.site === site);
              const siteHealth = (siteInventory.filter(i => i.on_hand >= i.safety_stock).length / siteInventory.length) * 100;
              
              return (
                <div key={site} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{site}</p>
                    <p className="text-sm text-muted-foreground">{siteInventory.length} SKUs</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">{siteHealth.toFixed(0)}%</p>
                    <p className="text-sm text-muted-foreground">Salud</p>
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
