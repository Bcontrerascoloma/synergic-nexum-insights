import { useState, useMemo } from 'react';
import { Search, Download, Plus, X } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FilterBar } from '@/components/FilterBar';
import { OrderCreateDrawer } from '@/components/OrderCreateDrawer';

export default function Orders() {
  const { orders, suppliers } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const getSupplierName = (supplierId: string) => {
    const supplier = suppliers.find((s) => s.supplier_id === supplierId);
    return supplier ? supplier.name : supplierId;
  };

  const getSupplierCountry = (supplierId: string) => {
    const supplier = suppliers.find((s) => s.supplier_id === supplierId);
    return supplier?.country || '';
  };

  const getOrderStatus = (order: typeof orders[0]) => {
    if (order.status) return { label: order.status, variant: getStatusVariant(order.status) };
    if (!order.delivery_date) return { label: 'Pendiente', variant: 'secondary' as const };
    const onTime = order.delivery_date <= order.promise_date;
    const inFull = order.qty_received >= order.qty_ordered;
    
    if (onTime && inFull) return { label: 'OTIF', variant: 'default' as const };
    if (!onTime && !inFull) return { label: 'Late & Incomplete', variant: 'destructive' as const };
    if (!onTime) return { label: 'Late', variant: 'destructive' as const };
    return { label: 'Incomplete', variant: 'secondary' as const };
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Entregado': return 'default' as const;
      case 'Pendiente': return 'secondary' as const;
      case 'En Proceso': return 'outline' as const;
      case 'Cancelado': return 'destructive' as const;
      default: return 'secondary' as const;
    }
  };

  const countries = useMemo(() => 
    Array.from(new Set(orders.map(o => getSupplierCountry(o.supplier_id)).filter(Boolean))).sort(),
    [orders, suppliers]
  );

  const categories = useMemo(() => 
    Array.from(new Set(orders.map(o => o.category))).sort(),
    [orders]
  );

  const statuses = ['Pendiente', 'En Proceso', 'Entregado', 'Cancelado'];

  const filteredOrders = orders.filter(
    (order) => {
      const matchesSearch =
        order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getSupplierName(order.supplier_id).toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCountry = selectedCountries.length === 0 || 
        selectedCountries.includes(getSupplierCountry(order.supplier_id));
      
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(order.category);
      
      const status = getOrderStatus(order).label;
      const matchesStatus = selectedStatuses.length === 0 || 
        selectedStatuses.includes(status);

      return matchesSearch && matchesCountry && matchesCategory && matchesStatus;
    }
  );

  const toggleCountry = (country: string) => {
    setSelectedCountries(prev =>
      prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const clearFilters = () => {
    setSelectedCountries([]);
    setSelectedCategories([]);
    setSelectedStatuses([]);
  };

  const hasActiveFilters = selectedCountries.length > 0 || 
    selectedCategories.length > 0 || selectedStatuses.length > 0;

  const exportCSV = () => {
    const headers = ['Orden', 'Proveedor', 'País', 'SKU', 'Categoría', 'Fecha Orden', 
                     'Fecha Promesa', 'Cantidad', 'Precio', 'Estado'];
    const rows = filteredOrders.map(o => [
      o.order_id,
      getSupplierName(o.supplier_id),
      getSupplierCountry(o.supplier_id),
      o.sku,
      o.category,
      o.order_date,
      o.promise_date,
      o.qty_ordered,
      o.unit_price,
      getOrderStatus(o).label,
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Órdenes de Compra</h1>
          <p className="text-muted-foreground mt-1">
            {filteredOrders.length} de {orders.length} órdenes
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={() => setDrawerOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Orden
          </Button>
        </div>
      </div>

      <FilterBar />

      <Card className="rounded-2xl shadow-[var(--shadow-card)]">
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por orden, SKU o proveedor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-2 block">País</label>
                <div className="flex flex-wrap gap-2">
                  {countries.map(country => (
                    <Badge
                      key={country}
                      variant={selectedCountries.includes(country) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleCountry(country)}
                    >
                      {country}
                      {selectedCountries.includes(country) && (
                        <X className="ml-1 h-3 w-3" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Categoría</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <Badge
                      key={category}
                      variant={selectedCategories.includes(category) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleCategory(category)}
                    >
                      {category}
                      {selectedCategories.includes(category) && (
                        <X className="ml-1 h-3 w-3" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Estado</label>
                <div className="flex flex-wrap gap-2">
                  {statuses.map(status => (
                    <Badge
                      key={status}
                      variant={selectedStatuses.includes(status) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleStatus(status)}
                    >
                      {status}
                      {selectedStatuses.includes(status) && (
                        <X className="ml-1 h-3 w-3" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Limpiar filtros
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-auto max-h-[600px]">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead>Orden</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>País</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Fecha Orden</TableHead>
                  <TableHead>Fecha Promesa</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.slice(0, 100).map((order) => {
                  const status = getOrderStatus(order);
                  return (
                    <TableRow key={order.order_id}>
                      <TableCell className="font-mono text-sm">{order.order_id}</TableCell>
                      <TableCell className="font-medium">{getSupplierName(order.supplier_id)}</TableCell>
                      <TableCell>{getSupplierCountry(order.supplier_id)}</TableCell>
                      <TableCell>{order.sku}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{order.category}</Badge>
                      </TableCell>
                      <TableCell>{order.order_date}</TableCell>
                      <TableCell>{order.promise_date}</TableCell>
                      <TableCell className="text-right">{order.qty_ordered}</TableCell>
                      <TableCell className="text-right">
                        ${order.unit_price.toFixed(2)} {order.currency || 'USD'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <OrderCreateDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  );
}
