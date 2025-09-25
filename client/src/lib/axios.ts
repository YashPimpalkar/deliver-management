// 📂 src/lib/axios.ts (TypeScript, no `any` used)

import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// Create instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // ⏱️ prevent hanging requests
});

// ✅ Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Example: attach token if exists
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    let message = "Something went wrong. Please try again.";

    if (error.response) {
      // Server responded with error status
      message =
        (error.response.data as { message?: string })?.message ||
        `Error: ${error.response.status}`;
    } else if (error.request) {
      // No response received
      message = "Network error. Please check your connection.";
    } else {
      // Something else triggered the error
      message = error.message;
    }

    // Optional: Log globally
    console.error("API Error:", message);

    // Reject with structured error
    return Promise.reject(new Error(message));
  }
);

export default api;
