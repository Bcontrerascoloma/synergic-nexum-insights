import { Upload, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { loadDemoData } from '@/lib/mockData';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';

export default function Uploads() {
  const { setSuppliers, setOrders, setInventory, setPayments, setConsumerEvents } = useAppStore();

  const handleLoadDemo = () => {
    const data = loadDemoData();
    setSuppliers(data.suppliers);
    setOrders(data.orders);
    setInventory(data.inventory);
    setPayments(data.payments);
    setConsumerEvents(data.consumerEvents);
    
    toast.success('Datos demo cargados exitosamente', {
      description: `${data.suppliers.length} proveedores, ${data.orders.length} órdenes, ${data.inventory.length} registros de inventario`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Carga de Datos</h1>
        <p className="text-muted-foreground mt-1">
          Importa archivos CSV o XLSX para actualizar tus datos
        </p>
      </div>

      <Card className="rounded-2xl shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle>Cargar Datos Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Genera y carga datos de ejemplo para explorar todas las funcionalidades del dashboard.
            Incluye proveedores, órdenes, inventario, pagos y eventos de consumidor.
          </p>
          <Button onClick={handleLoadDemo} className="w-full bg-primary hover:bg-primary/90">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Cargar Datos Demo
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle>Importar Archivos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-foreground font-medium mb-2">
              Arrastra archivos aquí o haz clic para seleccionar
            </p>
            <p className="text-sm text-muted-foreground">
              Soporta archivos CSV y XLSX (máximo 10MB)
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" disabled>
              Cargar Proveedores
            </Button>
            <Button variant="outline" disabled>
              Cargar Órdenes
            </Button>
            <Button variant="outline" disabled>
              Cargar Inventario
            </Button>
            <Button variant="outline" disabled>
              Cargar Pagos
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            Funcionalidad de carga de archivos en desarrollo
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
