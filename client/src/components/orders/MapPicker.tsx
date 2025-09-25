"use client";
import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import { useMapEvents} from "react-leaflet";



const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });



interface MapPickerProps {
  lat: number | null;
  lng: number | null;
  setLat: (val: number) => void;
  setLng: (val: number) => void;
}

interface MapEventsComponentProps {
  setLat: (val: number) => void;
  setLng: (val: number) => void;
  setPosition: (pos: L.LatLngExpression) => void;
}

const markerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapEventsComponent: React.FC<MapEventsComponentProps> = ({ setLat, setLng, setPosition }) => {
  useMapEvents({
    click(e: L.LeafletMouseEvent) {
      const { lat, lng } = e.latlng;
      setLat(lat);
      setLng(lng);
      setPosition([lat, lng]);
    },
  });
  return null;
};

const MapPicker: React.FC<MapPickerProps> = ({ lat, lng, setLat, setLng }) => {
  const [position, setPosition] = useState<L.LatLngExpression | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [isClient, setIsClient] = useState(false);

  const center: L.LatLngExpression = [19.0760, 72.8777];
  const ZOOM_LEVEL = 12;
  const osmUrl = "https://api.maptiler.com/maps/basic/256/{z}/{x}/{y}.png?key=fXmTwJM642uPLZiwzhA1";
  const attribution = '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';

  useEffect(() => setIsClient(true), []);

  if (!isClient) return <div className="h-64 flex items-center justify-center bg-gray-100">Loading map...</div>;

  return (
    <div>
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Location (Click on the map)
      </label>

      {/* Map */}
      <div className="h-64 w-full border border-gray-300 rounded-lg overflow-hidden">
        <MapContainer center={center} zoom={ZOOM_LEVEL} style={{ height: "100%", width: "100%" }} ref={mapRef}>
          <TileLayer url={osmUrl} attribution={attribution} />
          <MapEventsComponent setLat={setLat} setLng={setLng} setPosition={setPosition} />
          {position && (
            <Marker position={position} icon={markerIcon}>
              <Popup>
                <b>Selected Delivery Location</b><br />
                Lat: {Array.isArray(position) ? position[0].toFixed(5) : 'N/A'}, Lng: {Array.isArray(position) ? position[1].toFixed(5) : 'N/A'}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Selected Coordinates */}
      <p className="mt-2 text-sm text-gray-600">
        Selected Location:{" "}
        {lat && lng ? (
          <b>{lat.toFixed(5)}, {lng.toFixed(5)}</b>
        ) : (
          <span className="text-gray-500">Not selected</span>
        )}
      </p>
    </div>
  );
};

export default MapPicker;
