import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag, faUserCircle, faPen } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

function CustomerList({ id, name, tags, orders, isFirst }) {
  const router = useRouter();

  const totalOrders = orders
    .reduce((acc, curr) => {
      return acc + curr.price;
    }, 0)
    .toFixed(2);

  function handleModif(id, e) {
    e.stopPropagation();
    router.push(`/customers/${id}/edit`);
  }

  function handleDetails(id) {
    router.push(`/customers/${id}`);
  }

  return (
    <div
      onClick={() => handleDetails(id)}
      className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 rounded-lg p-6 cursor-pointer hover:border-emerald-200"
    >
      <div className="flex items-center justify-between">
        {/* Avatar and Name */}
        <div className="flex items-center space-x-4 min-w-0 flex-1">
          <div className="text-emerald-600">
            <FontAwesomeIcon icon={faUserCircle} className="text-4xl" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-gray-800 truncate">
              {name}
            </h3>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mx-4 max-w-xs">
          {tags.map((el) => {
            return (
              <div
                key={el}
                className="flex items-center bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md border border-emerald-200"
              >
                <FontAwesomeIcon icon={faTag} className="text-xs mr-1" />
                <span className="text-xs font-medium">{el}</span>
              </div>
            );
          })}
        </div>

        {/* Total Orders */}
        <div className="text-right min-w-0 mx-4">
          <p className="text-sm text-gray-600">Total commandes</p>
          <p className="text-lg font-bold text-gray-800">{totalOrders} €</p>
        </div>

        {/* Edit Button */}
        <div className="ml-4">
          <button
            onClick={(e) => handleModif(id, e)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white w-10 h-10 aspect-square rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 flex items-center justify-center"
            title="Modifier le client"
          >
            <FontAwesomeIcon icon={faPen} className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomerList;
