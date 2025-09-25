"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import DeliveryForm from "@/components/orders/DeliveryForm";
import PartnerSelector from "@/components/orders/PartnerSelector";
import SubmitButtons from "@/components/orders/SubmitButtons";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("@/components/orders/MapPicker"), { ssr: false });

interface Partner {
  id: string;
  name: string;
  email: string;
  lastLocation?: {
    latitude: number;
    longitude: number;
  };
}

export default function CreateOrderPage() {
  const [deliveryName, setDeliveryName] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await api.get("/api/users/available");
        setPartners(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPartners();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryName.trim() || !address.trim() || !deliveryDate || !deliveryTime) {
      alert("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      await api.post("/api/orders/", {
        deliveryName: deliveryName.trim(),
        address: address.trim(),
        deliveryDate: new Date(`${deliveryDate}T${deliveryTime}`),
        location: lat && lng ? { lat, lng } : undefined,
        assignedPartner: selectedPartner || undefined,
      });
      router.push("/orders");
    } catch (err) {
      console.error(err);
      alert("Failed to create order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  console.log(selectedPartner)

  return (
    <main className="flex items-center justify-center min-h-screen p-6 bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 space-y-5">
        <h1 className="text-2xl font-bold text-gray-800">Create New Order</h1>
        <DeliveryForm 
          deliveryName={deliveryName} setDeliveryName={setDeliveryName} 
          address={address} setAddress={setAddress} 
          deliveryDate={deliveryDate} setDeliveryDate={setDeliveryDate} 
          deliveryTime={deliveryTime} setDeliveryTime={setDeliveryTime} 
        />
        <MapPicker lat={lat} lng={lng} setLat={setLat} setLng={setLng} />
        <PartnerSelector 
          partners={partners} search={search} setSearch={setSearch} 
          selectedPartner={selectedPartner} setSelectedPartner={setSelectedPartner} 
        />
        <SubmitButtons loading={loading} />
      </form>
    </main>
  );
}