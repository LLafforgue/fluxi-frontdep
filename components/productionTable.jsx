import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import apiFetch from "@/utils/apiFetch";

function ProductionTable({productions}) {
  const token = useSelector((state) => state.user.value.token);
  // const [productions, setProductions] = useState([]);
  const [filter, setFilter] = useState(""); // Filtre texte

  // useEffect(() => {
  //   const fetchProductions = async () => {
  //     try {
  //       const data = await apiFetch("/api/productions");
        
  //       if (data.result) {
  //         const sorted = data.productions.sort(
  //           (a, b) => new Date(b.date) - new Date(a.date)
  //         );
  //         setProductions(sorted.slice(0, 10));
  //       }
  //     } catch (err) {
  //       console.error("Erreur lors de la récupération des productions", err);
  //     }
      
  //   };

  //   fetchProductions();
  // }, [token, updateTable])

  // Filtrage par produit ou lot
  console.log(productions)
  const filteredProductions = productions.filter(
    (prod) =>
      prod.product?.toLowerCase().includes(filter.toLowerCase()) ||
      prod.nlot?.toLowerCase().includes(filter.toLowerCase())
  );

  const exportToCSV = async () => {
    try {
      const data = await apiFetch("/api/productions");
    if (!data.result || !data.productions || !data.productions.length === 0) {
      alert("Aucune donnée à exporter !");
      return;
    }
  
    const productions = data.productions;

    // 1️⃣ Récupération des clés comme en-têtes
    const headers = ["product", "quantity", "nlot", "date"];

    // 2️⃣ Création des lignes CSV
    const rows = productions.map(row =>
      headers.map(field => JSON.stringify(row[field] ?? "")).join(",")
    );

    // 3️⃣ Fusion en texte CSV
    const csvContent = [headers.join(","), ...rows].join("\n");

    // 4️⃣ Création du fichier et téléchargement
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `productions_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  } catch (err) {
    console.error("Erreur export CSV :", err);
    alert("Impossible d'exporter les données.");
  }

}

  return (
    <div className=" p-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Dernières productions
        </h2>
        <input
          type="text"
          placeholder="Filtrer par produit ou lot..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="mt-2 sm:mt-0 border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <button className="px-3 py-1 bg-[#19cb96] text-white cursor-pointer rounded-md hover:bg-emerald-600 transition" onClick={exportToCSV}> Export</button>

      </div>

      <div className="overflow-y-auto  bg-white shadow-md rounded-lg">
        <table className="w-full text-sm text-left text-gray-700 border-collapse">
          <thead className="bg-[#19cb96] text-white uppercase text-xs font-bold">
            <tr>
              <th className="px-4 py-2">Produit</th>
              <th className="px-4 py-2">Lot</th>
              <th className="px-4 py-2">Quantité</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredProductions.length > 0 ? (
              filteredProductions.map((prod) => (
                <tr
                  key={prod._id}
                  className="border-t overflow-y-auto hover:bg-green-50 transition"
                >
                  <td className="px-4 py-2">{prod.product || "—"}</td>
                  <td className="px-4 py-2">{prod.nlot}</td>
                  <td className="px-4 py-2">{prod.quantity}</td>
                  <td className="px-4 py-2">
                    {new Date(prod.date).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="px-4 py-4 text-center text-gray-500"
                >
                  Aucun résultat trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductionTable;

