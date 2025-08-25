import React, { useState, useEffect  } from "react";
import UserMenu from "../../components/UserMenu";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faUser,
  faShareFromSquare,
  faBoxOpen,
} from "@fortawesome/free-solid-svg-icons";
import {
  faSquareCaretRight,
  faSquareCaretDown
} from "@fortawesome/free-regular-svg-icons"
import apiFetch from "@/utils/apiFetch";
import Protected from "@/utils/Protected";
import setDate from "@/utils/setDate";


function OrderDetail() {

  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState({});
  const [loading, setLoading] =  useState(false)
  const [showOrders, setShowOrders] = useState(false)
  const [error, setError] = useState(null);

  // Function to fetch product data based on id
  const getOrder = async (idRef) => {
    try {
      const data = await apiFetch(`https://fluxi-backdep.vercel.app/api/orders/${idRef}`);

      if(data.result){
        setOrder({...data.data, creationDate:setDate(new Date(data.data.creationDate)), deliveryDate:setDate(new Date(data.data.deliveryDate))})
        return true
      };
    } catch (error) {
      console.error('récupération de la commande impossible:', error);
      setError('récupération de la commande impossible:', error)
        return false;
    }
    }

  useEffect(() => {
    
    setShowOrders(false);
    
    setLoading(true);

    if (!id) return;
    // Fetch product data based on id if needed
    getOrder(id); // Fallback to fake first product if id is not found
    setLoading(false);


  }, []);

  function handleGoBack() {
    router.push("/orders");
  }

  function handleGoCustomer() {
    router.push(`/customers/${order.customer._id}`)
  }

  function handleGoOrder(ref) {
    router.push(`/orders/${ref}`)
    getOrder(ref)
  }

  function handleGoProduct(id) {
    router.push(`/stock/${id}`)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!order.ref || error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">
            {error || "Aucune commande trouvée."}
          </p>
          <button
            onClick={handleGoBack}
            className="mt-4 text-emerald-600 hover:text-emerald-800 underline"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

 
  return (
    <div className="min-h-screen bg-gray-50">
      <UserMenu style="absolute top-5 right-10" />

      <div className="w-full max-w-6xl mx-auto px-6 pt-20">
        {/* Back button */}
        <div className="mb-6">
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="cursor-pointer text-emerald-600 hover:text-emerald-800 transition-colors text-lg"
            onClick={handleGoBack}
          />
        </div>

        {/* Order Info Card */}
        <div className="p-8 mb-8 h-4/5 bg-white shadow-sm rounded-lg  border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-start gap-8">
            {/* Main Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                {order.ref}
              </h1>
              {/**Products */}
               <table className="w-full mb-3 border-collapse text-sm">
                    <thead>
                      <tr className="bg-emerald-100 text-emerald-800">
                        <th className="px-3 py-2 text-left">Produit</th>
                        <th className="px-3 py-2 text-left">Quantité</th>
                        <th className="px-3 py-2 text-left">Stock restant</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.products.map((p, i) => (
                        <tr 
                          key={i} 
                          className="border-b hover:bg-emerald-50 cursor-pointer"
                          onClick={() => handleGoProduct(p.product._id)}
                        >
                          <td className="px-3 py-2">{p.product.name}</td>
                          <td className="px-3 py-2">{p.quantity} {p.product.unity}</td>
                          <td className={`px-3 py-2 ${p.product.stock < 5 ? 'text-red-500' : 'text-emerald-600'}`}>{p.product.stock}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                
                {/* Contact Info */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h1 className="text-xl font-bold text-gray-800 mb-6">
                      Informations du client :
                    </h1>
                  <div className="flex items-center mt-3">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="text-emerald-600 mr-3 w-5"
                    />
                    <span className="text-gray-700">{order.customer.name}</span>
                  </div>  
                  <div className="flex items-center mt-3">
                    <FontAwesomeIcon
                      icon={faPhone}
                      className="text-emerald-600 mr-3 w-5"
                    />
                    <span className="text-gray-700">{order.customer.phone}</span>
                  </div>
                  <div className="flex items-center mt-3">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-emerald-600 mr-3 w-5"
                    />
                    <span className="text-gray-700">{order.customer.email}</span>
                  </div>
                  <div className="flex items-start mt-3">
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="text-emerald-600 mr-3 w-5 mt-1"
                    />
                    <span className="text-gray-700">{order.customer.address}</span>
                  </div>
                  
                  <div className="flex flex-col items-start mt-3">
                    <div className="flex items-start mb-1">
                    <FontAwesomeIcon
                    onClick={()=>setShowOrders(!showOrders)}
                    icon={showOrders?faSquareCaretDown:faSquareCaretRight}
                    className="text-emerald-600 mr-3 w-5 mt-1"
                    />
                    <span 
                      onClick={()=>setShowOrders(!showOrders)} 
                      className="text-gray-700 cursor-pointer hover:text-emerald-600">
                        Autres commandes du client
                    </span>
                    </div>
                    <div className="flex flex-col items-start mt-3">
                      {showOrders&&[...order.customer.order]
                      .sort((a,b)=>{if(new Date(a.creationDate)>new Date(b.creationDate)) return -1})
                      .map((order,i)=>{
                        if(order._id===id)return
                        return(
                          <div key={i} className="flex mb-1">
                            <FontAwesomeIcon
                                icon={faBoxOpen}
                                className="text-emerald-600 mr-3 w-5 mt-1"
                              />
                            <span 
                              key={i} 
                              onClick={()=>handleGoOrder(order._id)}
                              className="text-gray-700 cursor-pointer hover:text-bold hover:text-emerald-600">
                                {order.ref}
                            </span>
                          </div>
                        )
                      })}
                      
                    </div>
                  </div>

                  <div className="flex items-start mt-3" onClick={handleGoCustomer}>
                    <FontAwesomeIcon
                      icon={faShareFromSquare}
                      className="text-emerald-600 mr-3 w-5 mt-1"
                    />
                    <span className="text-gray-700 cursor-pointer hover:font-bold hover:text-emerald-600">Accéder à la fiche client complète</span>
                  </div>

                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-4">
                  <div className="bg-emerald-50 rounded-lg p-4">
                    <p className="text-emerald-800 font-semibold">
                      Marge de la commande 
                    </p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {(order.price - order.cost).toFixed(2)} €
                    </p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-4">
                    <p className="text-emerald-800 font-semibold">
                      Prix de la commande 
                    </p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {(order.price).toFixed(2)} €
                    </p>
                  </div>
                  <div className={`rounded-lg p-4 ${order.status==="Livrée"?"bg-emerald-50":"bg-gray-50"}`}>
                    <p className="text-emerald-800 font-semibold">
                      Status de la commande 
                    </p>
                    <p className={`text-2xl font-bold ${order.status==="Livrée"?"text-emerald-600":"text-gray-600"}`}>
                      {order.status} 
                    </p>
                  </div>
                  <div className={`rounded-lg p-4 ${order.status==="Livrée"?"bg-emerald-50":"bg-gray-50"}`}>
                    {order.status==="Livrée"?
                      (<p className="text-xl font-semibold text-emerald-600">
                        {'Date de livraison souhaitée :'}
                        {order.deliveryDate}
                      </p>
                      ) : (
                      <div>
                      <p className="text-xl font-bold text-gray-700 mr-2">
                        Date de la commande :
                      </p>
                        {order.creationDate}
                      <p className="text-xl font-bold text-gray-700 mr-2">
                        Date de livraison souhaitée :
                      </p>
                        {order.deliveryDate}
                      </div>
                      )
                    }
                    
                    
                  </div>
                  
                  
                </div>
              </div>
            </div>


 
          </div>
        </div>
        </div>
        </div>
  )

       
}

export default Protected(OrderDetail)
