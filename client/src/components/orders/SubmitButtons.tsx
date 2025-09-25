"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface SubmitButtonsProps {
  loading: boolean;
}

const SubmitButtons: React.FC<SubmitButtonsProps> = ({ loading }) => {
  const router = useRouter();

  return (
    <div className="flex gap-3 pt-2">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex-1 py-3 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={loading}
        className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Order"}
      </button>
    </div>
  );
};

export default SubmitButtons;
