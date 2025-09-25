"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  MapPin,
  Power,
  PowerOff,
  Send,
  ListOrdered,
  AlertCircle,
  Mail,
  Navigation,
} from "lucide-react";
import api from "@/lib/axios";
import { getUserId } from "@/lib/auth";
import LocationDisplay from "@/components/LocationDisplay";

// Define types
type Order = {
  id: string;
  deliveryName: string;
  address: string;
  status: "pending" | "assigned" | "picked" | "delivered";
  deliveryDate: string;
  location: {
    lat: number;
    lng: number;
  };
};

type DeliveryStats = {
  partner: {
    id: string;
    name: string;
    email: string;
    availability: boolean;
  };
  statistics: {
    deliveriesCompleted: number;
    pendingDeliveries: number;
    overdueDeliveries: number;
    totalAssigned: number;
    completionRate: number;
  };
  pendingDeliveries: Order[];
  completedDeliveries: Order[];
  overdueDeliveries: Order[];
};

type Location = {
  latitude: number;
  longitude: number;
} | null;

export default function PartnerDashboardPage() {
  const [stats, setStats] = useState<DeliveryStats | null>(null);
  const [location, setLocation] = useState<Location>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch partner stats and deliveries
  const fetchPartnerStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = getUserId();

      if (!userId) {
        throw new Error("User ID not found. Please log in again.");
      }

      const response = await api.get(`/api/dashboard/partner/stats/${userId}`);
      setStats(response.data);
      setIsAvailable(response.data.partner.availability);
    } catch (err) {
      console.error("Error fetching partner stats:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPartnerStats();
  }, [fetchPartnerStats]);

  // Calculate counts from stats
  const { completedCount, pendingCount, overdueCount } = useMemo(
    () => ({
      completedCount: stats?.statistics.deliveriesCompleted || 0,
      pendingCount: stats?.statistics.pendingDeliveries || 0,
      overdueCount: stats?.statistics.overdueDeliveries || 0,
    }),
    [stats]
  );

  // Function to get the user's current location
  const handleGetCurrentLocation = useCallback(() => {
    setIsLoadingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(coords);
        setIsLoadingLocation(false);

        const userId = getUserId();
        if (!userId) {
          console.warn("User ID not found, location not sent.");
          return;
        }

        try {
          const res = await api.post("/api/locations/user", {
            userId,
            latitude: coords.latitude,
            longitude: coords.longitude,
          });
          console.log("Location saved:", res.data);
        } catch (err) {
          console.error("Failed to save location:", err);
        }
      },
      (error) => {
        setLocationError(`Error: ${error.message}`);
        setIsLoadingLocation(false);
      }
    );
  }, []);

  // Fetch location automatically when partner is online
  useEffect(() => {
    if (isAvailable) {
      handleGetCurrentLocation();
    }
  }, [isAvailable, handleGetCurrentLocation]);

  // Toggle availability
  const handleToggleAvailability = async () => {
    const userId = getUserId();
    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }

    try {
      const res = await api.put(`/api/users/availability/${userId}`, {
        availability: !isAvailable,
      });
      setIsAvailable(res.data.availability);
      fetchPartnerStats();
    } catch (error) {
      console.error("Error updating availability:", error);
      alert("Error updating availability");
    }
  };

  // Update delivery status
  const handleUpdateDeliveryStatus = async (orderId: string, newStatus: string) => {
    const userId = getUserId();
    if (!userId) return;

    try {
      await api.put(`/api/partners/${userId}/orders/${orderId}/status`, {
        status: newStatus,
      });
      fetchPartnerStats();
    } catch (error) {
      console.error("Error updating delivery status:", error);
      alert("Error updating delivery status");
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "assigned": return "bg-blue-100 text-blue-800 border-blue-200";
      case "picked": return "bg-orange-100 text-orange-800 border-orange-200";
      case "delivered": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchPartnerStats}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, {stats?.partner.name}!
                </h1>
                <div className="flex items-center space-x-4 text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Mail size={16} />
                    <span>{stats?.partner.email}</span>
                  </div>
                  <div className={`flex items-center space-x-1 ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                    <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-medium">
                      {isAvailable ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Link
                  href="/partner/deliveries"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium transition-colors"
                >
                  <ListOrdered size={18} />
                  <span>All Deliveries</span>
                </Link>
                
                <button
                  onClick={handleToggleAvailability}
                  className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                    isAvailable
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {isAvailable ? <PowerOff size={18} /> : <Power size={18} />}
                  <span>{isAvailable ? "Go Offline" : "Go Online"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Completed Deliveries Card */}
          <div className="bg-gradient-to-br from-green-50 to-green-25 rounded-xl shadow-sm p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-800 font-medium mb-1">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{completedCount}</p>
                <p className="text-sm text-green-700 mt-1">
                  {stats?.statistics.completionRate || 0}% success rate
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle2 className="text-green-600" size={28} />
              </div>
            </div>
          </div>

          {/* Pending Deliveries Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-25 rounded-xl shadow-sm p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-800 font-medium mb-1">Pending</p>
                <p className="text-3xl font-bold text-gray-900">{pendingCount}</p>
                <p className="text-sm text-blue-700 mt-1">Active deliveries</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Clock className="text-blue-600" size={28} />
              </div>
            </div>
          </div>

          {/* Overdue Deliveries Card */}
          <div className="bg-gradient-to-br from-red-50 to-red-25 rounded-xl shadow-sm p-6 border border-red-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-800 font-medium mb-1">Overdue</p>
                <p className="text-3xl font-bold text-gray-900">{overdueCount}</p>
                <p className="text-sm text-red-700 mt-1">Need attention</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="text-red-600" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Location & Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Location Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <Navigation size={18} />
                  <span>Current Location</span>
                </h3>
                <button
                  onClick={handleGetCurrentLocation}
                  disabled={isLoadingLocation}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
                >
                  {isLoadingLocation ? "Updating..." : "Refresh"}
                </button>
              </div>

              {location ? (
                <div className="space-y-4">
                  <div className="h-40 rounded-lg overflow-hidden border">
                    <LocationDisplay
                      lat={location.latitude}
                      lng={location.longitude}
                    />
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 font-medium mb-1">Coordinates</p>
                    <p className="text-sm font-mono text-gray-900">
                      {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <MapPin className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-gray-500 text-sm">Location not available</p>
                  {locationError && (
                    <p className="text-red-500 text-xs mt-1">{locationError}</p>
                  )}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Assigned</span>
                  <span className="font-semibold">{stats?.statistics.totalAssigned || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-semibold text-green-600">
                    {stats?.statistics.completionRate || 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Availability</span>
                  <span className={`font-semibold ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                    {isAvailable ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Deliveries */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Deliveries */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Current Deliveries</h3>
                  <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    {pendingCount} active
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {stats?.pendingDeliveries && stats.pendingDeliveries.length > 0 ? (
                  stats.pendingDeliveries.slice(0, 5).map((order) => (
                    <div key={order.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{order.deliveryName}</h4>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{order.address}</p>
                          <p className="text-gray-500 text-xs">
                            Delivery by: {formatDate(order.deliveryDate)}
                          </p>
                        </div>
                        
                        <div className="ml-4 flex space-x-2">
                          {order.status === "assigned" && (
                            <button
                              onClick={() => handleUpdateDeliveryStatus(order.id, "picked")}
                              className="inline-flex items-center space-x-2 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg font-medium transition-colors"
                            >
                              <Send size={14} />
                              <span>Mark Picked</span>
                            </button>
                          )}
                          {order.status === "picked" && (
                            <button
                              onClick={() => handleUpdateDeliveryStatus(order.id, "delivered")}
                              className="inline-flex items-center space-x-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg font-medium transition-colors"
                            >
                              <CheckCircle2 size={14} />
                              <span>Mark Delivered</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <Clock className="mx-auto text-gray-400 mb-3" size={48} />
                    <p className="text-gray-500">No pending deliveries</p>
                    <p className="text-sm text-gray-400 mt-1">Youre all caught up!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Completed Deliveries */}
            {stats?.completedDeliveries && stats.completedDeliveries.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recently Completed</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {stats.completedDeliveries.slice(0, 3).map((order) => (
                    <div key={order.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{order.deliveryName}</p>
                          <p className="text-gray-600 text-sm">{order.address}</p>
                        </div>
                        <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
                          Delivered
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}