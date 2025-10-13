import { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { set } from "idb-keyval";

export default function Uploads() {
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState<any[]>([]);
  const [message, setMessage] = useState("");

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
            setPreview(results.data.slice(0, 50));
            set("suppliers", results.data);
            console.log("✅ Guardado en IndexedDB:", results.data.length, "registros");
            setMessage(`✅ ${results.data.length} registros cargados y guardados`);
          },
          error: (err) => {
            setMessage(`❌ Error al leer CSV: ${err.message}`);
          },
        });
      } else if (ext === "xlsx") {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        setPreview(jsonData.slice(0, 50));
        await set("suppliers", jsonData);
        console.log("✅ Guardado en IndexedDB:", jsonData.length, "registros");
        setMessage(`✅ ${jsonData.length} registros cargados y guardados`);
      } else {
        setMessage("❌ Solo se admiten archivos CSV o XLSX");
      }
    } catch (err: any) {
      setMessage(`❌ Error al procesar archivo: ${err.message}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-semibold mb-4">Importar Archivos</h2>

      <div className="border-2 border-dashed border-blue-400 rounded-2xl p-10 text-center">
        <input
          type="file"
          accept=".csv, .xlsx"
          onChange={handleFile}
          className="cursor-pointer text-blue-700"
        />
        <p className="text-gray-500 mt-2">
          Soporta archivos CSV y XLSX (máx. 10 MB)
        </p>
      </div>

      {fileName && (
        <p className="mt-4 text-gray-600">
          📄 Archivo: <b>{fileName}</b>
        </p>
      )}

      {message && <p className="mt-2 text-sm text-blue-600">{message}</p>}

      {preview.length > 0 && (
        <div className="mt-6 overflow-auto">
          <p className="font-semibold mb-2">Vista previa (primeras 50 filas):</p>
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-blue-100">
                {Object.keys(preview[0]).map((col) => (
                  <th key={col} className="border px-2 py-1 text-left">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((v, j) => (
                    <td key={j} className="border px-2 py-1">
                      {String(v)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
