import { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { useAppStore } from "@/lib/store";
import { Supplier } from "@/lib/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, ArrowRight } from "lucide-react";
import { ScoringFieldsInfo } from "@/components/ScoringFieldsInfo";
import { Link } from "react-router-dom";

export default function Uploads() {
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const { setSuppliers, suppliers: existingSuppliers } = useAppStore();

  // Mapea datos crudos a formato Supplier
  const mapToSuppliers = (data: any[]): Supplier[] => {
    return data.map((row, index) => ({
      supplier_id: row.supplier_id || row.id || `SUP-${Date.now()}-${index}`,
      name: row.name || row.nombre || "Sin nombre",
      country: row.country || row.pais || "N/A",
      region: row.region || row.zona || "",
      city: row.city || row.ciudad || "",
      lat: parseFloat(row.lat || row.latitud) || undefined,
      lon: parseFloat(row.lon || row.longitud) || undefined,
      distance_km: parseFloat(row.distance_km || row.distancia) || undefined,
      category: row.category || row.categoria || "General",
      certifications: Array.isArray(row.certifications) 
        ? row.certifications 
        : typeof row.certifications === 'string' 
          ? row.certifications.split(',').map(c => c.trim()) 
          : [],
      is_active: row.is_active === true || row.is_active === "true" || row.activo === "true" || true,
      lead_time_days: parseFloat(row.lead_time_days || row.lead_time || row.tiempo_entrega) || 0,
      lead_time_sigma: parseFloat(row.lead_time_sigma || row.variabilidad_lt) || 0,
      unit_cost: parseFloat(row.unit_cost || row.costo_unitario || row.precio) || 0,
      moq: parseFloat(row.moq || row.pedido_minimo) || 0,
      capacity_units_month: parseFloat(row.capacity_units_month || row.capacidad) || 0,
      quality_score_1_5: parseFloat(row.quality_score_1_5 || row.calidad) || 3,
      service_score_1_5: parseFloat(row.service_score_1_5 || row.servicio) || 3,
      sustainability_score_1_5: parseFloat(row.sustainability_score_1_5 || row.sostenibilidad) || 3,
      otif_pct: parseFloat(row.otif_pct || row.otif) || 0,
      risk_score_1_5: parseFloat(row.risk_score_1_5 || row.riesgo) || 3,
      payment_terms_days: parseFloat(row.payment_terms_days || row.terminos_pago) || 30,
      early_payment_discount_pct: parseFloat(row.early_payment_discount_pct || row.descuento_pronto_pago) || 0,
      tax_compliance_score_1_5: parseFloat(row.tax_compliance_score_1_5 || row.compliance_fiscal) || 3,
      cash_flow_impact_days: parseFloat(row.cash_flow_impact_days || row.impacto_flujo_caja) || 30,
      contact_email: row.contact_email || row.email || row.correo || "",
      notes: row.notes || row.notas || "",
    }));
  };

  // Maneja la carga de archivo
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setMessage("Leyendo archivo...");

    const ext = file.name.split(".").pop()?.toLowerCase();

    try {
      if (ext === "csv") {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const mappedSuppliers = mapToSuppliers(results.data);
            setPreview(results.data.slice(0, 50));
            setSuppliers(mappedSuppliers);
            console.log("✅ Proveedores guardados en store:", mappedSuppliers.length);
            setMessage(`✅ ${mappedSuppliers.length} proveedores cargados`);
            toast.success(`${mappedSuppliers.length} proveedores importados correctamente`);
          },
          error: (err) => {
            setMessage(`❌ Error al leer CSV: ${err.message}`);
            toast.error(`Error: ${err.message}`);
          },
        });
      } else if (ext === "xlsx") {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        const mappedSuppliers = mapToSuppliers(jsonData);
        setPreview(jsonData.slice(0, 50));
        setSuppliers(mappedSuppliers);
        console.log("✅ Proveedores guardados en store:", mappedSuppliers.length);
        setMessage(`✅ ${mappedSuppliers.length} proveedores cargados`);
        toast.success(`${mappedSuppliers.length} proveedores importados correctamente`);
      } else {
        setMessage("❌ Solo se admiten archivos CSV o XLSX");
        toast.error("Formato no soportado. Usa CSV o XLSX");
      }
    } catch (err: any) {
      setMessage(`❌ Error al procesar archivo: ${err.message}`);
      toast.error(`Error al procesar: ${err.message}`);
    }
  };

  // Cargar datos demo
  const loadDemo = () => {
    const { generateMockSuppliers } = require("@/lib/mockData");
    const demoSuppliers = generateMockSuppliers();
    setSuppliers(demoSuppliers);
    toast.success(`${demoSuppliers.length} proveedores demo cargados`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Importar Datos</h1>
          <p className="text-muted-foreground mt-1">
            Carga proveedores desde CSV o XLSX para usar en el sistema de scoring
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadDemo} variant="outline">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Cargar Datos Demo
          </Button>
          <Link to="/scoring">
            <Button className="bg-primary hover:bg-primary/90">
              Ir a Scoring
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Documentación de campos */}
      <ScoringFieldsInfo />

      <div className="bg-card rounded-2xl shadow-[var(--shadow-card)] p-8">
        <div className="border-2 border-dashed border-primary/30 rounded-2xl p-12 text-center hover:border-primary/50 transition-colors">
          <Upload className="h-12 w-12 mx-auto text-primary/60 mb-4" />
          <input
            type="file"
            accept=".csv, .xlsx"
            onChange={handleFile}
            className="cursor-pointer text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
          <p className="text-muted-foreground mt-4 text-sm">
            Soporta archivos CSV y XLSX (máx. 10 MB)
          </p>
        </div>

        {fileName && (
          <div className="mt-6 p-4 bg-primary/5 rounded-lg">
            <p className="text-sm font-medium text-foreground">
              📄 Archivo cargado: <span className="text-primary">{fileName}</span>
            </p>
          </div>
        )}

        {message && (
          <div className={`mt-4 p-3 rounded-lg ${message.includes('❌') ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'}`}>
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}
      </div>

      {preview.length > 0 && (
        <div className="bg-card rounded-2xl shadow-[var(--shadow-card)] p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">
            Vista previa (primeras 50 filas)
          </h3>
          <div className="overflow-auto max-h-[500px] border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-primary/5 sticky top-0">
                <tr>
                  {Object.keys(preview[0]).map((col) => (
                    <th key={col} className="border-b px-4 py-2 text-left font-medium text-foreground">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} className="hover:bg-muted/50">
                    {Object.values(row).map((v, j) => (
                      <td key={j} className="border-b px-4 py-2 text-muted-foreground">
                        {String(v)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {existingSuppliers.length > 0 && (
        <div className="bg-card rounded-2xl shadow-[var(--shadow-card)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                Estado actual del sistema
              </h3>
              <p className="text-muted-foreground">
                Hay <span className="font-bold text-primary">{existingSuppliers.length}</span> proveedores cargados y listos para scoring
              </p>
            </div>
            <Link to="/scoring">
              <Button>
                Ver Ranking
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
