import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import UserMenu from "../../components/UserMenu";
import Calendar from "../../components/calendar";
import ProductionTable from "../../components/productionTable";
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Tooltip, LabelList, XAxis } from "recharts"
import apiFetch from "@/utils/apiFetch";
import Protected from "@/utils/Protected";

function Production() {

  //function to set the default date :
  const getDateTimeLocalString = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  
  const [productions, setProductions] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [productName, setProductName] = useState([]); 
  const [selectProduct, setSelectProduct] = useState('');
  const [date, setDate] = useState(getDateTimeLocalString()); 
  const [quantity, setQuantity] = useState(0); 
  const [nlot, setNlot] = useState(''); 
  const [cost, setCost] = useState(0); 
  const receipe = [];
  const [events, setEvents] = useState(); //Add a production on the table
  const [updateTable, setUpdateTable] = useState(false); // refresh table 
  const [chartData, setChartData] = useState([]);


  const productList = productName?.map((produit, i) => {
    return <option key= {i} value={produit.name}>{produit.name}</option>;
  });  

  
  const addProdCalendar = async () => {
    try {
      const data = await apiFetch("/api/productions");

      if (!data.result) {
        console.log("Erreur fetch productions",data);
      }

      const formatted = data.productions.map((prod) => ({
        title: `${prod.product} - Lot ${prod.nlot}`,
        start: prod.date,
        // end: new Date(prod.date.getTime() + 2 * 60 * 60 * 1000),
        allDay: false,
      }));

      setUpdateTable(!updateTable); // refresh the table
      setEvents(formatted);
    } catch (err) {
      console.error("Erreur fetch productions :", err);
    }
  };

  const handleSubmitProd = async (e) => {
    try {

      if (!productName || quantity <= 0 || !nlot) {
        alert("Pensez à remplir les champs.");
        return;
      }

      const response = await apiFetch('/api/productions', {
        method: "POST",
        body: JSON.stringify({
          product: selectProduct,
          quantity,
          nlot,
          receipe,
          cost,
          end: new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
          date
        }),
      })
      
      if (!response.result){
        return alert("Erreur lors de la création de la production.")
      }
        alert("Production créée avec succès !");
        setSelectProduct("");
        setDate(new Date());
        setQuantity(0);
        setNlot("");
        setCost(0);
        handleClosePopup();
        addProdCalendar();

    }catch(error){
      console.error("Erreur:", error)
      alert("Une erreur est survenue.")
    }
  };

  const handleOpenPopup = () => {
    setIsPopupOpen(true); // Ouvre la popup
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false); // Ferme la popup
  };


  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await apiFetch(
          "/api/products?type=2"
        );

        if (!response.result) {
          console.error("Erreur lors du fetch des produits :", error);
        }
        setProductName(response.data);
      } catch (error) {
        console.error("Erreur lors du fetch des produits :", error);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    addProdCalendar();
  }, []);

  useEffect(() => {
    if (isPopupOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isPopupOpen]);

  useEffect(() => {

    const fetchProductions = async () => {
      try {
        const response = await apiFetch("/api/productions");

        if (response.result) {
          const sorted = response.productions.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          setProductions(sorted.slice(0, 10));
        }
        // Groupement par mois
        const data = response.productions || [];
        const grouped = data.reduce((acc, prod) => {
          const date = new Date(prod.date || prod.createdAt);
          const month = date.toLocaleString("default", { month: "short" });
          acc[month] = (acc[month] || 0) + prod.quantity;
          return acc;
        }, {});

        // Transformation en tableau pour Recharts
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
  }, [updateTable]);

  

  return (
    <div className="min-h-screen w-full relative z-0">
      <UserMenu style="absolute top-5 right-10" />
      <div className="w-full max-w-6xl mx-auto px-6 pt-20">
        <div className="mb-8">
          <h1 className="font-semibold text-3xl text-center text-gray-800">
            PRODUCTION
          </h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 w-full gap-2 p-2 h-screen">
          {/* Calendrier à gauche (2/3) */}
          <div className="lg:col-span-2  bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">
              Calendrier de production
            </h2>
            <div className="flex flex-rows w-[100%] justify-center items-center gap-6">
              <button
                onClick={handleOpenPopup}
                className="text-[15px] cursor-pointer text-[#FFF] bg-[#18CB96] rounded-md hover:bg-emerald-600 transition p-[10px] w-[30%] mt-[20]"
              >
                Produire
              </button>
              <button className="text-[15px] cursor-not-allowed text-[#333333] border-[1px] flex flex-row justify-center items-center rounded-[10px] p-[10px] mt-[20] w-[30%]">
                Planifier
              </button>
            </div>
            <div className="h-full overflow-hidden flex flex-col">
              <Calendar events={events} className="flex-grow" />
            </div>
          </div>

          {/* Colonne droite (1/3) */}
          <div className="flex flex-col lg:col-span-2    bg-white gap-4">
            <div className=" rounded-lg  shadow p-4  h-80">
              <div className="mb-4">
                <h2 className="text-lg font-bold">Productions par mois</h2>
                <p className="text-gray-500">Quantité totale par mois</p>
              </div>

              {/* Chart */}
              <div className="overflow-x-auto  flex justify-center items-center">
                <BarChart
                  width={400}
                  height={200}
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
            <div className="overflow-y-auto   rounded-lg shadow p-4  h-80">
              <ProductionTable productions= {productions}/>
            </div>
          </div>
        </div>

        {/* Popup */}
        {isPopupOpen && (
          <div
            onClick={handleClosePopup}
            className="fixed inset-0 bg-black/30 backdrop-blur-xs flex justify-center items-center z-50"
          >
            <div className="bg-white rounded-lg shadow-lg p-6 w-[800px]">
              <h2 className="text-xl font-semibold mb-4">
                Créer une production
              </h2>
              <form onClick={(e) => e.stopPropagation()}>
                <select
                  onChange={(e) => setSelectProduct(e.target.value)}
                  value={selectProduct}
                  className="border border-gray-300 px-4 py-2 rounded-md w-full mb-4"
                >
                  <option value="">--Choississez votre produit--</option>
                  {productList}
                </select>
                <div className="flex flex-row gap-6">
                  <input
                    type="number"
                    placeholder="Quantité produit"
                    onChange={(e) => setQuantity(e.target.value)}
                    value={quantity}
                    className="border border-gray-300 px-4 py-2 rounded-md w-full mb-4"
                  />
                  <input
                    type="text"
                    placeholder="N° de Lot"
                    onChange={(e) => setNlot(e.target.value)}
                    value={nlot}
                    className="border border-gray-300 px-4 py-2 rounded-md w-full mb-4"
                  />
                </div>
                <input
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border border-gray-300 px-4 py-2 rounded-md w-full mb-4"
                />
                <button
                  onClick={() => handleSubmitProd()}
                  type="button"
                  className="bg-[#18CB96] cursor-pointer text-white px-4 py-2 rounded-md w-full"
                >
                  Valider
                </button>
              </form>
              <button
                onClick={handleClosePopup}
                className="text-red-500 mt-4 w-full cursor-pointer text-center"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Protected(Production);