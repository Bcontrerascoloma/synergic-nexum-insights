import { useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Supplier } from "@/lib/types";

interface ProviderPickerProps {
  selectedSupplier: Supplier | null;
  onSelectSupplier: (supplier: Supplier | null) => void;
}

export function ProviderPicker({ selectedSupplier, onSelectSupplier }: ProviderPickerProps) {
  const { suppliers } = useAppStore();
  const [open, setOpen] = useState(false);
  
  // Filters
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minQuality, setMinQuality] = useState([0]);
  const [minService, setMinService] = useState([0]);
  const [minSustainability, setMinSustainability] = useState([0]);
  const [esgGateOnly, setEsgGateOnly] = useState(false);

  const countries = useMemo(() => 
    Array.from(new Set(suppliers.map(s => s.country))).sort(),
    [suppliers]
  );

  const categories = useMemo(() => 
    Array.from(new Set(suppliers.map(s => s.category))).sort(),
    [suppliers]
  );

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(supplier => {
      if (selectedCountries.length > 0 && !selectedCountries.includes(supplier.country)) return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(supplier.category)) return false;
      if (supplier.quality_score_1_5 < minQuality[0]) return false;
      if (supplier.service_score_1_5 < minService[0]) return false;
      if (supplier.sustainability_score_1_5 < minSustainability[0]) return false;
      if (esgGateOnly && supplier.sustainability_score_1_5 < 3.5) return false;
      return true;
    });
  }, [suppliers, selectedCountries, selectedCategories, minQuality, minService, minSustainability, esgGateOnly]);

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
    setMinQuality([0]);
    setMinService([0]);
    setMinSustainability([0]);
    setEsgGateOnly(false);
  };

  const hasFilters = selectedCountries.length > 0 || selectedCategories.length > 0 || 
                     minQuality[0] > 0 || minService[0] > 0 || minSustainability[0] > 0 || esgGateOnly;

  return (
    <div className="space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedSupplier ? selectedSupplier.name : "Seleccionar proveedor..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[600px] p-0" align="start">
          <div className="flex">
            {/* Filters Panel */}
            <div className="w-64 border-r p-4 space-y-4 overflow-y-auto max-h-[500px]">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">Filtros</h4>
                {hasFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Limpiar
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-xs mb-2 block">País</Label>
                  <div className="space-y-1">
                    {countries.map(country => (
                      <div key={country} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`country-${country}`}
                          checked={selectedCountries.includes(country)}
                          onChange={() => toggleCountry(country)}
                          className="rounded"
                        />
                        <label htmlFor={`country-${country}`} className="text-sm cursor-pointer">
                          {country}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs mb-2 block">Categoría</Label>
                  <div className="space-y-1">
                    {categories.map(category => (
                      <div key={category} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`cat-${category}`}
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="rounded"
                        />
                        <label htmlFor={`cat-${category}`} className="text-sm cursor-pointer">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs mb-2 block">
                    Calidad Mín: {minQuality[0].toFixed(1)}/5
                  </Label>
                  <Slider
                    value={minQuality}
                    onValueChange={setMinQuality}
                    min={0}
                    max={5}
                    step={0.1}
                  />
                </div>

                <div>
                  <Label className="text-xs mb-2 block">
                    Servicio Mín: {minService[0].toFixed(1)}/5
                  </Label>
                  <Slider
                    value={minService}
                    onValueChange={setMinService}
                    min={0}
                    max={5}
                    step={0.1}
                  />
                </div>

                <div>
                  <Label className="text-xs mb-2 block">
                    Sustentabilidad Mín: {minSustainability[0].toFixed(1)}/5
                  </Label>
                  <Slider
                    value={minSustainability}
                    onValueChange={setMinSustainability}
                    min={0}
                    max={5}
                    step={0.1}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="esg-gate" className="text-xs">ESG Gate (≥3.5)</Label>
                  <Switch
                    id="esg-gate"
                    checked={esgGateOnly}
                    onCheckedChange={setEsgGateOnly}
                  />
                </div>
              </div>
            </div>

            {/* Suppliers List */}
            <div className="flex-1">
              <Command>
                <CommandInput placeholder="Buscar proveedor..." />
                <CommandEmpty>No se encontraron proveedores.</CommandEmpty>
                <CommandGroup className="max-h-[500px] overflow-y-auto">
                  {filteredSuppliers.map((supplier) => (
                    <CommandItem
                      key={supplier.supplier_id}
                      value={supplier.supplier_id}
                      onSelect={() => {
                        onSelectSupplier(supplier);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedSupplier?.supplier_id === supplier.supplier_id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <div className="flex-1">
                        <div className="font-medium">{supplier.name}</div>
                        <div className="flex gap-1 mt-1">
                          <Badge variant="outline" className="text-xs">{supplier.category}</Badge>
                          <Badge variant="secondary" className="text-xs">{supplier.country}</Badge>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {selectedSupplier && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
          <div className="flex-1">
            <p className="font-medium">{selectedSupplier.name}</p>
            <div className="flex gap-2 mt-1">
              <Badge variant="outline">{selectedSupplier.category}</Badge>
              <Badge variant="secondary">{selectedSupplier.country}</Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectSupplier(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {hasFilters && (
        <div className="text-xs text-muted-foreground">
          {filteredSuppliers.length} proveedor(es) disponible(s) con los filtros aplicados
        </div>
      )}
    </div>
  );
}
