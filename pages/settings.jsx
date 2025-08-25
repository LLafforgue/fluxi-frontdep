import React, { useEffect, useState } from "react";
import Protected from "@/utils/Protected";

/**
 * Settings
 * User settings page with a simple card style, consistent with other forms.
 */
function Settings() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Fetch user data from API or local storage
    // setUsername(fetchedUser.username);
    // setEmail(fetchedUser.email);
    // setPassword(fetchedUser.password);
  }, []);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50">
      <div className="p-10">
        <h1 className="font-semibold text-2xl text-center">Paramètres</h1>
        <p className="text-gray-600 text-center mt-2 mb-6">
          Gérez vos informations personnelles et préférences.
        </p>
        <div className="flex flex-col items-center">
          <form className="flex flex-col w-96 border-2 rounded-md p-6 bg-white shadow">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                className="h-8 w-full border rounded-md outline-stone-400 border-stone-400 text-sm pl-3"
                placeholder="Entrez votre nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                className="h-8 w-full border rounded-md outline-stone-400 border-stone-400 text-sm pl-3"
                placeholder="Entrez votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                className="h-8 w-full border rounded-md outline-stone-400 border-stone-400 text-sm pl-3"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition cursor-pointer mt-2"
            >
              Enregistrer les modifications
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Protected(Settings);
