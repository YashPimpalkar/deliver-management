"use client";

import { MapContainer,TileLayer,Popup,Marker } from 'react-leaflet'


interface Order {
  _id: string;
  product: string;
  status: string;
  location: {
    lat: number;
    lng: number;
  };
}

interface Props {
  orders: Order[];
}

export default function MapView({ orders }: Props) {
  return (
    <MapContainer
      center={[19.076, 72.8777]} // Mumbai default
      zoom={11}
      className="h-[500px] w-full mt-4 rounded"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {orders.map((order) => (
        <Marker
          key={order._id}
          position={[order.location.lat, order.location.lng]}
        >
          <Popup>
            <p>
              <strong>{order.product}</strong>
            </p>
            <p>Status: {order.status}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
