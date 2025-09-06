import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import apiFetch from "@/utils/apiFetch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faCircleRight, faCircleLeft } from "@fortawesome/free-regular-svg-icons";
import Protected from "@/utils/Protected";
import UserMenu from "@/components/UserMenu";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";





function BrutProductDetails( {product} ) {
  
  return (
    <div className="p-8 bg-white shadow-sm rounded-lg border border-gray-200 max-w-3xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
      <div className="mb-2"><span className="font-semibold">Type :</span> {product.type}</div>
      <div className="mb-2"><span className="font-semibold">Stock :</span> {product.stock} {product.unity}</div>
      <div className="mb-2"><span className="font-semibold">Prix d'achat :</span> {product.cost} €</div>
      {product.supplier && (
        <div className="mt-4">
          <h2 className="text-xl font-bold text-emerald-600 mb-2">Fournisseur :</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="font-semibold">{product.supplier.name}</div>
            <div>{product.supplier.address}</div>
            <div>{product.supplier.email}</div>
            <div>{product.supplier.phone}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function FinalProductDetails( {product} ) {
    console.log(product)

  return (
    <div className="p-8 bg-white shadow-sm rounded-lg border border-gray-200 max-w-3xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
      <div className="mb-2"><span className="font-semibold">Stock :</span> {product.stock} {product.unity}</div>
      <div className="mb-2"><span className="font-semibold">Prix d'achat :</span> {product.cost} €</div>
      <div className="mb-2"><span className="font-semibold">Prix de vente :</span> {product.price} €</div>
      {product.dlc && (
        <div className="mb-2"><span className="font-semibold">DLC :</span> {product.dlc} jours</div>
      )}
      {product.receipe && product.receipe.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold text-emerald-600 mb-2">Recette :</h2>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-emerald-100 text-emerald-600">
                <th className="px-3 py-2 text-left">Produit</th>
                <th className="px-3 py-2 text-left">Quantité</th>
                <th className="px-3 py-2 text-left">Stock restant</th>
              </tr>
            </thead>
            <tbody>
              {product.receipe.map((item, i) => (
                <tr key={i} className="border-b hover:bg-emerald-50">
                  <td className="px-3 py-2">{item.product.name}</td>
                  <td className="px-3 py-2">{item.quantity} {item.product.unity}</td>
                  <td className={`px-3 py-2 ${item.product.stock < 5 ? 'text-red-500' : 'text-emerald-600'}`}>{item.product.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ProductPage() {
  const router = useRouter();
  const [id, setId] = useState({});
  const [product, setProduct] = useState(null);
  const [moved, setMoved] = useState(false);

  const ids = useSelector((state) => state.ids.value);
  const currentProductIndex = ids.products?.indexOf(id) % ids.products.length;
  
    // Navigate to previous cutsomer
  function handlePrevCustomer() {
    setMoved(true)
  if (currentProductIndex > 0) {
    const prevId = ids.products[currentProductIndex - 1];
    setId(prevId);
    router.replace(`/stock/${prevId.id}`);
    getProduct(prevId.id);
  }
  }
  console.log(ids.products[currentProductIndex + 1].id)
  // Navigate to next cutsomer
  function handleNextCustomer() {
    setMoved(false)
     if (currentProductIndex < ids.products.length) {
    const nextId = ids.products[currentProductIndex + 1];
    setId(nextId);
    router.replace(`/stock/${nextId.id}`);
    getProduct(nextId.id)
  }
  }

  async function getProduct(Fetchid) {
    console.log(Fetchid)
    try {
      const response = await apiFetch(
        `/api/products/${Fetchid}`
      );
      if (!response.result) return;
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  }

  
  useEffect(() => {
    if (!router.isReady) return;
    const { id } = router.query;
    if (!id) return

    async function getProduct() {
      try {
        const response = await apiFetch(
          `/api/products/${id}`
        );
        if (!response.result) return;
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }

    getProduct();
  }, [router.isReady, router.query.id]);

  function handleGoBack(){
    router.push("/stock")
  }

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
          <p className="text-center">Changer de produit</p>
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
          { product && (
            product?.supplier ? 
              <BrutProductDetails product={product} />
            : 
              <FinalProductDetails product={product} />
          )}
         <div/>
      </div>
    </div>  
  );
}

export default Protected(ProductPage)
