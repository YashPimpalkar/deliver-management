"use client";
import React from "react";

interface Partner {
  id: string;
  name: string;
  email: string;
  lastLocation?: {
    latitude: number;
    longitude: number;
  };
}

interface PartnerSelectorProps {
  partners: Partner[];
  search: string;
  setSearch: (val: string) => void;
  selectedPartner: string;
  setSelectedPartner: (val: string) => void;
}

const PartnerSelector: React.FC<PartnerSelectorProps> = ({
  partners,
  search,
  setSearch,
  selectedPartner,
  setSelectedPartner,
}) => {
  const filteredPartners = partners.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      (p.lastLocation &&
        `${p.lastLocation.latitude},${p.lastLocation.longitude}`.includes(search))
  );

  const handlePartnerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    console.log(selectedId)
    setSelectedPartner(selectedId);
    
    // Optional: Log the selected partner details
    if (selectedId) {
      const selectedPartnerObj = partners.find(p => p.id === selectedId);
      console.log("Selected Partner:", selectedPartnerObj);
    }
  };
console.log(partners)
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Assign Partner (Optional)
      </label>
      <input
        type="text"
        placeholder="Search partner..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
      />
      <select
        value={selectedPartner}
        onChange={handlePartnerChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
      >
        <option value="">-- Select Partner --</option>
        {filteredPartners.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} ({p.email})
            {p.lastLocation
              ? ` - [Lat: ${p.lastLocation.latitude.toFixed(4)}, Lon: ${p.lastLocation.longitude.toFixed(4)}]`
              : ""}
          </option>
        ))}
      </select>
      {filteredPartners.length === 0 && search && (
        <p className="mt-1 text-sm text-gray-500">No partners found</p>
      )}
      
      {/* Display selected partner info for debugging */}
      {/* {selectedPartner && (
        <div className="mt-2 p-2 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            Selected Partner ID: <strong>{selectedPartner}</strong>
          </p>
        </div>
      )} */}
    </div>
  );
};

export default PartnerSelector;