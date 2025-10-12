import { useEffect } from 'react';
import { TrendingUp, Package, Clock, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';
import { KPICard } from '@/components/KPICard';
import { FilterBar } from '@/components/FilterBar';
import { useAppStore } from '@/lib/store';
import { loadDemoData } from '@/lib/mockData';
import {
  calculateOTIF,
  calculateFillRate,
  calculateLeadTime,
  calculateDSO,
  calculateStockoutRate,
  calculateInventoryHealth,
} from '@/lib/kpis';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Overview() {
  const { 
    suppliers, 
    orders, 
    inventory, 
    payments, 
    consumerEvents,
    setSuppliers, 
    setOrders, 
    setInventory, 
    setPayments,
    setConsumerEvents,
  } = useAppStore();

  const loadDemo = () => {
    const data = loadDemoData();
    setSuppliers(data.suppliers);
    setOrders(data.orders);
    setInventory(data.inventory);
    setPayments(data.payments);
    setConsumerEvents(data.consumerEvents);
  };

  useEffect(() => {
    if (orders.length === 0) {
      loadDemo();
    }
  }, []);

  const otif = calculateOTIF(orders);
  const fillRate = calculateFillRate(orders);
  const leadTime = calculateLeadTime(orders);
  const dso = calculateDSO(payments);
  const stockoutRate = calculateStockoutRate(consumerEvents);
  const inventoryHealth = calculateInventoryHealth(inventory);

  // Mock data for charts
  const leadTimeData = Array.from({ length: 12 }, (_, i) => ({
    month: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][i],
    leadTime: leadTime + (Math.random() - 0.5) * 5,
  }));

  const otifData = [
    { name: 'On Time & In Full', value: otif, fill: 'hsl(var(--success))' },
    { name: 'Late or Incomplete', value: 100 - otif, fill: 'hsl(var(--destructive))' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">
            Monitoreo en tiempo real de KPIs de supply chain
          </p>
        </div>
        {orders.length === 0 && (
          <Button onClick={loadDemo} className="bg-primary hover:bg-primary/90">
            Cargar Datos Demo
          </Button>
        )}
      </div>

      <FilterBar />

      {/* Alertas */}
      <div className="grid gap-4">
        {otif < 90 && (
          <Card className="border-l-4 border-l-destructive rounded-2xl">
            <CardContent className="flex items-center gap-3 p-4">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div>
                <p className="font-medium text-foreground">OTIF por debajo del umbral</p>
                <p className="text-sm text-muted-foreground">
                  El OTIF actual ({otif.toFixed(1)}%) está por debajo del objetivo del 90%
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        {stockoutRate > 10 && (
          <Card className="border-l-4 border-l-warning rounded-2xl">
            <CardContent className="flex items-center gap-3 p-4">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <div>
                <p className="font-medium text-foreground">Alta tasa de quiebres de stock</p>
                <p className="text-sm text-muted-foreground">
                  Se detectaron {stockoutRate.toFixed(1)}% de eventos con stock agotado
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        {inventoryHealth > 85 && (
          <Card className="border-l-4 border-l-success rounded-2xl">
            <CardContent className="flex items-center gap-3 p-4">
              <CheckCircle className="h-5 w-5 text-success" />
              <div>
                <p className="font-medium text-foreground">Salud de inventario excelente</p>
                <p className="text-sm text-muted-foreground">
                  {inventoryHealth.toFixed(1)}% de los SKUs están por encima del stock de seguridad
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <KPICard
          title="OTIF (On Time In Full)"
          value={otif}
          unit="%"
          delta={2.3}
          status={otif >= 95 ? 'success' : otif >= 90 ? 'warning' : 'danger'}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <KPICard
          title="Fill Rate"
          value={fillRate}
          unit="%"
          delta={1.5}
          status={fillRate >= 97 ? 'success' : fillRate >= 90 ? 'warning' : 'danger'}
          icon={<Package className="h-5 w-5" />}
        />
        <KPICard
          title="Lead Time Promedio"
          value={leadTime}
          unit="días"
          delta={-0.8}
          status={leadTime <= 15 ? 'success' : leadTime <= 20 ? 'warning' : 'danger'}
          icon={<Clock className="h-5 w-5" />}
        />
        <KPICard
          title="DSO (Days Sales Outstanding)"
          value={dso}
          unit="días"
          delta={3.2}
          status={dso <= 30 ? 'success' : dso <= 45 ? 'warning' : 'danger'}
          icon={<CreditCard className="h-5 w-5" />}
        />
        <KPICard
          title="Tasa de Quiebres"
          value={stockoutRate}
          unit="%"
          delta={-1.2}
          status={stockoutRate <= 5 ? 'success' : stockoutRate <= 10 ? 'warning' : 'danger'}
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <KPICard
          title="Salud de Inventario"
          value={inventoryHealth}
          unit="%"
          delta={4.1}
          status={inventoryHealth >= 85 ? 'success' : inventoryHealth >= 70 ? 'warning' : 'danger'}
          icon={<Package className="h-5 w-5" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle>Lead Time Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={leadTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="leadTime" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle>OTIF vs No-OTIF</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={otifData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
