"use client";

import { useEffect, useState } from "react";
// import api from "@/lib/axios";
import { Pencil, Trash2, Check, X, Search, ChevronLeft, ChevronRight } from "lucide-react";

// --- Mock API for demonstration purposes (replace with your actual api import) ---
import api from "@/lib/axios";
// --- End of Mock API ---

interface Partner {
  _id: string;
  name: string;
  email: string;
  role: string;
  availability: boolean;
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [search, setSearch] = useState<string>("");
  const [filtered, setFiltered] = useState<Partner[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Partner>>({});
  const usersPerPage = 5;

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const res = await api.get<Partner[]>("/api/users/allpartners");
      setPartners(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Error fetching partners:", err);
    }
  };

  // Filter partners whenever search changes
  useEffect(() => {
    const searchTerm = search.toLowerCase();
    const filteredList = partners.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.email.toLowerCase().includes(searchTerm)
    );
    setFiltered(filteredList);
    setCurrentPage(1);
  }, [search, partners]);

  // Pagination logic
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentPartners = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / usersPerPage);

  // Handle edit
  const handleEdit = (partner: Partner) => {
    setEditingId(partner._id);
    setEditForm({ ...partner });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async () => {
    if (!editingId) return;
    try {
      await api.put(`/api/users/${editingId}`, editForm);
      await fetchPartners();
      setEditingId(null);
      setEditForm({});
    } catch (err) {
      console.error("Error updating partner:", err);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this partner?")) return;
    try {
      await api.delete(`/api/users/${id}`);
      await fetchPartners();
    } catch (err) {
      console.error("Error deleting partner:", err);
    }
  };

  return (
    <div className=" min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Manage Partners</h1>
          <p className="text-slate-500 mt-1">Search, edit, and manage partner accounts.</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          />
        </div>

        {/* Partner List */}
        <div className="space-y-4">
          {currentPartners.length > 0 ? (
            currentPartners.map((partner) => (
              <div
                key={partner._id}
                className="p-4 border border-slate-200 rounded-lg bg-white transition-all duration-300 hover:border-blue-400 hover:shadow-md"
              >
                {editingId === partner._id ? (
                  // --- Editing View ---
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                       <input
                        type="text"
                        value={editForm.name || ""}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                       <input
                        type="email"
                        value={editForm.email || ""}
                        disabled
                        className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                      />
                    </div>
                    <select
                      value={editForm.availability ? "true" : "false"}
                      onChange={(e) => setEditForm({ ...editForm, availability: e.target.value === "true" })}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="true">Available</option>
                      <option value="false">Unavailable</option>
                    </select>
                    <div className="flex space-x-3 items-center pt-2">
                      <button onClick={handleSave} className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                        <Check size={18} className="mr-2"/> Save
                      </button>
                      <button onClick={handleCancel} className="inline-flex items-center px-4 py-2 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300 transition-colors">
                        <X size={18} className="mr-2"/> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // --- Display View ---
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                    <div className="flex items-center mb-3 sm:mb-0">
                       <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg mr-4">
                          {partner.name.charAt(0)}
                       </div>
                       <div>
                         <p className="font-semibold text-slate-800">{partner.name}</p>
                         <p className="text-slate-500 text-sm">{partner.email}</p>
                         <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${partner.availability ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                           {partner.availability ? "Available" : "Unavailable"}
                         </span>
                       </div>
                    </div>
                    <div className="flex space-x-2 self-end sm:self-center">
                      <button onClick={() => handleEdit(partner)} className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => handleDelete(partner._id)} className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-center py-8">No partners found matching your search.</p>
          )}
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg enabled:hover:bg-blue-50 disabled:text-slate-300 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-blue-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg enabled:hover:bg-blue-50 disabled:text-slate-300 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}