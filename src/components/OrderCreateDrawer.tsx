import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/lib/store";
import { ProviderPicker } from "./ProviderPicker";
import type { Supplier, Order } from "@/lib/types";

interface OrderCreateDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = ['Químico', 'Envase', 'Logística', 'Materias Primas', 'Componentes'];
const incoterms = ['FOB', 'CIF', 'DDP', 'EXW'];
const currencies = ['USD', 'CLP', 'EUR'];

export function OrderCreateDrawer({ open, onOpenChange }: OrderCreateDrawerProps) {
  const { toast } = useToast();
  const { orders, setOrders } = useAppStore();
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({
    sku: '',
    category: '',
    description: '',
    quantity: '',
    unitPrice: '',
    incoterm: 'FOB',
    requiredDate: '',
    currency: 'USD',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSupplier) {
      toast({
        title: "Error",
        description: "Debes seleccionar un proveedor",
        variant: "destructive",
      });
      return;
    }

    const newOrder: Order = {
      order_id: `ORD-${String(orders.length + 1).padStart(6, '0')}`,
      supplier_id: selectedSupplier.supplier_id,
      sku: formData.sku,
      category: formData.category,
      order_date: new Date().toISOString().split('T')[0],
      promise_date: formData.requiredDate,
      delivery_date: null,
      qty_ordered: parseInt(formData.quantity),
      qty_received: 0,
      unit_price: parseFloat(formData.unitPrice),
      incoterm: formData.incoterm,
      site: 'Planta Santiago',
      description: formData.description,
      currency: formData.currency,
      status: 'Pendiente',
    };

    setOrders([...orders, newOrder]);
    
    toast({
      title: "Orden creada",
      description: `Orden ${newOrder.order_id} creada exitosamente`,
    });

    // Reset form
    setFormData({
      sku: '',
      category: '',
      description: '',
      quantity: '',
      unitPrice: '',
      incoterm: 'FOB',
      requiredDate: '',
      currency: 'USD',
    });
    setSelectedSupplier(null);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Crear Orden de Compra</SheetTitle>
          <SheetDescription>
            Completa los datos para crear una nueva orden de compra
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold mb-3 block">Seleccionar Proveedor</Label>
              <ProviderPicker
                selectedSupplier={selectedSupplier}
                onSelectSupplier={setSelectedSupplier}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  required
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="SKU-001"
                />
              </div>

              <div>
                <Label htmlFor="category">Categoría *</Label>
                <Select
                  required
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción del producto..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="quantity">Cantidad *</Label>
                <Input
                  id="quantity"
                  type="number"
                  required
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="100"
                />
              </div>

              <div>
                <Label htmlFor="unitPrice">Precio Unit. *</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="currency">Moneda *</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => setFormData({ ...formData, currency: value })}
                >
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((curr) => (
                      <SelectItem key={curr} value={curr}>{curr}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="incoterm">Incoterm *</Label>
                <Select
                  value={formData.incoterm}
                  onValueChange={(value) => setFormData({ ...formData, incoterm: value })}
                >
                  <SelectTrigger id="incoterm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {incoterms.map((term) => (
                      <SelectItem key={term} value={term}>{term}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="requiredDate">Fecha Requerida *</Label>
                <Input
                  id="requiredDate"
                  type="date"
                  required
                  value={formData.requiredDate}
                  onChange={(e) => setFormData({ ...formData, requiredDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Crear Orden
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
