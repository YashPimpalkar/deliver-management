"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import dynamic from "next/dynamic";
import PartnerSelector from "@/components/orders/PartnerSelector";
import EditPartnerSelector from "@/components/orders/EditPartnerSelector";
import LocationDisplay from "@/components/LocationDisplay";

// Dynamically import the map component
const MapPicker = dynamic(() => import("@/components/orders/MapPicker"), {
  ssr: false,
});

interface Partner {
  id: string;
  name: string;
  email: string;
  lastLocation?: {
    latitude: number;
    longitude: number;
  };
}

interface Order {
  _id: string;
  deliveryName: string;
  address: string;
  status: "pending" | "assigned" | "picked" | "delivered";
  deliveryDate: string;
  location: { lat: number; lng: number };
  assignedPartner: Partner | null;
  createdAt: string;
  updatedAt: string;
}

export default function OrderPage() {
  const params = useParams();
  const orderid = params.orderid;
  console.log(orderid);

  const [order, setOrder] = useState<Order | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [partnerSearch, setPartnerSearch] = useState("");
  const [selectedPartner, setSelectedPartner] = useState("");

  // Editable fields state
  const [formData, setFormData] = useState({
    deliveryName: "",
    address: "",
    status: "pending" as "pending" | "assigned" | "picked" | "delivered",
    deliveryDate: "",
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [orderRes, partnersRes] = await Promise.all([
          api.get(`/api/orders/${orderid}`),
          api.get("/api/users/allpartners"), // Adjust this endpoint as needed
        ]);

        setOrder(orderRes.data);
        setPartners(partnersRes.data);

        // Initialize form data
        if (orderRes.data) {
          setFormData({
            deliveryName: orderRes.data.deliveryName,
            address: orderRes.data.address,
            status: orderRes.data.status,
            deliveryDate: new Date(orderRes.data.deliveryDate)
              .toISOString()
              .split("T")[0],
            lat: orderRes.data.location.lat,
            lng: orderRes.data.location.lng,
          });
          setSelectedPartner(orderRes.data.assignedPartner?._id || "");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [orderid]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      lat,
      lng,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updateData = {
        deliveryName: formData.deliveryName,
        address: formData.address,
        status: formData.status,
        deliveryDate: formData.deliveryDate,
        location: {
          lat: formData.lat,
          lng: formData.lng,
        },
        assignedPartner: selectedPartner || null,
      };

      const res = await api.put(`/api/orders/${orderid}`, updateData);
      setOrder(res.data);
      setIsEditing(false);
      alert("Order updated successfully!");
    } catch (err) {
      console.error("Error updating order:", err);
      alert("Error updating order. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (order) {
      setFormData({
        deliveryName: order.deliveryName,
        address: order.address,
        status: order.status,
        deliveryDate: new Date(order.deliveryDate).toISOString().split("T")[0],
        lat: order.location.lat,
        lng: order.location.lng,
      });
      setSelectedPartner(order.assignedPartner?.id || "");
    }
    setIsEditing(false);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  if (!order) return <p className="p-6 text-red-600">Order not found.</p>;
  console.log(selectedPartner);
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            <p className="text-gray-600">Order ID: {order._id}</p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              Edit Order
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="deliveryName"
                    value={formData.deliveryName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{order.deliveryName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{order.address}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                {isEditing ? (
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="assigned">Assigned</option>
                    <option value="picked">Picked</option>
                    <option value="delivered">Delivered</option>
                  </select>
                ) : (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "assigned"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "picked"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Date
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">
                    {new Date(order.deliveryDate).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column - Partner & Location */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned Partner
                </label>
                {isEditing ? (
                  <EditPartnerSelector
                    partners={partners}
                    search={partnerSearch}
                    setSearch={setPartnerSearch}
                    selectedPartner={selectedPartner}
                    setSelectedPartner={setSelectedPartner}
                  />
                ) : order.assignedPartner ? (
                  <div className="space-y-1">
                    <p className="text-gray-900">
                      <strong>Name:</strong> {order.assignedPartner.name}
                    </p>
                    <p className="text-gray-900">
                      <strong>Email:</strong> {order.assignedPartner.email}
                    </p>
                    <p className="text-gray-900">
                      <strong>ID:</strong> {selectedPartner}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500">No partner assigned</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location Coordinates
                </label>
                {isEditing ? (
                  <div>
                    <MapPicker
                      lat={formData.lat}
                      lng={formData.lng}
                      setLat={(lat) => handleLocationChange(lat, formData.lng)}
                      setLng={(lng) => handleLocationChange(formData.lat, lng)}
                    />
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        step="any"
                        value={formData.lat}
                        onChange={(e) =>
                          handleLocationChange(
                            parseFloat(e.target.value) || 0,
                            formData.lng
                          )
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Latitude"
                      />
                      <input
                        type="number"
                        step="any"
                        value={formData.lng}
                        onChange={(e) =>
                          handleLocationChange(
                            formData.lat,
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Longitude"
                      />
                    </div>
                  </div>
                ) : (
                  <LocationDisplay
                    lat={order.location.lat}
                    lng={order.location.lng}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <strong>Created:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </div>
              <div>
                <strong>Last Updated:</strong>{" "}
                {new Date(order.updatedAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
