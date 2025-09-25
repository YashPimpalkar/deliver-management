"use client";
import React from "react";

interface Partner {
  _id: string;
  name: string;
  email: string;
}

interface PartnerSelectorProps {
  partners: Partner[];
  search: string;
  setSearch: (val: string) => void;
  selectedPartner: string;
  setSelectedPartner: (val: string) => void;
}

const PartnerSelector: React.FC<PartnerSelectorProps> = ({ partners, search, setSearch, selectedPartner, setSelectedPartner }) => {
  const filteredPartners = partners.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Assign Partner (Optional)</label>
      <input
        type="text"
        placeholder="Search partner..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
      />
      <select
        value={selectedPartner}
        onChange={(e) => setSelectedPartner(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
      >
        <option value="">-- Select Partner --</option>
        {filteredPartners.map(p => <option key={p._id} value={p._id}>{p.name} ({p.email})</option>)}
      </select>
      {filteredPartners.length === 0 && search && <p className="mt-1 text-sm text-gray-500">No partners found</p>}
    </div>
  );
};

export default PartnerSelector;
