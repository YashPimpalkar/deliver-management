"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Filter, Edit3, Truck, CheckCircle, Clock, MapPin, RefreshCw } from "lucide-react";
import api from "@/lib/axios";
import { getUserId } from "@/lib/auth";
import LocationDisplay from "@/components/LocationDisplay";

interface Order {
  _id: string;
  deliveryName: string;
  address: string;
  status: "pending" | "assigned" | "picked" | "delivered";
  deliveryDate: string;
  location: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function PartnerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch all orders for the partner
  const fetchOrders = async () => {
    try {
      const userId = getUserId();
      
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const response = await api.get(`/api/orders/partner/${userId}`);
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders based on search and status
  const filteredOrders = useMemo(() => 
    orders.filter(order => {
      const matchesSearch = searchTerm === "" || 
        order.deliveryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    }), [orders, searchTerm, statusFilter]
  );

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrder(orderId);
      
      // First update the status via API
      await api.put(`/api/orders/${orderId}/status`, {
        status: newStatus
      });

      // Then refresh the entire orders list to get the latest data
      setRefreshing(true);
      await fetchOrders();

      alert("Order status updated successfully!");
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    } finally {
      setUpdatingOrder(null);
    }
  };

  // Manual refresh function
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "assigned": return "bg-blue-100 text-blue-800 border-blue-200";
      case "picked": return "bg-orange-100 text-orange-800 border-orange-200";
      case "delivered": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock size={16} />;
      case "assigned": return <Truck size={16} />;
      case "picked": return <Edit3 size={16} />;
      case "delivered": return <CheckCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case "pending": return { status: "assigned", label: "Assign", color: "blue" };
      case "assigned": return { status: "picked", label: "Mark as Picked", color: "orange" };
      case "picked": return { status: "delivered", label: "Mark as Delivered", color: "green" };
      case "delivered": return null;
      default: return null;
    }
  };

  // Count orders by status
  const statusCounts = useMemo(() => ({
    all: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    assigned: orders.filter(o => o.status === "assigned").length,
    picked: orders.filter(o => o.status === "picked").length,
    delivered: orders.filter(o => o.status === "delivered").length,
  }), [orders]); 

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-2">
              Manage your assigned delivery orders ({orders.length} total)
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
            <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by delivery name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-4">
              <Filter size={20} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Orders ({statusCounts.all})</option>
                <option value="pending">Pending ({statusCounts.pending})</option>
                <option value="assigned">Assigned ({statusCounts.assigned})</option>
                <option value="picked">Picked ({statusCounts.picked})</option>
                <option value="delivered">Delivered ({statusCounts.delivered})</option>
              </select>
            </div>
          </div>

          {/* Results Info */}
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Showing {filteredOrders.length} of {orders.length} orders
              {refreshing && " • Refreshing..."}
            </span>
            {(searchTerm || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">
                {orders.length === 0 
                  ? "You don't have any assigned orders yet." 
                  : "No orders match your search criteria."
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const nextStatus = getNextStatus(order.status);
                
                return (
                  <div key={order._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                      {/* Order Info */}
                      <div className="flex-1 mb-4 lg:mb-0">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {order.deliveryName}
                          </h3>
                          <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <p className="font-medium text-gray-500">Address</p>
                            <p className="flex items-start mt-1">
                              <MapPin size={16} className="text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                              {order.address}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-500">Delivery Date</p>
                            <p className="mt-1">{formatDate(order.deliveryDate)}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-500">Location Coordinates</p>
                            <div className="mt-1 h-40 rounded-lg overflow-hidden font-mono text-xs">
                              <LocationDisplay
                                lat={order.location.lat}
                                lng={order.location.lng}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex space-x-4 text-xs text-gray-500">
                          <span>Created: {formatDate(order.createdAt)}</span>
                          <span>Updated: {formatDate(order.updatedAt)}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col space-y-2 lg:ml-6 lg:text-right">
                        {nextStatus && (
                          <button
                            onClick={() => handleStatusUpdate(order._id, nextStatus.status)}
                            disabled={updatingOrder === order._id || refreshing}
                            className={`inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                              nextStatus.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
                              nextStatus.color === 'orange' ? 'bg-orange-600 hover:bg-orange-700' :
                              'bg-green-600 hover:bg-green-700'
                            } disabled:opacity-50`}
                          >
                            {updatingOrder === order._id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              getStatusIcon(nextStatus.status)
                            )}
                            <span>
                              {updatingOrder === order._id ? "Updating..." : nextStatus.label}
                            </span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            window.location.href = `/orders/${order._id}`;
                          }}
                          className="inline-flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Edit3 size={16} />
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Status Summary */}
        {orders.length > 0 && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-800">{statusCounts.pending}</div>
              <div className="text-sm text-yellow-600">Pending</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-800">{statusCounts.assigned}</div>
              <div className="text-sm text-blue-600">Assigned</div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-800">{statusCounts.picked}</div>
              <div className="text-sm text-orange-600">Picked</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-800">{statusCounts.delivered}</div>
              <div className="text-sm text-green-600">Delivered</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}