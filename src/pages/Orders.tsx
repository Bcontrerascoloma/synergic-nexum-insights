import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FilterBar } from '@/components/FilterBar';

export default function Orders() {
  const { orders, suppliers } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');

  const getSupplierName = (supplierId: string) => {
    const supplier = suppliers.find((s) => s.supplier_id === supplierId);
    return supplier ? supplier.name : supplierId;
  };

  const getOrderStatus = (order: typeof orders[0]) => {
    if (!order.delivery_date) return { label: 'Pendiente', variant: 'secondary' as const };
    const onTime = order.delivery_date <= order.promise_date;
    const inFull = order.qty_received >= order.qty_ordered;
    
    if (onTime && inFull) return { label: 'OTIF', variant: 'default' as const };
    if (!onTime && !inFull) return { label: 'Late & Incomplete', variant: 'destructive' as const };
    if (!onTime) return { label: 'Late', variant: 'destructive' as const };
    return { label: 'Incomplete', variant: 'secondary' as const };
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getSupplierName(order.supplier_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Órdenes de Compra</h1>
        <p className="text-muted-foreground mt-1">
          Seguimiento de {orders.length} órdenes y su cumplimiento
        </p>
      </div>

      <FilterBar />

      <Card className="rounded-2xl shadow-[var(--shadow-card)]">
        <CardHeader>
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
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros avanzados
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Orden</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Fecha Orden</TableHead>
                  <TableHead>Fecha Promesa</TableHead>
                  <TableHead>Fecha Entrega</TableHead>
                  <TableHead className="text-right">Qty Ordenada</TableHead>
                  <TableHead className="text-right">Qty Recibida</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.slice(0, 50).map((order) => {
                  const status = getOrderStatus(order);
                  return (
                    <TableRow key={order.order_id}>
                      <TableCell className="font-mono text-sm">{order.order_id}</TableCell>
                      <TableCell className="font-medium">{getSupplierName(order.supplier_id)}</TableCell>
                      <TableCell>{order.sku}</TableCell>
                      <TableCell>{order.order_date}</TableCell>
                      <TableCell>{order.promise_date}</TableCell>
                      <TableCell>{order.delivery_date || '-'}</TableCell>
                      <TableCell className="text-right">{order.qty_ordered.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{order.qty_received.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {filteredOrders.length > 50 && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Mostrando 50 de {filteredOrders.length} órdenes
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
