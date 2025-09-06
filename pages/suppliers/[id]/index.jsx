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
  faBoxes,
  faEuroSign,
  faWarehouse,
  faRulerCombined,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import apiFetch from "@/utils/apiFetch";
import Protected from "@/utils/Protected";

function SupplierDetails() {
  const user = useSelector((state) => state.user.value);
  const router = useRouter();
  const { id } = router.query;
  const [supplier, setSupplier] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function handleGoBack() {
    router.push("/suppliers");
  }

  function handleProductRedirect(productId, e) {
    e.stopPropagation();
    router.push(`/stock/${productId}`);
  }

  useEffect(() => {
    async function fetchSupplier() {
      try {
        if (!id) return;
        const response = await apiFetch(`/api/suppliers/${id}`)

        if (!response || !response.result)
          throw new Error("Failed to fetch supplier");
        setSupplier(response.data);
      } catch (error) {
        console.error("Error fetching supplier:", error);
        setError("Erreur lors du chargement du fournisseur");
      }
    }

    async function fetchProducts() {
      try {
        if (!id) return;
        const response = await apiFetch(`/api/products?type=1&supplierId=${id}`)
        if (!response || !response.result)
          throw new Error("Failed to fetch products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Erreur lors du chargement des produits");
      } finally {
        setLoading(false);
      }
    }

    const fetchData = async () => {
      await fetchSupplier();
      await fetchProducts();
    };

    fetchData();
  }, [id]);

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
  if (!supplier || error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">
            {error || "Aucun fournisseur trouvé."}
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

  // Calculate total products value
  const totalProductsValue = products.reduce(
    (acc, product) => acc + (product?.cost || 0) * (product?.stock || 0),
    0
  );

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

        {/* Supplier Info Card */}
        <div className="bg-white shadow-sm rounded-lg p-8 mb-8 border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-start gap-8">
            {/* Main Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                {supplier.name}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Info */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faPhone}
                      className="text-emerald-600 mr-3 w-5"
                    />
                    <span className="text-gray-700">{supplier.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-emerald-600 mr-3 w-5"
                    />
                    <span className="text-gray-700">{supplier.email}</span>
                  </div>
                  <div className="flex items-start">
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="text-emerald-600 mr-3 w-5 mt-1"
                    />
                    <span className="text-gray-700">{supplier.address}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-4">
                  <div className="bg-emerald-50 rounded-lg p-4">
                    <p className="text-emerald-800 font-semibold">
                      Valeur du stock
                    </p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {totalProductsValue.toFixed(2)} €
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 font-semibold">
                      Nombre de produits
                    </p>
                    <p className="text-2xl font-bold text-gray-800">
                      {products.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {supplier.tags && supplier.tags.length > 0 && (
              <div className="lg:w-1/3">
                <div className="flex items-center mb-3">
                  <FontAwesomeIcon
                    icon={faTag}
                    className="text-emerald-600 mr-2"
                  />
                  <h3 className="font-semibold text-gray-700">Tags</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {supplier.tags.map((tag, index) => (
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

        {/* Products Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FontAwesomeIcon icon={faBoxes} className="text-emerald-600 mr-3" />
            Produits ({products.length})
          </h2>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white shadow-sm rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={(e) => handleProductRedirect(product._id, e)}
                >
                  {/* Product Header */}
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-800 mb-2">
                      {product.name}
                    </h3>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                      {product.type}
                    </span>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">
                        Prix unitaire
                      </span>
                      <span className="font-bold text-emerald-600 flex items-center">
                        <FontAwesomeIcon
                          icon={faEuroSign}
                          className="mr-1 text-xs"
                        />
                        {product.cost?.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">Stock</span>
                      <span className="text-gray-800 text-sm flex items-center">
                        <FontAwesomeIcon
                          icon={faWarehouse}
                          className="mr-1 text-xs"
                        />
                        {product.stock}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">Unité</span>
                      <span className="text-gray-800 text-sm flex items-center">
                        <FontAwesomeIcon
                          icon={faRulerCombined}
                          className="mr-1 text-xs"
                        />
                        {product.unity}
                      </span>
                    </div>
                  </div>

                  {/* Value calculation */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-sm">
                        Valeur totale
                      </span>
                      <span className="font-bold text-gray-800">
                        {((product.cost || 0) * (product.stock || 0)).toFixed(
                          2
                        )}{" "}
                        €
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-lg p-8 border border-gray-200 text-center">
              <FontAwesomeIcon
                icon={faBoxes}
                className="text-gray-400 text-4xl mb-4"
              />
              <p className="text-gray-500 text-lg">
                Aucun produit pour ce fournisseur
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Protected(SupplierDetails);
