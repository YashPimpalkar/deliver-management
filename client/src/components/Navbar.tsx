"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getRole, logout } from "@/lib/auth";
import {
  Menu,
  X,
  LogOut,
  LogIn,
  UserPlus,
  Truck,
} from "lucide-react";

export default function Navbar() {
  const [role, setRole] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setRole(getRole());
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { title: "Home", href: "/", roles: ["admin", "partner", null] },
    { title: "Features", href: "#features", roles: ["admin", "partner", null] },
    { title: "Pricing", href: "#pricing", roles: ["admin", "partner", null] },
    { title: "Contact", href: "#contact", roles: ["admin", "partner", null] },
    { title: "Dashboard", href: "/admin", roles: ["admin"] },
    { title: "Orders", href: "/admin/orders", roles: ["admin"] },
    { title: "My Deliveries", href: "/partner", roles: ["partner"] },
  ];

  const renderLinks = (isMobile = false) =>
    navLinks
      .filter((link) => link.roles.includes(role))
      .map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.title}
            href={link.href}
            onClick={() => setIsMenuOpen(false)}
            className={`${
              isMobile
                ? "text-lg text-slate-800"
                : "text-slate-700 hover:text-blue-600"
            } ${
              isActive ? "text-blue-600 font-semibold" : "font-medium"
            } transition-colors`}
          >
            {link.title}
          </Link>
        );
      });

  return (
    <>
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Truck className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-slate-900">SwiftFlow</span>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex space-x-8">{renderLinks()}</nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {role ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-md transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              ) : (
                <>
                  <Link href="/login">
                    <button className="flex items-center text-slate-700 hover:text-blue-600 font-medium px-4 py-2 rounded-md transition-colors duration-200">
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </button>
                  </Link>
                  <Link href="/register">
                    <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-colors duration-200">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Get Started
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-slate-700 hover:bg-slate-100 transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex flex-col p-6 space-y-4 pt-20">
          {renderLinks(true)}
          {role ? (
            <button
              onClick={handleLogout}
              className="mt-4 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-3 rounded-md transition-colors duration-200"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <button className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 rounded-md transition-colors duration-200">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </button>
              </Link>
              <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                <button className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-3 rounded-md transition-colors duration-200">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Get Started
                </button>
              </Link>
            </>
          )}
        </div>
      </aside>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
        ></div>
      )}
    </>
  );
}
