import { useEffect, useState } from "react";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const request = indexedDB.open("keyval-store", 1);
    request.onsuccess = function () {
      const db = request.result;
      const tx = db.transaction("keyval", "readonly");
      const store = tx.objectStore("keyval");
      const getReq = store.get("suppliers");
      getReq.onsuccess = function () {
        const data = getReq.result || [];
        console.log("📦 Datos obtenidos desde IndexedDB:", data);
        setSuppliers(Array.isArray(data) ? data : []);
        setLoading(false);
      };
      getReq.onerror = function () {
        console.error("❌ Error al leer datos de IndexedDB");
        setLoading(false);
      };
    };
  }, []);

  if (loading) return <p className="p-6 text-gray-500">Cargando proveedores...</p>;

  if (!suppliers.length) {
    return (
      <div className="p-6 text-gray-700">
        <h2 className="text-2xl font-bold mb-2">Proveedores</h2>
        <p>No hay datos guardados. Sube un archivo en <b>/uploads</b>.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow overflow-auto">
      <h2 className="text-2xl font-semibold mb-4">Lista de Proveedores</h2>
      <table className="w-full text-sm border border-gray-300">
        <thead className="bg-blue-100">
          <tr>
            {Object.keys(suppliers[0]).map((key) => (
              <th key={key} className="border px-3 py-2 text-left text-gray-700 font-medium">
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {suppliers.map((row, i) => (
            <tr key={i} className="hover:bg-blue-50">
              {Object.values(row).map((v, j) => (
                <td key={j} className="border px-3 py-1 text-gray-600">
                  {String(v)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
