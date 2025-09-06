import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import UserMenu from "../../../components/UserMenu";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faTag,
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faShoppingCart,
  faCalendarAlt,
  faEuroSign,
} from "@fortawesome/free-solid-svg-icons";
import {
  faCircleLeft,
  faCircleRight
}from '@fortawesome/free-regular-svg-icons'
import { motion } from "framer-motion";
import Protected from "@/utils/Protected";
import useApi from "../../_app";

function CustomerDetails() {
  const api = useApi();
  const router = useRouter();
  const [id, setId] = useState(router.query.id);
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [moved, setMoved] = useState(false);

  const ids = useSelector((state) => state.ids.value);
  const currentCustomerIndex = ids.customers?.indexOf(router.query.id) % ids.customers.length   ;

  const token = localStorage.getItem("token");
  // Navigate back to customers list
  function handleGoBack() {
    router.replace("/customers");
  }

  // Navigate to previous cutsomer
  function handlePrevCustomer() {
    setMoved(true)
  if (currentCustomerIndex > 0) {
    const prevId = ids.customers[currentCustomerIndex - 1];
    setId(prevId);
    router.replace(`/customers/${prevId}`);
    fetchCustomerDetails(prevId);
  }
  }

  // Navigate to next cutsomer
  function handleNextCustomer() {
    setMoved(false)
     if (currentCustomerIndex < ids.customers.length) {
    const nextId = ids.customers[currentCustomerIndex + 1];
    setId(nextId);
    router.replace(`/customers/${nextId}`);
    fetchCustomerDetails(nextId)
  }
  }

  // Format date for better readability
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  // Get status badge color
  function getStatusColor(status) {
    switch (status.toLowerCase()) {
      case "en cours":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "livré":
        return "bg-green-100 text-green-800 border-green-200";
      case "annulé":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }
  const fetchCustomerDetails = (idCustomer) => {
    if (idCustomer) {
      fetch(`${api}/api/customers/${idCustomer}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setOrders(data.data.order)
          setCustomer(data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching customer:", error);
          setLoading(false);
        });
    }}
  
  // Fetch customer data
  useEffect(() => {
    
    fetchCustomerDetails(router.query.id);

  }, [router.query.id]);

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

  // Error state
  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Aucun client trouvé.</p>
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

  // Calculate total orders value
  const totalOrdersValue = orders.reduce(
    (acc, order) => acc + (order?.price || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <UserMenu style="absolute top-5 right-10" />

      {/*navigation customers*/}
      <div className="fixed bottom-10 p-2 right-5 w-50 flex justify-between items-center bg-gray-100 border-3 rounded-xl ">
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            animate={{ x: moved ? -10 : 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-emerald-400 text-white p-2 rounded-full shadow-md hover:bg-emerald-700 transition-colors"
            onClick={handlePrevCustomer} 
          >
            <FontAwesomeIcon icon={faCircleLeft} className='text-red' />
          </motion.button>
          <p className="text-center">Changer de client</p>
          <motion.button
            whileTap={{ scale: 0.9 }}
            animate={{ x: !moved ? 10 : 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-emerald-400 text-white p-2 rounded-full shadow-md hover:bg-emerald-700 transition-colors"
            onClick={handleNextCustomer} 
          >
            <FontAwesomeIcon icon={faCircleRight} className='text-red' />
          </motion.button>
      </div>

      <div className="w-full max-w-6xl mx-auto px-6 pt-20">
        {/* Back button */}
        <div className="mb-6">
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="cursor-pointer text-emerald-600 hover:text-emerald-800 transition-colors text-lg"
            onClick={handleGoBack}
          />
        </div>

        {/* Customer Info Card */}
        <div className="bg-white shadow-sm rounded-lg p-8 mb-8 border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-start gap-8">
            {/* Main Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                {customer.name}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Info */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faPhone}
                      className="text-emerald-600 mr-3 w-5"
                    />
                    <span className="text-gray-700">{customer.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-emerald-600 mr-3 w-5"
                    />
                    <span className="text-gray-700">{customer.email}</span>
                  </div>
                  <div className="flex items-start">
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="text-emerald-600 mr-3 w-5 mt-1"
                    />
                    <span className="text-gray-700">{customer.address}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-4">
                  <div className="bg-emerald-50 rounded-lg p-4">
                    <p className="text-emerald-800 font-semibold">
                      Total commandes
                    </p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {totalOrdersValue.toFixed(2)} €
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 font-semibold">
                      Nombre de commandes
                    </p>
                    <p className="text-2xl font-bold text-gray-800">
                      {orders.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {customer.tags && customer.tags.length > 0 && (
              <div className="lg:w-1/3">
                <div className="flex items-center mb-3">
                  <FontAwesomeIcon
                    icon={faTag}
                    className="text-emerald-600 mr-2"
                  />
                  <h3 className="font-semibold text-gray-700">Tags</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {customer.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium border border-emerald-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Orders Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FontAwesomeIcon
              icon={faShoppingCart}
              className="text-emerald-600 mr-3"
            />
            Commandes ({orders.length})
          </h2>

          {orders.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {orders.map((order) => (
                <div
                  onClick={() => router.push(`/orders/${order._id}`)}
                  key={order._id}
                  className="bg-white cursor-pointer hover:bg-gray-100 shadow-sm rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-800">#{order.ref}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">Prix total</span>
                      <span className="font-bold text-emerald-600 flex items-center">
                        <FontAwesomeIcon
                          icon={faEuroSign}
                          className="mr-1 text-xs"
                        />
                        {order.price?.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">Livraison</span>
                      <span className="text-gray-800 text-sm flex items-center">
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className="mr-1 text-xs"
                        />
                        {formatDate(order.deliveryDate)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">Produits</span>
                      <span className="text-gray-800 text-sm font-medium">
                        {order.products?.length || 0} articles
                      </span>
                    </div>
                  </div>

                  {/* Products Preview */}
                  {order.products && order.products.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-2">
                        Produits principaux :
                      </p>
                      <div className="space-y-1">
                        {order.products.slice(0, 2).map((item, index) => (
                          <div
                            key={item._id}
                            className="flex justify-between text-xs"
                          >
                            <span className="text-gray-700 truncate">
                              {item.product?.name || "Produit inconnu"}
                            </span>
                            <span className="text-gray-500 ml-2">
                              x{item.quantity}
                            </span>
                          </div>
                        ))}
                        {order.products.length > 2 && (
                          <p className="text-xs text-gray-400 italic">
                            +{order.products.length - 2} autre(s) produit(s)
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-lg p-8 border border-gray-200 text-center">
              <FontAwesomeIcon
                icon={faShoppingCart}
                className="text-gray-400 text-4xl mb-4"
              />
              <p className="text-gray-500 text-lg">
                Aucune commande pour ce client
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Protected(CustomerDetails);
