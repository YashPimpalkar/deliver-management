"use client";

import Link from "next/link";
import {
  LogIn,
  Truck,
  Clock,
  Shield,
  BarChart3,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";


// ✅ Feature Array defined at the top for easy maintenance
const FEATURES = [
  {
    icon: (
      <Truck className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
    ),
    title: "Route Optimization",
    color: "blue",
    desc: "AI-powered route planning to reduce delivery time and fuel costs by up to 30%",
  },
  {
    icon: (
      <Clock className="h-8 w-8 text-green-600 group-hover:text-white transition-colors duration-300" />
    ),
    title: "Real-time Tracking",
    color: "green",
    desc: "Live package tracking with automated customer notifications and delivery confirmations",
  },
  {
    icon: (
      <Shield className="h-8 w-8 text-purple-600 group-hover:text-white transition-colors duration-300" />
    ),
    title: "Secure Platform",
    color: "purple",
    desc: "Enterprise-grade security with encrypted data and compliance with industry standards",
  },
  {
    icon: (
      <BarChart3 className="h-8 w-8 text-orange-600 group-hover:text-white transition-colors duration-300" />
    ),
    title: "Analytics Dashboard",
    color: "orange",
    desc: "Comprehensive insights and reporting to optimize your delivery performance",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <main className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight">
                Streamline Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 block">
                  Delivery Operations
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                The most powerful delivery management platform to optimize
                routes, track packages, and delight customers with real-time
                updates.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link href="/register">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </Link>
              <Link href="/login">
                <button className="border-2 border-slate-300 hover:border-blue-600 hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center">
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In
                </button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 pt-12 text-slate-500">
              {["Free 14-day trial", "No credit card required", "24/7 support"].map(
                (text, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="font-medium">{text}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
                Everything you need to manage deliveries
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Powerful features designed to streamline your operations and
                improve customer satisfaction
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {FEATURES.map((feature, i) => (
                <div
                  key={i}
                  className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center space-y-4"
                >
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto bg-${feature.color}-100 group-hover:bg-${feature.color}-600 transition-colors duration-300`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Ready to transform your delivery operations?
            </h2>
            <p className="text-xl text-blue-100">
              Join thousands of businesses that trust SwiftFlow to manage their
              deliveries efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/register">
                <button className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-4 text-lg font-semibold rounded-lg transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* ✅ Separated Footer Component */}

      </main>
    </div>
  );
}
