// React
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
// Redux
import { useSelector } from "react-redux";
// Components
import UserMenu from "../../components/UserMenu";
// Fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faEraser,
  faTag,
  faPlus,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import apiFetch from "@/utils/apiFetch";
import Protected from "@/utils/Protected";

function newcustomer() {
  const user = useSelector((state) => state.user.value);
  const router = useRouter();

  // Input state for client fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAdress] = useState("");
  const [phone, setPhone] = useState("");
  // State for tags
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [tagsList, setTagsList] = useState([]);

  // Fetch tags from the API on mount
  useEffect(() => {
    async function fetchTags() {
      try {
        const response = await apiFetch("http://localhost:3001/api/customers/tags")

        if (!response.result) {
          throw new Error("Failed to fetch tags");
        }
        setTagsList(response.data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    }
    fetchTags();
  }, []);

  // Send new client data to backend
  async function saveAction(e) {
    e.preventDefault();

    try {
      const newClient = {
        name,
        email,
        tags,
        address,
        phone,
      };

      const response = await apiFetch("http://localhost:3001/api/customers", {
        method: "POST",
        body: JSON.stringify(newClient),
      })

      if (!response.result) {
        throw new Error("Failed to add client");
      }

      alert("Client créé !");
      router.push("/customers");
    } catch (error) {
      console.error("Error adding client:", error);
    }
  }

  function handleTagChange(e) {
    const value = e.target.value;
    setTags(
      tags.includes(value)
        ? tags.filter((tag) => tag !== value)
        : [...tags, value]
    );
  }

  function handleAddTag(e) {
    e.preventDefault();
    const value = tagInput.trim();
    if (value && !tags.includes(value)) {
      setTags([...tags, value]);
      setTagInput("");
    }
  }

  function handleRemoveTag(tagToRemove) {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  }

  function handleGoBack() {
    router.push("/customers");
  }

  function handleResetForm() {
    setName("");
    setEmail("");
    setAdress("");
    setPhone("");
    setTags([]);
    setTagInput("");
  }

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
        <h1 className="font-semibold text-3xl text-center text-gray-800 mb-8">
          Nouveau client
        </h1>

        <form
          onSubmit={saveAction}
          id="client"
          className="bg-white shadow-md rounded-lg p-6 space-y-6"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="name">
              Nom du client :
            </label>
            <input
              value={name}
              form="client"
              id="name"
              type="text"
              name="clientName"
              required
              placeholder="John Doe"
              className="w-full bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="email">
              Email du client :
            </label>
            <input
              value={email}
              form="client"
              id="email"
              type="email"
              name="clientMail"
              required
              placeholder="john.doe@gmail.com"
              className="w-full bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              <FontAwesomeIcon icon={faTag} className="mr-2" />
              Tags :
            </label>

            {/* Existing tags */}
            <div className="flex flex-wrap gap-2 mb-2">
              {tagsList.map((tag) => (
                <label
                  key={tag}
                  className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded-md cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={tag}
                    checked={tags.includes(tag)}
                    onChange={handleTagChange}
                    className="mr-2"
                  />
                  {tag}
                </label>
              ))}
            </div>

            {/* Manually added tags */}
            <div className="flex flex-wrap gap-2 mb-2">
              {tags
                .filter((tag) => !tagsList.includes(tag))
                .map((tag) => (
                  <span
                    key={tag}
                    className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded flex items-center text-xs"
                  >
                    {tag}
                    <button
                      type="button"
                      className="ml-2 text-red-500"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      ×
                    </button>
                  </span>
                ))}
            </div>

            {/* Manual input */}
            <div className="flex mt-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Ajouter un tag"
                className="flex-1 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button
                className="ml-2 bg-emerald-500 text-white rounded p-2 hover:bg-emerald-600 transition-colors"
                onClick={handleAddTag}
                type="button"
                title="Ajouter le tag"
              >
                <FontAwesomeIcon icon={faPlus} className=""/>
              </button>
            </div>
          </div>

          {/* Address */}
          <div>
            <label
              className="block text-sm font-semibold mb-1"
              htmlFor="address"
            >
              Adresse postale :
            </label>
            <input
              value={address}
              form="client"
              id="address"
              type="text"
              name="clientAddress"
              required
              placeholder="72 rue de la République 13001"
              className="w-full bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              onChange={(e) => setAdress(e.target.value)}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="phone">
              Numéro de téléphone :
            </label>
            <input
              value={phone}
              form="client"
              id="phone"
              type="tel"
              name="clientPhone"
              required
              placeholder="06 12 34 56 78"
              className="w-full bg-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 pt-4">
            <button
              className="flex items-center bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition-colors"
              type="submit"
            >
              Ajouter ce client
              <FontAwesomeIcon icon={faUserPlus} className="text-sm ml-2" />
            </button>

            <button
              className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              type="button"
              onClick={handleResetForm}
            >
              Effacer le formulaire
              <FontAwesomeIcon icon={faEraser} className="text-sm ml-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Protected(newcustomer);
