import React, { useEffect, useState } from "react";
import UserMenu from "../components/UserMenu";
import ClientsMapWrapper from "../components/ClientsMap";
import Protected from '@/utils/Protected';
import ProductionTable from "@/components/productionTable";
import { Bar, BarChart, CartesianGrid, Tooltip, LabelList, XAxis } from "recharts";
import apiFetch from "@/utils/apiFetch";  

function Dashboard() {
  const [chartData, setChartData] = useState([]);

  const [kpi, setKpi] = useState(null);

  useEffect(() => {
    const fetchKpi = async () => {
      try {
    const data = await apiFetch("https://fluxi-backdep.vercel.app/api/orders/kpi")
    setKpi(data);
    console.log(data);
      } catch (err) {
        console.error("Erreur chargement KPI commandes:", err);
      }
    };

    
      fetchKpi();
    
  }, []);

  // Charger et formater les données de production
  useEffect(() => {
    const fetchProductions = async () => {
      try {
        const data = await apiFetch("https://fluxi-backdep.vercel.app/api/productions");
        const productions = data.productions || [];

        const grouped = productions.reduce((acc, prod) => {
          const date = new Date(prod.date || prod.createdAt);
          const month = date.toLocaleString("default", { month: "short" });
          acc[month] = (acc[month] || 0) + prod.quantity;
          return acc;
        }, {});

        const formatted = Object.keys(grouped).map((month) => ({
          month,
          production: grouped[month],
        }));

        setChartData(formatted);
      } catch (error) {
        console.error("Erreur chargement production:", error);
      }
    };

    fetchProductions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6 bg-white shadow-sm border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          Tableau de bord
        </h1>
        <UserMenu />
      </header>

      {/* KPI Section */}
      {kpi && (
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-8 py-8 max-w-7xl mx-auto w-full">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-sm font-medium text-gray-500">CA Global</h3>
            <p className="mt-2 text-3xl font-bold text-[#19CB96]">
              {kpi.caGlobal?.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-sm font-medium text-gray-500">CA Moyen / Commande</h3>
            <p className="mt-2 text-3xl font-bold text-[#19CB96]">
              {kpi.caMoyenParCommande?.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-sm font-medium text-gray-500">Nombre de commandes</h3>
            <p className="mt-2 text-3xl font-bold text-[#19CB96]">
              {kpi?.totalOrders ?? 0}
            </p>
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 pb-12 w-full">
       
        

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Carte : Clients Map */}
          <div className="bg-white rounded-2xl h-[500px] shadow p-6 pb-16 pt-16 justify-center items-center flex flex-col hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-800 ">
              Carte des clients
            </h3>
            <div className="">
              <ClientsMapWrapper />
            </div>
          </div>

          {/* Carte : Graphique */}
          <div className="bg-white rounded-2xl shadow p-6 justify-center items-center flex flex-col hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Production mensuelle
            </h3>
            <div className="flex-1 flex justify-center items-center w-full">
              <BarChart
                width={400}
                height={240}
                data={chartData}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <Tooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} />
                <Bar dataKey="production" fill="#18CB96" radius={8}>
                  <LabelList position="top" offset={12} fontSize={12} />
                </Bar>
              </BarChart>
            </div>
          </div>
        </div>

        {/* Table de production */}
        <div className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition">
      
        
          <div className="overflow-y-auto max-h-[400px]">
            <ProductionTable />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Protected(Dashboard)
