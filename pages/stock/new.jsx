// React
import React, { use, useEffect, useState } from "react";
// Components
import UserMenu from "../../components/UserMenu";
// Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faTruckField,
  faIndustry,
  faPlus,
  faTimes,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
// Next.js
import { useRouter } from "next/router";
// Redux
import { useSelector } from "react-redux";
import apiFetch from "@/utils/apiFetch";
import Protected from "@/utils/Protected";

// --- Subcomponents ---

/**
 * ProductTypeSelector
 * Allows user to select between BRUT and FINAL product types.
 */
function ProductTypeSelector({ isBrutProduct, changeProductType }) {
  return (
    <div className="flex justify-center mb-6">
      <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
        <button
          type="button"
          className={`px-6 py-2 cursor-pointer rounded-md font-medium transition-colors ${
            isBrutProduct
              ? "bg-emerald-500 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => changeProductType("BRUT")}
        >
          BRUT
        </button>
        <button
          type="button"
          className={`px-6 py-2 rounded-md cursor-pointer font-medium transition-colors ${
            !isBrutProduct
              ? "bg-emerald-500 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => changeProductType("FINAL")}
        >
          FINAL
        </button>
      </div>
    </div>
  );
}

/**
 * BrutProductFields
 * Fields for BRUT product type (name, purchase price, supplier).
 */
function BrutProductFields({
  productName,
  setProductName,
  price,
  setPrice,
  suppliersList,
  supplier,
  setSupplier,
  unity,
  setUnity
}) {
  return (
    <>
      {/* Product Name */}
      <div>
        <label className="block text-sm font-semibold mb-1" htmlFor="name">
          Nom du produit :
        </label>
        <input
          type="text"
          placeholder="Nom du produit"
          id="name"
          name="name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
          className="w-full bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>

      {/* Purchase Price */}
      <div>
        <label className="block text-sm font-semibold mb-1" htmlFor="price">
          Prix d'achat unitaire (€) :
        </label>
        <input
          type="number"
          id="price"
          name="price"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="w-full bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>

      {/* Unity */}
      <div>
        <label className="block text-sm font-semibold mb-1" htmlFor="unity">
          Unite :
        </label>
        <input
          type="text"
          placeholder="kg, L, etc."
          id="unity"
          name="unity"
          value={unity}
          onChange={(e) => setUnity(e.target.value)}
          className="w-full bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>

      {/* Supplier Selection */}
      <div>
        <label className="block text-sm font-semibold mb-1" htmlFor="supplier">
          <FontAwesomeIcon icon={faTruckField} className="mr-2" />
          Fournisseur :
        </label>
        <select
          name="supplier"
          onChange={(e) => setSupplier(e.target.value)}
          id="supplier"
          className="w-full bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          value={supplier || ""}
          required
        >
          <option value="">Sélectionner un fournisseur</option>
          {suppliersList.map((el) => (
            <option key={el._id} value={el._id}>
              {el.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

/**
 * FinalProductFields
 * Fields for FINAL product type (name, purchase/sale price, shelf life, ingredients).
 */
function FinalProductFields({
  productName,
  setProductName,
  salePrice,
  setSalePrice,
  shelfLife,
  setShelfLife,
  brutProductList,
  ingredientInput,
  setIngredientInput,
  quantity,
  setQuantity,
  receipe,
  handleAddIngredient,
  deleteIngredient,
  unity,
  setUnity,
}) {
  return (
    <>
      {/* Product Name */}
      <div>
        <label className="block text-sm font-semibold mb-1" htmlFor="finalName">
          Nom du produit :
        </label>
        <input
          type="text"
          placeholder="Nom du produit"
          id="finalName"
          name="name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
          className="w-full bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>

      {/* Sale Price */}
      <div>
        <label className="block text-sm font-semibold mb-1" htmlFor="salePrice">
          Prix de vente unitaire (€) :
        </label>
        <input
          type="number"
          id="salePrice"
          name="salePrice"
          min="0"
          step="0.01"
          value={salePrice}
          onChange={(e) => setSalePrice(e.target.value)}
          required
          className="w-full bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>

      {/* Shelf Life */}
      <div>
        <label className="block text-sm font-semibold mb-1" htmlFor="shelfLife">
          Durée de conservation (jours) :
        </label>
        <input
          type="number"
          id="shelfLife"
          name="shelfLife"
          min="1"
          value={shelfLife}
          onChange={(e) => setShelfLife(e.target.value)}
          required
          className="w-full bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>

      {/* Unity */}
      <div>
        <label className="block text-sm font-semibold mb-1" htmlFor="unity">
          Unite :
        </label>
        <input
          type="text"
          placeholder="kg, L, etc."
          id="unity"
          name="unity"
          value={unity}
          onChange={(e) => setUnity(e.target.value)}
          className="w-full bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>

      {/* Ingredients Section */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          <FontAwesomeIcon icon={faIndustry} className="mr-2" />
          Ingrédients :
        </label>

        {/* Ingredient Selection and Quantity */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <select
              name="ingredient"
              onChange={(e) => setIngredientInput(e.target.value)}
              id="ingredients"
              className="flex-1 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={ingredientInput || ""}
            >
              <option value="">Ajouter un ingrédient</option>
              {brutProductList.map((el) => (
                <option key={el._id} value={el.name}>
                  {el.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              id="quantity"
              name="quantity"
              placeholder="Quantité"
              min="0"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-24 bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <button
              type="button"
              className="bg-emerald-500 text-white px-3 py-2 rounded-md hover:bg-emerald-600 transition-colors"
              onClick={handleAddIngredient}
              title="Ajouter l'ingrédient"
            >
              <FontAwesomeIcon icon={faPlus} className="" />
            </button>
          </div>

          {/* Recipe Display */}
          <div className="bg-gray-50 rounded-md p-3 min-h-[60px]">
            {receipe.length === 0 ? (
              <div className="text-gray-500 text-sm text-center">
                Aucun ingrédient ajouté
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Recette :
                </div>
                {receipe.map((el, idx) => (
                  <div
                    className="flex items-center justify-between bg-white px-3 py-2 rounded border"
                    key={idx}
                  >
                    <div className="flex items-center">
                      <span className="font-medium">{el.name}</span>
                      <span className="ml-2 text-gray-600">
                        × {el.quantity}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                      onClick={() => deleteIngredient(el.name)}
                      title="Supprimer l'ingrédient"
                    >
                      <FontAwesomeIcon icon={faTimes} className="" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// --- Main Component ---

/**
 * NewProduct
 * Main page for creating a new product (BRUT or FINAL).
 */
function NewProduct() {
  const user = useSelector((state) => state.user.value);
  const router = useRouter();

  // --- State Management ---

  // General product type state
  const [isBrutProduct, setIsBrutProduct] = useState(true);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [supplier, setSupplier] = useState(null);
  const [unity, setUnity] = useState("");

  // FINAL product specific fields
  const [salePrice, setSalePrice] = useState("");
  const [shelfLife, setShelfLife] = useState("");
  const [ingredientInput, setIngredientInput] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [receipe, setReceipe] = useState([]);

  // Fetched data states
  const [suppliersList, setSuppliersList] = useState([]);
  const [brutProductList, setBrutProductList] = useState([]); 

  // --- Fetch Data ---

  useEffect(() => {

    async function fetchSuppliers(){

      const response = await apiFetch("/api/suppliers")

      if (!response.result) {
        throw new Error("Failed to fetch suppliers");
      }
    
      setSuppliersList(response.data);
    
    }

    async function fetchBrutProducts() {
      const response = await apiFetch("/api/products?type=1")

      if (!response.result) {
        throw new Error("Failed to fetch brut products");
      }

      setBrutProductList(response.data);
    }

    fetchSuppliers()
    fetchBrutProducts();

  },[]);

  // --- Event Handlers ---

  // Navigate back to stock page
  function handleGoBack() {
    router.replace("/stock");
  }

  // Switch between product types and reset form
  function changeProductType(type) {
    setIsBrutProduct(type === "BRUT");
    // Reset all fields when switching type
    setProductName("");
    setPrice("");
    setSupplier(null);
    setSalePrice("");
    setShelfLife("");
    setIngredientInput(null);
    setQuantity("");
    setReceipe([]);
    setUnity("");
  }

  // Add ingredient to recipe (FINAL products only)
  function handleAddIngredient() {
    if (!ingredientInput || ingredientInput === "" || !quantity || quantity <= 0) return;
    // Prevent duplicate ingredients
    if (receipe.some((el) => el.ingredientInput === ingredientInput)) return;

    const ingredient = brutProductList.find((el) => el.name === ingredientInput);
    if (!ingredient) return; // Ingredient not found

    setReceipe([...receipe, { name: ingredient.name, id: ingredient._id, quantity: parseInt(quantity) }]);
    setIngredientInput("");
    setQuantity("");
  }

  // Remove ingredient from recipe
  function deleteIngredient(ingredientName) {
    setReceipe(receipe.filter((el) => el.name !== ingredientName));
  }

  // Form submission handler
  async function handleSubmit(e) {
    e.preventDefault();
    
    const type = isBrutProduct ? "BRUT" : "FINAL";

    if (type === "BRUT") {
      if (!productName || !price || !supplier) {
        alert("Veuillez remplir tous les champs requis.");
        return;
      }
    } 
    if (type === "FINAL") {
      if (!productName || !salePrice || !shelfLife || receipe.length === 0) {
        alert("Veuillez remplir tous les champs requis.");
        return;
      }
    }

    const newProduct = type === "BRUT" ? {
      type,
      productName,
      price,
      supplier,
      unity,
    } : {
      type,
      productName,
      salePrice,
      shelfLife,
      receipe,
      unity,
    };
    
    try {
      const response = await apiFetch("/api/products", {
        method: "POST",
        body: JSON.stringify(newProduct),
      })
     
      

      if (!response.result) {
        alert("Erreur dans la production du produit");
        router.replace("/stock");
        return
      }

      alert("Produit créé !");
      router.replace("/stock");
    }catch (error) {
      console.error("Error adding product:", error);
      alert("Une erreur est survenue lors de la création du produit.");
    }
  }

  // --- Render ---
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* User menu */}
      <UserMenu style="absolute top-5 right-10" />

      {/* Back arrow */}
      <div className="self-start pl-10 mt-8">
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="ml-3 cursor-pointer text-emerald-600 hover:text-emerald-800 transition-colors"
          onClick={handleGoBack}
        />
      </div>

      <div className="w-full max-w-2xl px-6 pt-12">
        {/* Title */}
        <h1 className="font-semibold text-3xl text-center text-gray-800 mb-8">
          Nouveau produit
        </h1>

        {/* Product type selector */}
        <ProductTypeSelector
          isBrutProduct={isBrutProduct}
          changeProductType={changeProductType}
        />

        {/* Main form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 space-y-6"
        >
          {/* Dynamic form fields based on product type */}
          {isBrutProduct ? (
            <BrutProductFields
              productName={productName}
              setProductName={setProductName}
              price={price}
              setPrice={setPrice}
              suppliersList={suppliersList}
              supplier={supplier}
              setSupplier={setSupplier}
              unity={unity}
              setUnity={setUnity}
            />
          ) : (
            <FinalProductFields
              productName={productName}
              setProductName={setProductName}
              salePrice={salePrice}
              setSalePrice={setSalePrice}
              shelfLife={shelfLife}
              setShelfLife={setShelfLife}
              brutProductList={brutProductList}
              ingredientInput={ingredientInput}
              setIngredientInput={setIngredientInput}
              quantity={quantity}
              setQuantity={setQuantity}
              receipe={receipe}
              handleAddIngredient={handleAddIngredient}
              deleteIngredient={deleteIngredient}
              unity={unity}
              setUnity={setUnity}
            />
          )}

          {/* Submit button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="flex cursor-pointer items-center bg-emerald-500 text-white px-6 py-2 rounded-md hover:bg-emerald-600 transition-colors"
            >
              Enregistrer le produit
              <FontAwesomeIcon icon={faSave} className="text-sm ml-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Protected(NewProduct);
