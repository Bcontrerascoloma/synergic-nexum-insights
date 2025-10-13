import { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { set } from "idb-keyval";

export default function UploadWizard() {
  const [preview, setPreview] = useState<any[]>([]);
  const [fileName, setFileName] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const ext = file.name.split(".").pop()?.toLowerCase();

    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setPreview(results.data.slice(0, 50));
          set("suppliers", results.data); // guarda todo en IndexedDB
        },
      });
    } else if (ext === "xlsx") {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setPreview(jsonData.slice(0, 50));
      await set("suppliers", jsonData);
    } else {
      alert("Formato no soportado. Usa CSV o XLSX.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">Subir datos de proveedores</h2>
      <input type="file" accept=".csv, .xlsx" onChange={handleFile} />
      <p className="text-sm mt-2 text-gray-500">{fileName}</p>
      {preview.length > 0 && (
        <table className="w-full text-sm mt-4 border">
          <thead>
            <tr>
              {Object.keys(preview[0]).map((col) => (
                <th key={col} className="border px-2 py-1 text-left">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {preview.map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((v, j) => (
                  <td key={j} className="border px-2 py-1">{String(v)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
