// 📂 app/register/page.jsx

"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { setAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Loader2 } from "lucide-react";
import { AxiosError } from "axios";
// import {Briefcase,Shield} from "lucide-react";
export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
//   const [role, setRole] = useState("partner"); // 'partner' or 'admin'
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    setError("");
    setIsLoading(true);
    try {
      const res = await api.post("/api/auth/register", {
        name,
        email,
        password,
        role: "partner",
      });

      // Save token + role
      setAuth(res.data.token, res.data.role,res.data.userid);

      // Redirect after register
      if (res.data.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/partner");
      }
    } catch (err) {

    // Narrow err to AxiosError
    let message = "Login failed. Please try again.";
    if (err instanceof AxiosError) {
      message = err.response?.data?.message || err.message;
    } else if (err instanceof Error) {
      message = err.message;
    }

    setError(message || "Registration failed. Please try again.");

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-gray-900 via-blue-950 to-slate-900 text-white overflow-hidden">
      
      {/* Registration Card with Glassmorphism Effect */}
      <div className="relative z-10 flex flex-col items-center p-6 space-y-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl w-full max-w-sm md:max-w-md md:p-8">
        
        {/* Title */}
        <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-400">
          Create Account
        </h1>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 text-red-300 p-3 rounded-md w-full text-sm text-center">
            {error}
          </div>
        )}

        {/* Form Fields */}
        <div className="w-full space-y-4">
          {/* Name Input */}
          <div className="relative w-full">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              className="w-full pl-10 pr-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Email Input */}
          <div className="relative w-full">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
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
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="password"
              className="w-full pl-10 pr-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Custom Role Selector */}
          {/* <div className="w-full grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setRole("partner")}
              disabled={isLoading}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                role === "partner"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-800/60 hover:bg-gray-700/80"
              }`}
            >
              <Briefcase size={16} /> Partner
            </button>
            <button
              onClick={() => setRole("admin")}
              disabled={isLoading}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                role === "admin"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-800/60 hover:bg-gray-700/80"
              }`}
            >
              <Shield size={16} /> Admin
            </button>
          </div> */}
        </div>

        {/* Register Button */}
        <button
          className="flex items-center justify-center w-full px-6 py-3 mt-2 font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="animate-spin mr-2" size={20} />
          ) : null}
          {isLoading ? "Creating Account..." : "Register"}
        </button>

        {/* Login Link */}
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>

    </main>
  );
}