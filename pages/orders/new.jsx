// React
import React, { useState, useEffect } from "react";
// Redux
import { useSelector } from "react-redux";
// Next.js
import { useRouter } from "next/router";
// Components
import UserMenu from "../../components/UserMenu";
// Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faTruckField,
  faBoxesStacked,
  faTimes
} from "@fortawesome/free-solid-svg-icons";

import apiFetch from "@/utils/apiFetch";
import Protected from "@/utils/Protected";
import setDate from "@/utils/setDate";

// Antd
import { notification } from "antd";

const methodPrice =  function  () {
    return this.products.reduce((sum, prod) => sum + prod.quantity * prod.price, 0).toFixed(2);
  };

function newOrder() {

  // States
  const router = useRouter();
  const [order, setOrder] = useState({products:[]});
  const [dateError, setDateError] = useState("");
  const [productsSelected, setProductsSelected] = useState([]);
  const [finalProducts, setFinalProducts] = useState([]);
  const [priceOrder, setPriceOrder] = useState({products:[], sumPrice: methodPrice });
  const [options, setOptions] = useState(['pas de produits']);
  const [customersOptions, setCustumersOptions] = useState(['pas de clients']);
  const [lastOrder, setLastOrder] = useState({visible:false})
  const [refresh, setRefresh] = useState(true)
  //notifications
  const [api, contextHolder] = notification.useNotification();
  

  const openNotification = (object) => {
    const color = object.type==='Erreur'?'bg-[#f93e31c1]':'bg-[#abfda4ff]'
    api.open({
            message: object.type,
            description: object.message,
            className: color
            })
    };

  // Function to handle going back to the previous page
  function handleGoBack() {
    router.replace("/orders");
  }

  // Function to get products from the API
  useEffect(() => {
    
    const fetchProductsList = async () => {
      try {
        const data = await apiFetch("https://fluxi-backdep.vercel.app/api/products?type=2");

        if (data.result) {
          setFinalProducts(data.data.map(product => ({
            name: product.name, _id: product._id, price: product.price, stock: product.stock, unity: product.unity
          }
          )));
          setOptions(data.data.map(product => product.name));
        }else{return}
      }catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
      }
    };
    const fetchClientList = async () => {
      try {
        const data = await apiFetch("https://fluxi-backdep.vercel.app/api/customers");

        if (data.result) {
          setCustumersOptions(data.data.map(client => client.name));
        }else{return}
      }catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
      }
    };
    fetchProductsList();
    fetchClientList();
  }, []);

