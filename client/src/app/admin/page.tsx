"use client";
import Link from "next/link";
import { logout } from "@/lib/auth";
import { 
  Truck, 
  BadgeCheck, 
  Clock, 
  Users, 
  UserRoundCheck, 
  UserRoundX,
  PlusCircle,
  RefreshCw
} from 'lucide-react';
import { useState, useEffect } from "react";
import api from "@/lib/axios";

interface DashboardStats {
  newDeliveries: number;
  deliveriesCompleted: number;
  pendingDeliveries: number;
  totalPartners: number;
  partnersReady: number;
  partnersNotReady: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    newDeliveries: 0,
    deliveriesCompleted: 0,
    pendingDeliveries: 0,
    totalPartners: 0,
    partnersReady: 0,
    partnersNotReady: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get("/api/dashboard/admin/stats");
      console.log(response.data)
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardStats();
  };

  if (loading) {
    return (
      <div role="admin">
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="animate-spin mx-auto mb-4 text-blue-600" size={32} />
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div role="admin">
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Delivery Dashboard</h1>
              <p className="mt-1 text-gray-600">Overview of delivery operations and partner status.</p>
            </div>
            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center justify-center bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg font-semibold shadow-sm hover:bg-gray-200 transition-colors duration-300 disabled:opacity-50"
              >
                <RefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} size={20}/>
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              <Link 
                href="/admin/orders/create" 
                className="flex items-center justify-center bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm hover:bg-blue-700 transition-colors duration-300"
              >
                <PlusCircle size={20} className="mr-2"/>
                Create Delivery
              </Link>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Card 1: New Deliveries */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Truck className="text-blue-600" size={24}/>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">New Deliveries</p>
                <p className="text-3xl font-bold text-gray-800">{stats.newDeliveries}</p>
                <p className="text-xs text-gray-400 mt-1">Todays pending orders</p>
              </div>
            </div>

            {/* Card 2: Deliveries Completed */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <BadgeCheck className="text-green-600" size={24}/>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Deliveries Completed</p>
                <p className="text-3xl font-bold text-gray-800">{stats.deliveriesCompleted}</p>
                <p className="text-xs text-gray-400 mt-1">Total delivered</p>
              </div>
            </div>

            {/* Card 3: Pending Deliveries */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-start space-x-4">
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="text-yellow-600" size={24}/>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Deliveries</p>
                <p className="text-3xl font-bold text-gray-800">{stats.pendingDeliveries}</p>
                <p className="text-xs text-gray-400 mt-1">In progress</p>
              </div>
            </div>
            
            {/* Card 4: Total Partners */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-start space-x-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="text-purple-600" size={24}/>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Partners</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalPartners}</p>
                <p className="text-xs text-gray-400 mt-1">All partners</p>
              </div>
            </div>

            {/* Card 5: Partners Ready */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-start space-x-4">
              <div className="bg-teal-100 p-3 rounded-full">
                <UserRoundCheck className="text-teal-600" size={24}/>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Partners Ready</p>
                <p className="text-3xl font-bold text-gray-800">{stats.partnersReady}</p>
                <p className="text-xs text-gray-400 mt-1">Available now</p>
              </div>
            </div>

            {/* Card 6: Partners Not Ready */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-start space-x-4">
              <div className="bg-red-100 p-3 rounded-full">
                <UserRoundX className="text-red-600" size={24}/>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Partners Not Ready</p>
                <p className="text-3xl font-bold text-gray-800">{stats.partnersNotReady}</p>
                <p className="text-xs text-gray-400 mt-1">Unavailable</p>
              </div>
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Delivery Summary</h3>
              <div className="flex justify-between items-center">
                <span>Completion Rate</span>
                <span className="text-2xl font-bold">
                  {stats.deliveriesCompleted + stats.pendingDeliveries > 0 
                    ? Math.round((stats.deliveriesCompleted / (stats.deliveriesCompleted + stats.pendingDeliveries)) * 100)
                    : 0
                  }%
                </span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Partner Availability</h3>
              <div className="flex justify-between items-center">
                <span>Ready Rate</span>
                <span className="text-2xl font-bold">
                  {stats.totalPartners > 0 
                    ? Math.round((stats.partnersReady / stats.totalPartners) * 100)
                    : 0
                  }%
                </span>
              </div>
            </div>
          </div>

          {/* Management Actions */}
          <section className="mt-10 bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Management Actions</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/admin/deliveries" 
                className="flex-1 text-center bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-300"
              >
                Manage Deliveries
              </Link>
              <Link 
                href="/admin/partners" 
                className="flex-1 text-center bg-gray-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-300"
              >
                Manage Partners
              </Link>
            </div>
          </section>

          {/* Logout Button */}
          <div className="mt-12 flex justify-center">
            <button
              onClick={logout}
              className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}