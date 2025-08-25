import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const franceBounds = [
  [41.303, -5.142], 
  [51.124, 9.561]   
];

// Configuration des icônes par défaut pour Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapComponent({ customers }) {
  

  // Filtrage des clients pour ne garder que ceux avec des coordonnées valides
  const validCustomers = customers
    ?.filter(customer => {
      // Vérification que le customer a des coordonnées valides
      const hasValidCoords = customer.latitude && customer.longitude && 
                           typeof customer.latitude === 'number' && 
                           typeof customer.longitude === 'number';
      
      if (!hasValidCoords) {
        
      }
      
      return hasValidCoords;
    })
    .map(customer => {
      return customer;
    }) || [];


  return (
    <div>
      <div className="mb-2 text-sm text-emerald-600 text-center">
        {validCustomers.length} client(s) à afficher sur la carte
      </div>
      
      <MapContainer
        bounds={franceBounds}
        zoom={6}
        style={{ height: "400px", width: "400px" }}
        className="rounded border"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© Fluxi"
        />

        {validCustomers.map((customer) => (
          <Marker
            key={customer._id}
            position={[customer.latitude, customer.longitude]} 
            icon={L.icon({
              iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
              iconSize: [32, 32],
              iconAnchor: [16, 32],
              popupAnchor: [0, -32],
            })}
          >
            <Popup>
              <div>
                <div className="font-bold">{customer.name}</div>
                <div className="text-sm">{customer.address}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {customer.latitude.toFixed(4)}, {customer.longitude.toFixed(4)}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
