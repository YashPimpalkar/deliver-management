// 📂 app/login/page.jsx

"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios"; // Your API instance
import { setAuth } from "@/lib/auth"; // Your auth utility
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, Loader2 } from "lucide-react"; // Icons from lucide-react
import Link from "next/link";
import { AxiosError } from "axios";
import { getRole } from "@/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();







 useEffect(() => {
    const checkAuth = () => {
   
      const  role  = getRole();
      const token = localStorage.getItem("token");
      
      if (token) {
        // Redirect based on role if token exists
        if (role === "admin") {
          router.push("/admin");
        } else if (role === "partner") {
          router.push("/partner");
        } else {
        // Fallback for unexpected roles
        }
      } else {

      }
    };

    checkAuth();
  }, [router]);


  const handleLogin = async () => {
    setError(""); // Clear previous errors
    setIsLoading(true); // Set loading state
    try {
      const res = await api.post("/api/auth/login", {
        email,
        password,
      });
      setAuth(res.data.token, res.data.role,res.data.userid); // Save token, role and userid to localStorage
      if (res.data.role === "admin") {
        router.push("/admin");
      } else if (res.data.role === "partner") {
        router.push("/partner");
      } else {
        router.push("/"); // Fallback for unexpected roles
      }
    } catch (err) {
     console.error("Login error:", err);

    // Narrow err to AxiosError
    let message = "Login failed. Please try again.";
    if (err instanceof AxiosError) {
      message = err.response?.data?.message || err.message;
    } else if (err instanceof Error) {
      message = err.message;
    }

    setError(message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-gray-900 via-blue-950 to-slate-900 text-white overflow-hidden">
      {/* Login Card with Glassmorphism Effect */}
      <div className="relative z-10 flex flex-col items-center p-6 space-y-6 text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl w-full max-w-sm md:max-w-md md:p-8">
        {/* Title */}
        <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-400 md:text-5xl">
          Welcome Back!
        </h1>
        <p className="text-lg text-slate-300">
          Sign in to your Rentkar account
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 text-red-300 p-3 rounded-md w-full text-sm">
            {error}
          </div>
        )}

        {/* Email Input */}
        <div className="relative w-full">
          <Mail
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="email"
            className="w-full pl-10 pr-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Password Input */}
        <div className="relative w-full">
          <Lock
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="password"
            className="w-full pl-10 pr-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Login Button */}
        <button
          className="flex items-center justify-center w-full px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="animate-spin mr-2" size={20} />
          ) : (
            <LogIn className="w-5 h-5 mr-2" />
          )}
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {/* Optional: Forgot Password / Register */}
        <div className="text-sm text-gray-400">
          <Link
            href="/forgot-password"
            className="hover:underline text-blue-400"
          >
            Forgot Password?
          </Link>
        </div>
      </div>

      {/* Decorative background blobs */}
      <div className="hidden md:block absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
      <div className="hidden md:block absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-400 rounded-full opacity-10 blur-3xl animate-pulse animation-delay-4000"></div>
    </main>
  );
}
