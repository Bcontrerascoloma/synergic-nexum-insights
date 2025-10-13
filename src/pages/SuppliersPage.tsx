import { useEffect, useState } from "react";
import { get } from "idb-keyval";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Al cargar la página, lee los datos desde IndexedDB
  useEffect(() => {
    get("suppliers").then((data) => {
      if (data) {
        setSuppliers(data);
      } else {
        console.warn("No hay datos guardados en IndexedDB todavía");
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p className="p-6 text-gray-600">Cargando datos...</p>;
  }

  if (suppliers.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2">Proveedores</h2>
        <p className="text-gray-500">
          No hay datos cargados. Sube un CSV o XLSX desde la sección <b>/uploads</b>.
        </p>
      </div>
    );
  }

  // Renderizado de tabla básica
  return (
    <div className="p-6 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4">Lista de Proveedores</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead className="bg-blue-100">
            <tr>
              {Object.keys(suppliers[0]).map((col) => (
                <th key={col} className="border px-3 py-2 text-left">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {suppliers.map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((v, j) => (
                  <td key={j} className="border px-3 py-1">
                    {String(v)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
