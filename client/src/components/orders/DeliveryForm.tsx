"use client";
import React from "react";

interface DeliveryFormProps {
  deliveryName: string;
  setDeliveryName: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  deliveryDate: string;
  setDeliveryDate: (val: string) => void;
  deliveryTime: string;
  setDeliveryTime: (val: string) => void;
}

const DeliveryForm: React.FC<DeliveryFormProps> = ({
  deliveryName, setDeliveryName,
  address, setAddress,
  deliveryDate, setDeliveryDate,
  deliveryTime, setDeliveryTime
}) => {

  const getCurrentDate = (): string => new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Name *</label>
        <input
          type="text"
          value={deliveryName}
          onChange={(e) => setDeliveryName(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          placeholder="Enter delivery name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          placeholder="Enter delivery address"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date *</label>
          <input
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            required
            min={getCurrentDate()}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time *</label>
          <input
            type="time"
            value={deliveryTime}
            onChange={(e) => setDeliveryTime(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default DeliveryForm;