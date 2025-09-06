import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import apiFetch from "@/utils/apiFetch";

const Map = dynamic(() => import("./MapComponent"), {
  ssr: false, // Empêche le chargement côté serveur
});


export default function ClientsMapWrapper() {
    const [customers, setCustomers] = useState([]);
    const user = useSelector((state) => state.user.value);
    // Récupération des clients depuis l'API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await apiFetch("/api/customers")
       
        if (res.result) {
          setCustomers(res.data);
        }
      } catch (err) {
        console.error("Erreur récupération clients :", err);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="">
      <Map customers={customers} />
    </div>
  );
}
  


