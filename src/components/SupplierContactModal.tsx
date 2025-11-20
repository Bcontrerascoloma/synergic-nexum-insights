import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Globe, User, MapPin } from "lucide-react";
import type { Supplier } from "@/lib/types";

interface SupplierContactModalProps {
  supplier: Supplier | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SupplierContactModal({ supplier, open, onOpenChange }: SupplierContactModalProps) {
  if (!supplier) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Información de Contacto</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">{supplier.name}</h3>
            <div className="flex gap-2">
              <Badge variant="outline">{supplier.category}</Badge>
              <Badge variant={supplier.is_active ? "default" : "secondary"}>
                {supplier.is_active ? "Activo" : "Inactivo"}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supplier.contact_email && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <a 
                    href={`mailto:${supplier.contact_email}`}
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    {supplier.contact_email}
                  </a>
                </div>
              </div>
            )}

            {supplier.contact_phone && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <Phone className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Teléfono</p>
                  <a 
                    href={`tel:${supplier.contact_phone}`}
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    {supplier.contact_phone}
                  </a>
                </div>
              </div>
            )}

            {supplier.contact_website && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <Globe className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Sitio Web</p>
                  <a 
                    href={supplier.contact_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    {supplier.contact_website}
                  </a>
                </div>
              </div>
            )}

            {supplier.contact_responsible && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <User className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Responsable</p>
                  <p className="text-sm font-medium">{supplier.contact_responsible}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Dirección</p>
              <p className="text-sm font-medium">
                {supplier.contact_address || `${supplier.city}, ${supplier.region}, ${supplier.country}`}
              </p>
            </div>
          </div>

          {supplier.notes && (
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-1">Notas</p>
              <p className="text-sm">{supplier.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
