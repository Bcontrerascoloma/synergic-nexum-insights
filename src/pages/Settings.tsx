import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
        <p className="text-muted-foreground mt-1">
          Administra umbrales, branding y preferencias del sistema
        </p>
      </div>

      <Card className="rounded-2xl shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Umbrales de KPIs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Configura los umbrales para alertas y clasificación de estado de KPIs.
          </p>
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="font-medium text-foreground">OTIF Objetivo</p>
              <p className="text-sm text-muted-foreground">Valor actual: 95%</p>
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="font-medium text-foreground">Fill Rate Objetivo</p>
              <p className="text-sm text-muted-foreground">Valor actual: 97%</p>
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="font-medium text-foreground">DSO Objetivo</p>
              <p className="text-sm text-muted-foreground">Valor actual: 30 días</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle>Personalización</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Funcionalidad de personalización de branding en desarrollo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
