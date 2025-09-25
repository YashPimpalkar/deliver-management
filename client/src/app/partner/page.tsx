"use client";

import { useEffect, useState, useMemo, useCallback } from "react"; // Import useCallback
import Link from "next/link";
// import api from "@/lib/axios";
// import { getToken } from "@/lib/auth";
import { CheckCircle2, Clock, MapPin, Power, PowerOff, Send, ListOrdered } from "lucide-react";

// Define a type for your order object
type Order = {
  id: string;
  customerName: string;
  address: string;
  status: "pending" | "completed";
};

// Define a type for the location state
type Location = {
  latitude: number;
  longitude: number;
} | null;

export default function PartnerDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [location, setLocation] = useState<Location>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);

  // Fetch orders when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      const mockOrders: Order[] = [
        { id: 'ORD001', customerName: 'Alice Johnson', address: '123 Tech Avenue, Mumbai', status: 'pending' },
        { id: 'ORD002', customerName: 'Bob Williams', address: '456 Code Street, Mumbai', status: 'pending' },
        { id: 'ORD003', customerName: 'Charlie Brown', address: '789 Route Lane, Mumbai', status: 'completed' },
      ];
      setOrders(mockOrders);
    };
    fetchOrders();
  }, []);
  
  // Calculate delivery counts
  const { completedCount, pendingCount } = useMemo(() => ({
    completedCount: orders.filter(o => o.status === 'completed').length,
    pendingCount: orders.filter(o => o.status === 'pending').length,
  }), [orders]);

  // --- MODIFICATION 1: Wrapped function in useCallback ---
  // Function to get the user's current location, wrapped for stability
  const handleGetCurrentLocation = useCallback(() => {
    setIsLoadingLocation(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoadingLocation(false);
      },
      (error) => {
        setLocationError(`Error: ${error.message}`);
        setIsLoadingLocation(false);
      }
    );
  }, []); // Empty dependency array means this function never changes

  // --- MODIFICATION 2: Added useEffect to trigger location fetch ---
  // When the partner goes online, automatically fetch their location.
  useEffect(() => {
    if (isAvailable) {
      handleGetCurrentLocation();
    }
  }, [isAvailable, handleGetCurrentLocation]);
  
  // Placeholder function to update delivery status
  const handleUpdateDelivery = (orderId: string) => {
      alert(`Updating status for order: ${orderId}. (This is a placeholder)`);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-full"><CheckCircle2 className="text-green-600" size={28} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Deliveries Completed</p>
            <p className="text-3xl font-bold text-gray-800">{completedCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <div className="bg-yellow-100 p-3 rounded-full"><Clock className="text-yellow-600" size={28} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Deliveries</p>
            <p className="text-3xl font-bold text-gray-800">{pendingCount}</p>
          </div>
        </div>
      </div>

      {/* Actions Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Availability Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="font-semibold text-lg text-gray-800 mb-4">Manage Availability</h2>
          <div className="flex items-center justify-between">
            <p className={`font-medium ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
              Status: {isAvailable ? 'Available for Deliveries' : 'Unavailable'}
            </p>
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold text-white transition-colors ${isAvailable ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {isAvailable ? <PowerOff size={18} /> : <Power size={18} />}
              <span>{isAvailable ? 'Go Offline' : 'Go Online'}</span>
            </button>
          </div>
        </div>
        
        {/* Location Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="font-semibold text-lg text-gray-800 mb-4">Your Location</h2>
          <div className="flex items-center justify-between">
            <div>
              {location && (
                <p className="text-gray-700 font-mono text-sm">
                  Lat: {location.latitude.toFixed(4)}, Lon: {location.longitude.toFixed(4)}
                </p>
              )}
              {locationError && <p className="text-red-500 text-sm">{locationError}</p>}
            </div>
            <button onClick={handleGetCurrentLocation} disabled={isLoadingLocation} className="flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 transition-colors">
              <MapPin size={18} />
              <span>{isLoadingLocation ? 'Fetching...' : 'Get Location'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pending Deliveries List */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Pending Deliveries</h2>
            <Link 
              href="/partner/deliveries" 
              className="mt-3 sm:mt-0 inline-flex items-center space-x-2 px-4 py-2 text-sm rounded-md font-semibold text-white bg-gray-700 hover:bg-gray-800 transition-colors"
            >
                <ListOrdered size={16}/>
                <span>Manage All Deliveries</span>
            </Link>
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {orders.filter(o => o.status === 'pending').map(order => (
              <li key={order.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">{order.customerName}</p>
                  <p className="text-sm text-gray-500">{order.address}</p>
                </div>
                <button
                  onClick={() => handleUpdateDelivery(order.id)}
                  className="mt-3 sm:mt-0 flex items-center space-x-2 px-4 py-2 text-sm rounded-md font-semibold text-white bg-indigo-500 hover:bg-indigo-600 transition-colors"
                >
                  <Send size={16}/>
                  <span>Update Status</span>
                </button>
              </li>
            ))}
            {pendingCount === 0 && <p className="p-4 text-gray-500">No pending deliveries right now.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
}