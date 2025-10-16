import { Info, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function ScoringFieldsInfo() {
  const requiredFields = [
    { name: "supplier_id", alt: "id", description: "Identificador único del proveedor", type: "text", required: true },
    { name: "name", alt: "nombre", description: "Nombre del proveedor", type: "text", required: true },
  ];

  const scoringFields = [
    { 
      name: "unit_cost", 
      alt: "costo_unitario, precio", 
      description: "Costo por unidad", 
      type: "number",
      criterion: "Menor es mejor",
      example: "125.50"
    },
    { 
      name: "lead_time_days", 
      alt: "lead_time, tiempo_entrega", 
      description: "Tiempo de entrega promedio en días", 
      type: "number",
      criterion: "Menor es mejor",
      example: "15"
    },
    { 
      name: "lead_time_sigma", 
      alt: "variabilidad_lt", 
      description: "Desviación estándar del lead time", 
      type: "number",
      criterion: "Menor es mejor",
      example: "3.5"
    },
    { 
      name: "distance_km", 
      alt: "distancia", 
      description: "Distancia en kilómetros desde el cliente", 
      type: "number",
      criterion: "Menor es mejor (opcional)",
      example: "450"
    },
    { 
      name: "quality_score_1_5", 
      alt: "calidad", 
      description: "Puntuación de calidad (1-5)", 
      type: "number",
      criterion: "Mayor es mejor",
      example: "4.2"
    },
    { 
      name: "service_score_1_5", 
      alt: "servicio", 
      description: "Puntuación de servicio (1-5)", 
      type: "number",
      criterion: "Mayor es mejor",
      example: "4.5"
    },
    { 
      name: "sustainability_score_1_5", 
      alt: "sostenibilidad", 
      description: "Puntuación de sostenibilidad (1-5)", 
      type: "number",
      criterion: "Mayor es mejor",
      example: "3.8"
    },
    { 
      name: "otif_pct", 
      alt: "otif", 
      description: "Porcentaje OTIF (On Time In Full)", 
      type: "number",
      criterion: "Mayor es mejor",
      example: "95.5"
    },
    { 
      name: "capacity_units_month", 
      alt: "capacidad", 
      description: "Capacidad mensual en unidades", 
      type: "number",
      criterion: "Mayor es mejor",
      example: "50000"
    },
    { 
      name: "moq", 
      alt: "pedido_minimo", 
      description: "Cantidad mínima de pedido", 
      type: "number",
      criterion: "Menor es mejor",
      example: "1000"
    },
    { 
      name: "risk_score_1_5", 
      alt: "riesgo", 
      description: "Puntuación de riesgo (1-5)", 
      type: "number",
      criterion: "Menor es mejor",
      example: "2.3"
    },
  ];

  const optionalFields = [
    { name: "country", alt: "pais", description: "País del proveedor", example: "Chile" },
    { name: "region", alt: "zona", description: "Región del proveedor", example: "Los Lagos" },
    { name: "city", alt: "ciudad", description: "Ciudad del proveedor", example: "Puerto Montt" },
    { name: "category", alt: "categoria", description: "Categoría del proveedor", example: "Químicos" },
    { name: "certifications", alt: "", description: "Certificaciones separadas por coma", example: "ISO9001,RSPO" },
    { name: "is_active", alt: "activo", description: "Estado del proveedor (true/false)", example: "true" },
    { name: "lat", alt: "latitud", description: "Latitud (para cálculo de distancia)", example: "-41.4693" },
    { name: "lon", alt: "longitud", description: "Longitud (para cálculo de distancia)", example: "-72.9424" },
    { name: "payment_terms_days", alt: "terminos_pago", description: "Días de pago", example: "30" },
    { name: "contact_email", alt: "email, correo", description: "Email de contacto", example: "contacto@proveedor.com" },
    { name: "notes", alt: "notas", description: "Notas adicionales", example: "Proveedor preferente" },
  ];

  return (
    <Card className="rounded-2xl shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          Campos para Scoring de Proveedores
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-foreground mb-2">
            <strong>📊 Sistema de scoring multi-criterio</strong>
          </p>
          <p className="text-sm text-muted-foreground">
            El sistema de scoring evalúa proveedores usando 11 KPIs configurables. 
            Mientras más campos incluyas en tu CSV/XLSX, más preciso será el ranking.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="required">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Badge variant="destructive">Obligatorios</Badge>
                <span>Campos mínimos requeridos ({requiredFields.length})</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                {requiredFields.map((field) => (
                  <div key={field.name} className="border-l-4 border-primary pl-4 py-2">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-sm font-mono bg-primary/10 px-2 py-0.5 rounded">
                        {field.name}
                      </code>
                      {field.alt && (
                        <span className="text-xs text-muted-foreground">
                          o {field.alt}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{field.description}</p>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="scoring">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Badge className="bg-primary">Scoring KPIs</Badge>
                <span>Campos para el sistema de puntuación ({scoringFields.length})</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                {scoringFields.map((field) => (
                  <div key={field.name} className="border-l-4 border-accent pl-4 py-2">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <code className="text-sm font-mono bg-accent/10 px-2 py-0.5 rounded">
                            {field.name}
                          </code>
                          {field.alt && (
                            <span className="text-xs text-muted-foreground">
                              o {field.alt}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{field.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Ejemplo: <code className="bg-muted px-1 rounded">{field.example}</code>
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs whitespace-nowrap">
                        {field.criterion}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="optional">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Opcionales</Badge>
                <span>Campos adicionales recomendados ({optionalFields.length})</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                {optionalFields.map((field) => (
                  <div key={field.name} className="border-l-4 border-muted pl-4 py-2">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-sm font-mono bg-muted/50 px-2 py-0.5 rounded">
                        {field.name}
                      </code>
                      {field.alt && (
                        <span className="text-xs text-muted-foreground">
                          o {field.alt}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{field.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Ejemplo: <code className="bg-muted px-1 rounded">{field.example}</code>
                    </p>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="bg-success/10 border border-success/20 rounded-lg p-4 mt-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
            <div className="space-y-2 text-sm">
              <p className="font-medium text-success">Tips para mejores resultados:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>El sistema reconoce nombres alternativos (ej: "nombre" o "name")</li>
                <li>Los valores numéricos se convierten automáticamente</li>
                <li>Las certificaciones pueden ir separadas por comas</li>
                <li>Si falta un campo de scoring, se asignará un valor neutral por defecto</li>
                <li>Los datos se pueden actualizar subiendo un nuevo archivo con los mismos supplier_id</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
