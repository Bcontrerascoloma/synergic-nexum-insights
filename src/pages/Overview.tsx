import { useEffect } from 'react';
import { TrendingUp, Package, Clock, Award, CheckCircle, AlertTriangle } from 'lucide-react';
import { KPICard } from '@/components/KPICard';
import { FilterBar } from '@/components/FilterBar';
import { useAppStore } from '@/lib/store';
import { loadDemoData } from '@/lib/mockData';
import {
  calculateOTIF,
  calculateFillRate,
  calculateLeadTime,
  calculateAvgQuality,
  calculateAvgService,
  calculateCertificationRate,
} from '@/lib/kpis';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Overview() {
  const { 
    suppliers, 
    orders, 
    setSuppliers, 
    setOrders,
    setClientSites,
  } = useAppStore();

  const loadDemo = () => {
    const data = loadDemoData();
    setSuppliers(data.suppliers);
    setOrders(data.orders);
    setClientSites(data.clientSites);
  };

  useEffect(() => {
    if (orders.length === 0) {
      loadDemo();
    }
  }, []);

  const otif = calculateOTIF(orders);
  const fillRate = calculateFillRate(orders);
  const leadTime = calculateLeadTime(orders);
  const avgQuality = calculateAvgQuality(suppliers);
  const avgService = calculateAvgService(suppliers);
  const certRate = calculateCertificationRate(suppliers);

  // Mock data for charts
  const leadTimeData = Array.from({ length: 12 }, (_, i) => ({
    month: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][i],
    leadTime: leadTime + (Math.random() - 0.5) * 5,
  }));

  const otifData = [
    { name: 'On Time & In Full', value: otif, fill: 'hsl(var(--success))' },
    { name: 'Late or Incomplete', value: 100 - otif, fill: 'hsl(var(--destructive))' },
  ];

  const categoryData = suppliers.reduce((acc, s) => {
    const existing = acc.find(item => item.name === s.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: s.category, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--muted))'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">
            Sistema de selección y gestión de proveedores
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
        {avgQuality < 3.5 && (
          <Card className="border-l-4 border-l-warning rounded-2xl">
            <CardContent className="flex items-center gap-3 p-4">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <div>
                <p className="font-medium text-foreground">Calidad promedio baja</p>
                <p className="text-sm text-muted-foreground">
                  La calidad promedio ({avgQuality.toFixed(2)}/5) requiere atención
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        {certRate > 80 && (
          <Card className="border-l-4 border-l-success rounded-2xl">
            <CardContent className="flex items-center gap-3 p-4">
              <CheckCircle className="h-5 w-5 text-success" />
              <div>
                <p className="font-medium text-foreground">Excelente tasa de certificación</p>
                <p className="text-sm text-muted-foreground">
                  {certRate.toFixed(1)}% de los proveedores activos tienen certificaciones
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
          title="Calidad Promedio"
          value={avgQuality}
          unit="/5"
          delta={0.2}
          status={avgQuality >= 4 ? 'success' : avgQuality >= 3.5 ? 'warning' : 'danger'}
          icon={<Award className="h-5 w-5" />}
        />
        <KPICard
          title="Servicio Promedio"
          value={avgService}
          unit="/5"
          delta={0.3}
          status={avgService >= 4 ? 'success' : avgService >= 3.5 ? 'warning' : 'danger'}
          icon={<Award className="h-5 w-5" />}
        />
        <KPICard
          title="Tasa de Certificación"
          value={certRate}
          unit="%"
          delta={4.1}
          status={certRate >= 80 ? 'success' : certRate >= 60 ? 'warning' : 'danger'}
          icon={<CheckCircle className="h-5 w-5" />}
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

        <Card className="rounded-2xl shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle>Mix por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
