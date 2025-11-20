import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Download, Mail, Eye, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SupplierContactModal } from "@/components/SupplierContactModal";
import type { Supplier } from "@/lib/types";

export default function Suppliers() {
  const { suppliers } = useAppStore();
  const [search, setSearch] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [contactModalSupplier, setContactModalSupplier] = useState<Supplier | null>(null);

  const countries = Array.from(new Set(suppliers.map(s => s.country))).sort();
  const categories = Array.from(new Set(suppliers.map(s => s.category))).sort();

  const filteredSuppliers = suppliers.filter((s) => {
    const matchesSearch = 
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.supplier_id.toLowerCase().includes(search.toLowerCase()) ||
      s.country.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase());
    
    const matchesCountry = selectedCountries.length === 0 || selectedCountries.includes(s.country);
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(s.category);
    
    return matchesSearch && matchesCountry && matchesCategory;
  });

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

  const clearFilters = () => {
    setSelectedCountries([]);
    setSelectedCategories([]);
  };

  const hasActiveFilters = selectedCountries.length > 0 || selectedCategories.length > 0;

  const exportCSV = () => {
    const headers = ['ID', 'Nombre', 'País', 'Región', 'Categoría', 'Lead Time', 'Costo', 'Calidad', 'OTIF %'];
    const rows = filteredSuppliers.map(s => [
      s.supplier_id,
      s.name,
      s.country,
      s.region,
      s.category,
      s.lead_time_days,
      s.unit_cost,
      s.quality_score_1_5,
      s.otif_pct,
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `suppliers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (suppliers.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Proveedores</h1>
        <Card className="rounded-2xl shadow-[var(--shadow-card)]">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">
              No hay proveedores cargados. Ve a <span className="font-bold text-primary">/uploads</span> para importar datos.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Proveedores</h1>
          <p className="text-muted-foreground mt-1">
            {filteredSuppliers.length} de {suppliers.length} proveedores
          </p>
        </div>
        <Button onClick={exportCSV} className="bg-primary hover:bg-primary/90">
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      <Card className="rounded-2xl shadow-[var(--shadow-card)]">
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, ID, país o categoría..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filter Sections */}
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
          <div className="overflow-auto max-h-[600px] border rounded-lg">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>País</TableHead>
                  <TableHead>Región</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right">Lead Time</TableHead>
                  <TableHead className="text-right">Costo</TableHead>
                  <TableHead className="text-right">Calidad</TableHead>
                  <TableHead className="text-right">OTIF %</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.supplier_id}>
                    <TableCell className="font-mono text-xs">{supplier.supplier_id}</TableCell>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.country}</TableCell>
                    <TableCell>{supplier.region || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{supplier.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{supplier.lead_time_days ?? '-'}d</TableCell>
                    <TableCell className="text-right">${supplier.unit_cost?.toFixed(2) ?? '-'}</TableCell>
                    <TableCell className="text-right">{supplier.quality_score_1_5?.toFixed(1) ?? '-'}/5</TableCell>
                    <TableCell className="text-right">{supplier.otif_pct?.toFixed(1) ?? '-'}%</TableCell>
                    <TableCell>
                      <Badge variant={supplier.is_active ? "default" : "secondary"}>
                        {supplier.is_active ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setContactModalSupplier(supplier)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <SupplierContactModal
        supplier={contactModalSupplier}
        open={contactModalSupplier !== null}
        onOpenChange={(open) => !open && setContactModalSupplier(null)}
      />
    </div>
  );
}
