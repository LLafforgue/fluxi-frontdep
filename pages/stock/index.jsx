import React, { useState, useEffect } from "react";
import Link from "next/link";
import UserMenu from "../../components/UserMenu";
import SearchTable from "../../components/searchTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faTag, faBox } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import useMobile from '../../hook/useMobile'
import apiFetch from "@/utils/apiFetch";
import Protected from "@/utils/Protected";
import { notification } from "antd";
import { addProductsIds } from "@/reducers/ids";
import { useAPI } from '../_app';

function Stock() {
  const API_Fetch = useAPI();
  const [input, setInput] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([{ Erreur: "Aucun produit trouvé" }]);
  const [productsList, setProductsList] = useState([{ Erreur: "Aucun produit trouvé" }]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productsId, setProductsId] = useState([]);

  const dispatch = useDispatch()

   //notifications
  const [api, contextHolder] = notification.useNotification();
  

  const openNotification = (object) => {
    const color = object.typeText==='Erreur'?'bg-[#f93e31c1]':'bg-[#abfda4ff]'
    api.open({
            message: object.typeText,
            description: object.message,
            className: color,
            style: {
                borderRadius: "12px",
                border: "1px solid #d9d9d9",
                overflow: "hidden",
              },
            })
    };
  
  
  const token = useSelector((state) => state.user.value.token);
  

  useEffect(() => {
 
    const fetchProducts = async () => {
      
      setLoading(true);
      try {
        const data = await apiFetch(`/api/products`);

        if (data.result) {
          const useData = data.data.map((product) => {
            return product.dlc
              ? {
                  "Nom": product.name,
                  "Stock": product.stock,
                  "Unité": product.unity,
                  "Type": "produit transformé",
                  "Fournisseur": String.fromCharCode(248),
                  "DLC": product.dlc,
                }
              : {
                  'Nom': product.name,
                  'Stock': product.stock,
                  'Unité': product.unity,
                  'Type': "produit brut",
                  'Fournisseur': product.supplier.name,
                  'DLC': String.fromCharCode(248),
                };
          });

          if (useData[0]) {
            dispatch(addProductsIds(data.data.map(((product)=>{
            return {id:product._id, name:product.name}
            }))));
             setProductsId(data.data.map(((product)=>{
            return {id:product._id, name:product.name}
            })));
            setProductsList(useData);
            setFilteredProducts(useData);
          }
          
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false)
      }
    };

    fetchProducts();
    setRefresh(false);

  }, [refresh]);


  const handleFilterText = (text) => {
    setInput(text);
    setFilteredProducts(
      productsList.filter((product) =>
        [product['Nom'], product['Type'], product['Fournisseur']]
          .join(" ")
          .toLowerCase()
          .includes(text.toLowerCase())
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserMenu style="absolute top-5 right-10" refresh={refresh} />

      <div className="w-full max-w-6xl mx-auto px-6 pt-20">
        {/* Title */}
        <div className="mb-8">
          <h1 className="font-semibold text-3xl text-center text-gray-800">
            STOCKS
          </h1>
        </div>

        {/* Count summary */}
        <div className="text-lg text-gray-700 mb-4 text-center">
          Mes produits : {`${filteredProducts.length} parmi ${productsList.length}`}
        </div>

        {/* Search and Add Product Section */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6 items-center justify-between">
          {/* Search bar */}
          <div className="flex items-center bg-white shadow-sm border border-gray-200 rounded-lg px-4 py-3 w-full lg:w-2/3 focus-within:ring-2 focus-within:ring-emerald-400 focus-within:border-emerald-400">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="text-gray-400 mr-3"
            />
            <input
              type="text"
              name="SearchBar"
              placeholder="Rechercher un produit..."
              className="flex-1 focus:outline-none text-gray-700 placeholder-gray-400"
              value={input}
              onChange={(e) => handleFilterText(e.target.value)}
            />
          </div>

          {/* Add new product */}
          <Link href="/stock/new">
            <div className="flex items-center bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors cursor-pointer shadow-sm">
              <span className="font-medium">Ajouter un produit</span>
              <FontAwesomeIcon icon={faBox} className="ml-2" />
            </div>
          </Link>
        </div>

        {contextHolder}
        {/* Products Table */}
        
          <div className={`${useMobile()?'':'mx-[min(40px,10%) p-4'} mt-8 overflow-y-auto max-h-[600px] w-full rounded-md border border-gray-200 shadow-sm bg-white`}>
            {loading ? (
            <div className="flex flex-col items-center p-6 text-gray-500">
              <div className="w-6 h-6 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2"></div>
              Chargement des produits...
            </div>
          ) : (
            <SearchTable 
              type='stock' 
              items={filteredProducts}
              itemsId={productsId} 
              token={token}
              refresh={setRefresh}
              catToCheck={['Nom','Stock']}
              notificationProp = {openNotification}
              modalOn = {true}
            />
        )}
          </div>
      </div>
    </div>
  );
}

export default Protected(Stock);
