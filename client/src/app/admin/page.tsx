"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { logout } from "@/lib/auth";
import { 
  Truck, 
  BadgeCheck, 
  Clock, 
  Users, 
  UserRoundCheck, 
  UserRoundX,
  PlusCircle
} from 'lucide-react';

// In a real app, you would fetch this data from an API
const dashboardStats = {
  newDeliveries: 12,
  completedDeliveries: 153,
  pendingDeliveries: 8,
  totalPartners: 45,
  partnersReady: 37,
  partnersNotReady: 8,
};

export default function AdminDashboard() {
  return (
    <ProtectedRoute role="admin">
      {/* Added mt-8 (32px) to create space below a fixed navbar */}
      <main className=" min-h-screen ">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Delivery Dashboard</h1>
              <p className="mt-1 text-gray-600">Overview of delivery operations and partner status.</p>
            </div>
            <Link 
              href="/admin/orders/create" 
              className="mt-4 sm:mt-0 flex items-center justify-center bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm hover:bg-blue-700 transition-colors duration-300"
            >
              <PlusCircle size={20} className="mr-2"/>
              Create Delivery
            </Link>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: New Deliveries */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Truck className="text-blue-600" size={24}/>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">New Deliveries</p>
                <p className="text-3xl font-bold text-gray-800">{dashboardStats.newDeliveries}</p>
              </div>
            </div>

            {/* Card 2: Deliveries Completed */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <BadgeCheck className="text-green-600" size={24}/>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Deliveries Completed</p>
                <p className="text-3xl font-bold text-gray-800">{dashboardStats.completedDeliveries}</p>
              </div>
            </div>

            {/* Card 3: Pending Deliveries */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Clock className="text-yellow-600" size={24}/>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Deliveries</p>
                <p className="text-3xl font-bold text-gray-800">{dashboardStats.pendingDeliveries}</p>
              </div>
            </div>
            
            {/* Card 4: Total Partners */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="text-blue-600" size={24}/>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Partners</p>
                <p className="text-3xl font-bold text-gray-800">{dashboardStats.totalPartners}</p>
              </div>
            </div>

            {/* Card 5: Partners Ready */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <UserRoundCheck className="text-green-600" size={24}/>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Partners Ready</p>
                <p className="text-3xl font-bold text-gray-800">{dashboardStats.partnersReady}</p>
              </div>
            </div>

            {/* Card 6: Partners Not Ready */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <UserRoundX className="text-red-600" size={24}/>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Partners Not Ready</p>
                <p className="text-3xl font-bold text-gray-800">{dashboardStats.partnersNotReady}</p>
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
              className="mt-6 bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}