async  function getLastOrderFromClient (client){
   try {
      const data = await apiFetch(`https://fluxi-backdep.vercel.app/api/orders/last/${client}`);

      if (!data.result) {
          return console.error("Erreur lors de la récupération des produits:", error);  
      }
        
        data.data[0]&&setLastOrder({...data.data[0], visible:data.result})

      }catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
      }
  }

  // Function to handle input changes
  // This function updates the order state with the new input value
  // It uses the key to determine which field to update
  const handleInputChange = (key, value) => {
    if (key === "deliveryDate") {

      if(new Date(value) <= new Date()){
       setDateError("La date de livraison doit être postérieure à aujourd'hui");
       return}
      
        setDateError("");
        setOrder({ ...order, [key]: value });
        return
      }
      
    if (key === "products" && value !== "Select products") {
      const productId = finalProducts.find((el) => el.name === value)._id;
      const productPrice = finalProducts.find((el) => el.name === value).price;
      const productStock = finalProducts.find((el) => el.name === value).stock;
      const productUnity = finalProducts.find((el) => el.name === value).unity;
      setProductsSelected([...productsSelected, {name:value, _id: productId, price: productPrice, stock: productStock, unity: productUnity}]);
      setOptions(options.filter((el) => el !== value));
      setOrder({...order, products:[...order.products, {_id: productId, quantity: 0, stock:productStock}]});
      return;
    }
    if (key === "quantity") {
      setOrder({...order, products:[...order.products.filter(prod=>prod._id!==value._id), {_id:value._id, quantity:value.quantity},]});
      setPriceOrder({
        ...priceOrder,
        products: [...priceOrder.products.filter(prod=>prod._id!==value._id), {_id:value._id, quantity:value.quantity, price:value.price}],
    })
    return;
  };
    if (key === "delete") {
      setOptions([...options, value.name].sort((a,b)=>{if(a<b)return-1;return 1}));
      setProductsSelected(productsSelected.filter((el) => el !== value));
      setOrder({
        ...order,
        products: order.products.filter((el) => el._id !== value._id),
      });
      setPriceOrder({
        ...priceOrder,
        products: priceOrder.products.filter((el) => el._id !== value._id),
      });
      return;
    }
    if (key === "customer"&&value!=="Sélectionner un client") {
      setOrder({ ...order, [key]: value });
      getLastOrderFromClient(value);

      return;
    }
    return;
  }
  

  // Function to handle form submission & send the new order to the API
  async function handleSubmit() {
    
    const orderToSend = {
      ...order, 
      products:[...order.products.map(product=>{
        return {_id:product._id, 
                quantity:product.quantity, 
                stock:product.stock-product.quantity
              }})], 
      price: priceOrder.sumPrice()
    }

    const validation = confirm("Êtes-vous sûr de vouloir créer cette commande ?");

    if (!validation) {
      return;
    }
    try {
      const data = await apiFetch("https://fluxi-backdep.vercel.app/api/orders/create", {
      method: "POST",
      body: JSON.stringify(orderToSend),
    });

    if (!data.result) {
      console.error(data.error);
      openNotification({type:"Erreur", message:"Commande non ajoutée : " + data.error});
      return 
    }
    setOrder({products:[]});
    setProductsSelected([]);
    setPriceOrder({products:[], sumPrice: methodPrice});

    openNotification({type:"Bravo !", message:"Nouvelle commande enregistrée"});
    return
    
    } catch {
      openNotification({type:"Erreur", message:"Commande non ajoutée : Problème de serveur"});

    }
    setRefresh(!refresh)
    return;
  }

  // List of products to display in the order
  // This maps through the order's products and creates a list of JSX elements
  // Each product is displayed with its index
  const productsListQuantity =
    productsSelected[0] &&
    productsSelected.map((el, i) => {
      const stockValue = el.stock-order.products.find(prod=>prod._id===el._id).quantity;
      const fontStockStyle = stockValue>0?("text-[15px] text-[#333333] font-medium"):("text-[15px] text-red-600 font-medium");
      const backgroundColor = i % 2 === 0 ? "bg-emerald-100" : "";
      return (
        <div
          key={i}
          className={`flex flex-wrap ${backgroundColor} items-center justify-between m-2 p-3 rounded-[10px] border border-gray-200`}
        >
          <div className="flex flex-col">
            <label
              id={i}
              htmlFor={`Produit ${i}`}
              className="flex flex-col text-[15px] text-[#333333] font-semibold m-2"
            >
              {`Produit ${i + 1} : ${el.name}`}
            <input
              form="newOrder"
              id={`Produit ${i}`}
              type="number"
              placeholder="Quantité"
              required
              min="0"
              name={`product${i}`}
              className="text-[15px] text-[#333333] border border-gray-300 outline-[#18CB96] rounded-[10px] p-[5px] w-[120px]"
              onChange={(e) =>
                handleInputChange("quantity", {
                  _id: el._id,
                  price: el.price,
                  quantity: e.target.value,
                })
              }
              />
              </label>
          </div>
          <div className="flex flex-col m-2">
          <div className="text-[15px] text-[#333333] font-medium">
            {`Prix unitaire : ${el.price} €`}
          </div>
          <div className={fontStockStyle}>
            {`Stock : ${stockValue} ${el.unity}`}
          </div>
          </div>
          <button
            type="button"
            className="bg-[#e51d63c2] text-white px-3 py-1 rounded-full hover:bg-[#e51d63] transition"
            onClick={() => handleInputChange("delete", el)}
          >
            X
          </button>
        </div>

      );
    });


  // JSX return
  return (
  <div className="h-full w-full relative flex flex-col">
    {/* User Menu */}
    <UserMenu style="absolute top-5 right-10" refresh={refresh} />

    {/* Go Back */}
    <div className="pl-10 mt-8">
      <FontAwesomeIcon
        icon={faArrowLeft}
        className="ml-3 cursor-pointer text-gray-600 hover:text-gray-800 transition"
        onClick={handleGoBack}
      />
    </div>
    {contextHolder} 
    {/* Title */}
    <div className="px-10 pt-6">
      <h1 className="text-2xl font-bold text-gray-800">Nouvelle commande</h1>
    </div>

    {/* Main Content */}
    <div className="flex flex-col items-center w-full flex-grow p-6 gap-6">
      <div className="flex flex-wrap gap-6 justify-center w-full">
        {/* Form */}
        <form
          id="newOrder"
          onSubmit={handleSubmit}
          className="flex flex-col border border-gray-300 rounded-lg p-6 bg-white shadow-sm gap-4 min-w-[320px]"
        >
          {/* Select Customer */}
          <div>
            <label htmlFor="customer" className="block text-m font-semibold text-gray-700 mb-1">
              Client :
            </label>
            <select
              id="customer"
              name="customer"
              value={order.customer}
              required
              className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-700 focus:ring-emerald-400 focus:border-emerald-400"
              onChange={(e) => handleInputChange("customer", e.target.value)}
            >
              <option value="">-- Sélectionner un client --</option>
              {options.length > 0
                ? [...customersOptions]
                    .sort((a, b) => (a < b ? -1 : 1))
                    .map((name, i) => (
                      <option key={i} value={name}>
                        {name}
                      </option>
                    ))
                : <option value="">Aucun client</option>}
            </select>
          </div>

          {/* Delivery Date */}
          <div>
            <label htmlFor="dateStock" className="block text-m font-semibold text-gray-700 mb-1">
              <FontAwesomeIcon icon={faTruckField} className="mr-2 text-gray-500" />
              Date de livraison souhaitée :
            </label>
            <input
              type="date"
              id="dateStock"
              name="dateStock"
              required
              className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-700 focus:ring-emerald-400 focus:border-emerald-400"
              onChange={(e) => handleInputChange("deliveryDate", e.target.value)}
            />
            {dateError && <p className="text-red-500 text-xs mt-1">{dateError}</p>}
          </div>

          {/* Products */}
          <div>
            <label htmlFor="products-select" className="block text-m font-semibold text-gray-700 mb-1">
              Produits :
              <FontAwesomeIcon icon={faBoxesStacked} className="ml-2 text-gray-500" />
            </label>
            <select
              name="products"
              id="products-select"
              value={productsSelected.length ? productsSelected : ""}
              onChange={(e) => handleInputChange("products", e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-700 focus:ring-emerald-400 focus:border-emerald-400"
            >
              <option value="">-- Sélectionner un produit --</option>
              {options.length > 0
                ? [...options]
                    .sort((a, b) => (a < b ? -1 : 1))
                    .map((name, i) => (
                      <option key={i} value={name}>
                        {name}
                      </option>
                    ))
                : <option value="">Aucun produit</option>}
            </select>
          </div>

          {/* Slected Products */}
          <div className="border border-gray-300 rounded-md p-3 text-sm text-gray-700 bg-gray-50">
            {productsSelected[0] && productsListQuantity
              ? productsListQuantity
              : "Aucun produit sélectionné"}
          </div>
        </form>

        {/* Last Order */}
        {lastOrder.visible && (
            <div className="relative ml-6 border border-gray-300 rounded-[10px] p-4 w-[300px] bg-white shadow-sm">
              {/* Bouton fermer */}
              <FontAwesomeIcon
                icon={faTimes} // Assurez-vous d'importer faTimes depuis @fortawesome/free-solid-svg-icons
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
                onClick={() => setLastOrder({visible:false})}
              />

              {/* Section title */}
              <h2 className="text-[16px] font-semibold text-[#333333] mb-3">
                Dernière commande de ce client
              </h2>

              {/* Ref */}
              <p className="text-[14px] text-[#333333] mb-2">
                <span className="font-semibold">Réf :</span> {lastOrder.ref}
              </p>

              {/* Creation Date */}
              <p className="text-[14px] text-[#333333] mb-2">
                <span className="font-semibold">Date de création :</span> {setDate(new Date(lastOrder.creationDate))}
              </p>

              {/* Status */}
              <p className="text-[14px] text-[#333333] mb-2">
                <span className="font-semibold">Status :</span> {lastOrder.status}
              </p>

              {/* Products */}
              <p className="text-[14px] text-[#333333] mb-2">
                <span className="font-semibold">Produits :</span> 
              </p>
              <div className="space-y-2">
                {lastOrder.products.map((prod, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-50 rounded-[8px] px-3 py-1"
                  >
                    <span className="text-[14px] text-[#333333]">
                      {prod.product.name}
                    </span>
                    <span className="text-[14px] font-medium text-[#333333]">
                      {prod.quantity} {prod.product.unity || ""}
                    </span>
                  </div>
                ))}
              </div>
              {/* Price */}
              <p className="text-[14px] text-[#333333] mt-5">
                <span className="font-semibold">Prix de la commande :</span> {lastOrder.price + ' €'}
              </p>
            </div>
        )}

      </div>

      {/* Prix calculé */}
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm text-gray-700">Le prix de la commande est de :</p>
        <p className="text-lg font-semibold text-red-500">
          {`${priceOrder.sumPrice()} €`}
        </p>
      </div>

      {/* Bouton enregistrer */}
      <button
        form="newOrder"
        type="button"
        className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition text-sm font-medium"
        onClick={handleSubmit}
      >
        Enregistrer
      </button>
    </div>
  </div>
);

}

export default Protected(newOrder);
