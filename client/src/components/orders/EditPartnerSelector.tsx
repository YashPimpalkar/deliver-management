"use client";
import React, { useEffect } from "react";

interface Partner {
  id: string;
  name: string;
  email: string;
  lastLocation?: {
    latitude: number;
    longitude: number;
  };
}

interface EditPartnerSelectorProps {
  partners: Partner[];
  search: string;
  setSearch: (val: string) => void;
  selectedPartner: string;
  setSelectedPartner: (val: string) => void;
  onPartnerChange?: (partnerId: string, partner: Partner | null) => void;
}

const EditPartnerSelector: React.FC<EditPartnerSelectorProps> = ({
  partners,
  search,
  setSearch,
  selectedPartner,
  setSelectedPartner,
  onPartnerChange
}) => {
  // Filter partners based on search
  const filteredPartners = partners.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      (p.lastLocation &&
        `${p.lastLocation.latitude},${p.lastLocation.longitude}`.includes(search))
  );

  // Handle partner selection change
  const handlePartnerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedPartner(selectedId);
    
    // Find the selected partner object
    const selectedPartnerObj = selectedId ? partners.find(p => p.id === selectedId) : null;
    
    // Call the callback if provided
    if (onPartnerChange) {
      onPartnerChange(selectedId, selectedPartnerObj || null);
    }
    
    console.log("Selected Partner ID:", selectedId);
    console.log("Selected Partner Object:", selectedPartnerObj);
  };

  // Clear search when component unmounts or when selection is made
  useEffect(() => {
    return () => {
      setSearch("");
    };
  }, [setSearch]);

  // Get the currently selected partner object
  const currentPartner = selectedPartner ? partners.find(p => p.id === selectedPartner) : null;
  console.log(partners)
  console.log(currentPartner)
console.log(selectedPartner)
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Assign Partner {!selectedPartner && "(Optional)"}
      </label>
      
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search partner by name, email, or location..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
      />
      
      {/* Partner Selection Dropdown */}
      <select
        value={selectedPartner}
        onChange={handlePartnerChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
      >
        <option value="">-- No Partner Assigned --</option>
        {filteredPartners.map((partner) => (
          <option key={partner.id} value={partner.id}>
            {partner.name} ({partner.email})
            {partner.lastLocation
              ? ` - Location: ${partner.lastLocation.latitude.toFixed(4)}, ${partner.lastLocation.longitude.toFixed(4)}`
              : " - No location data"}
          </option>
        ))}
      </select>

      {/* No results message */}
      {filteredPartners.length === 0 && search && (
        <p className="mt-1 text-sm text-gray-500">No partners found matching {search}</p>
      )}

      {/* Selected Partner Info */}
      {currentPartner && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Selected Partner:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Name:</span> {currentPartner.name}
            </div>
            <div>
              <span className="font-medium">Email:</span> {currentPartner.email}
            </div>
            <div>
              <span className="font-medium">ID:</span> {currentPartner.id}
            </div>
            {currentPartner.lastLocation ? (
              <div>
                <span className="font-medium">Last Location:</span>{" "}
                {currentPartner.lastLocation.latitude.toFixed(6)}, {currentPartner.lastLocation.longitude.toFixed(6)}
              </div>
            ) : (
              <div>
                <span className="font-medium">Location:</span> No location data
              </div>
            )}
          </div>
        </div>
      )}

      {/* Clear Selection Button */}
      {selectedPartner && (
        <button
          type="button"
          onClick={() => {
            setSelectedPartner("");
            setSearch("");
            if (onPartnerChange) {
              onPartnerChange("", null);
            }
          }}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline transition duration-200"
        >
          Remove Partner Assignment
        </button>
      )}

      {/* Available Partners Count */}
      <div className="mt-2 text-xs text-gray-500">
        Showing {filteredPartners.length} of {partners.length} partners
        {search && filteredPartners.length > 0 && ` matching "${search}"`}
      </div>
    </div>
  );
};

export default EditPartnerSelector;