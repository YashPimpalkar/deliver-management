"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import L from "leaflet";
// Dynamically import the map components
const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });

interface LocationDisplayProps {
  lat: number;
  lng: number;
}

// Custom marker icon
const markerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function LocationDisplay({ lat, lng}: LocationDisplayProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Map settings
  const center: L.LatLngExpression = [lat, lng];
  const ZOOM_LEVEL = 15;
  const osmUrl = "https://api.maptiler.com/maps/basic/256/{z}/{x}/{y}.png?key=fXmTwJM642uPLZiwzhA1";
  const attribution = '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';

  if (!isClient) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-600">Loading map...</p>
      </div>
    );
  }

  const location: L.LatLngExpression = [lat, lng];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Location
      </label>
      
      <div className="h-64 w-full border border-gray-300 rounded-lg overflow-hidden mb-2">
        <MapContainer 
          center={center} 
          zoom={ZOOM_LEVEL} 
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer url={osmUrl} attribution={attribution} />
          <Marker position={location} icon={markerIcon}>
            <Popup>
              <div className="text-sm">
                <span className="text-gray-600">
                  Lat: {lat.toFixed(6)}, Lng: {lng.toFixed(6)}
                </span>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      
      <p className="text-sm text-gray-600">
        Coordinates: <strong>{lat.toFixed(6)}, {lng.toFixed(6)}</strong>
      </p>
    </div>
  );
}