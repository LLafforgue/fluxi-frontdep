// React
import React, { useEffect, useState, useRouter } from "react";
import Link from "next/link";
// Components
import UserMenu from "../../components/UserMenu";
import SupplierList from "../../components/SupplierList";
// Redux
import { useSelector } from "react-redux";
// Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faUserPlus,
  faFilter,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import apiFetch from "@/utils/apiFetch";
import Protected from "@/utils/Protected";

/**
 * Suppliers - Main page for managing suppliers
 * Consistent styling with Customers page
 */
function Suppliers() {

  const user = useSelector((state) => state.user.value);


  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [input, setInput] = useState("");
  const [order, setOrder] = useState(null);
  const [tag, setTag] = useState(null);
  const [supplierList, setSupplierList] = useState([]);
  const [tagsList, setTagsList] = useState([])

  // Fetch suppliers and tags on component mount
  useEffect(() => {
    async function fetchSuppliers () {
      try {
        const responseCustomers = await apiFetch("https://fluxi-backdep.vercel.app/api/suppliers")
        
        if (!responseCustomers.result) {
          throw new Error("Failed to fetch clients");
        }

        // Set state to fetched data
        setSupplierList(responseCustomers.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    }

    async function fetchTags() {
      try {
        const responseTags = await apiFetch("/api/suppliers/tags")

        if (!responseTags.result) {
          throw new Error("Failed to fetch tags");
        }

        // Set state to fetched data
        setTagsList(responseTags.data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    }

        fetchTags();
        fetchSuppliers();
  },[]);

  // ReFetch customers and tags when input, tag or order changes
  useEffect(() => {
    const querySearch = input ? `search=${input}&` : "";
    const queryTag = tag ? `tag=${tag}&` : "";
    const queryOrder = order ? `sort=${order}&` : "";
    const fetchUrl = `/api/suppliers?${querySearch}${queryTag}${queryOrder}`;

    async function fetchSuppliers() {
      try {
        const responseSupplier = await apiFetch(fetchUrl);

        if (!responseSupplier.result) {
          throw new Error("Failed to fetch clients");
        }

        // Set state to fetched data
        setSupplierList(responseSupplier.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    }

    fetchSuppliers();
  }, [input, tag, order]);

  // Handle filter visibility toggle
  function toggleFilterSettings() {
    setIsFilterVisible(!isFilterVisible);
    setTag(null);
    setOrder(null);
  }
  // Handle input changes
  function handleInputChange(e) {
    setInput(e.target.value);
  }
  // Handle tag selection
  function handleSelectChange(e) {
    setTag(e.target.value);
  }
  // Handle order selection
  function handleRadioChange(e) {
    setOrder(e.target.value);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserMenu style="absolute top-5 right-10" />

      <div className="w-full max-w-6xl mx-auto px-6 pt-20">
        {/* Title */}
        <div className="mb-8">
          <h1 className="font-semibold text-3xl text-center text-gray-800">
            FOURNISSEURS
          </h1>
        </div>

        {/* Search and New Supplier Section */}
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
              placeholder="Rechercher un fournisseur..."
              className="flex-1 focus:outline-none text-gray-700 placeholder-gray-400"
              value={input}
              onChange={handleInputChange}
            />
            {/* Toggle filter settings */}
            <FontAwesomeIcon
              icon={faFilter}
              className={`ml-3 cursor-pointer transition-colors ${
                isFilterVisible
                  ? "text-emerald-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              onClick={toggleFilterSettings}
            />
          </div>

          {/* New Supplier Button */}
          <Link href="suppliers/new">
            <div className="flex items-center bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors cursor-pointer shadow-sm">
              <span className="font-medium">Nouveau Fournisseur</span>
              <FontAwesomeIcon icon={faUserPlus} className="ml-2" />
            </div>
          </Link>
        </div>

        {/* Filters Section */}
        {isFilterVisible && (
          <div className="bg-white shadow-sm rounded-lg p-8 mb-6 border border-gray-200">
            <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-start lg:justify-center">
              {/* Tag filter */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
                <label
                  htmlFor="tag-select"
                  className="flex items-center text-gray-700 font-medium whitespace-nowrap"
                >
                  <FontAwesomeIcon
                    icon={faTag}
                    className="mr-2 text-emerald-600"
                  />
                  Filtre par tag :
                </label>
                <select
                  name="tags"
                  onChange={handleSelectChange}
                  id="tag-select"
                  className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 min-w-40"
                >
                  <option value="">Tous les tags</option>
                  {tagsList.map((el) => (
                    <option key={el} value={el}>
                      {el}
                    </option>
                  ))}
                </select>
              </div>

              {/* Separator */}
              <div className="hidden lg:block w-px h-10 bg-gray-300 mx-4"></div>

              {/* Sort */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
                <span className="text-gray-700 font-medium whitespace-nowrap">
                  Tri alphabétique :
                </span>
                <div className="flex items-center gap-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      id="asc"
                      name="tri"
                      value="asc"
                      onChange={handleRadioChange}
                      checked={order === "asc"}
                      className="mr-2 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700 font-medium">
                      A → Z
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      id="dsc"
                      name="tri"
                      value="dsc"
                      onChange={handleRadioChange}
                      checked={order === "dsc"}
                      className="mr-2 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700 font-medium">
                      Z → A
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suppliers List */}
        <div className="space-y-4 pb-8">
          {supplierList.length > 0 ? (
            supplierList.map((el) => (
              <SupplierList
                key={el._id}
                name={el.name}
                id={el._id}
                tags={el.tags}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucun fournisseur trouvé</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Protected(Suppliers);
