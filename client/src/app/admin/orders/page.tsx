"use client";
import { useEffect, useState } from "react";
import { getToken } from "@/lib/auth";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/axios";

interface Order {
  _id: string;
  product: string;
  status: "pending" | "assigned" | "picked" | "delivered";
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  assignedPartner?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get<Order[]>("/api/orders", {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <ProtectedRoute role="admin">
      <main className="p-6">
        <h1 className="text-xl font-bold">Orders</h1>
        <ul className="mt-4 space-y-2">
          {orders.map((o) => (
            <li key={o._id} className="border p-2 rounded">
              <p><strong>{o.product}</strong> - {o.status}</p>
              <p className="text-sm text-gray-500">{o.address}</p>
            </li>
          ))}
        </ul>
      </main>
    </ProtectedRoute>
  );
}
