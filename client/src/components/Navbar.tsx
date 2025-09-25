"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getRole, logout } from "@/lib/auth"; // Your authentication functions
import { Boxes, Menu, X, LogOut } from "lucide-react"; // Icons

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
    // Admin Links
    { title: "Dashboard", href: "/admin", roles: ["admin"] },
    { title: "Orders", href: "/admin/orders", roles: ["admin"] },
    // Partner Links
    { title: "My Deliveries", href: "/partner", roles: ["partner"] },
  ];

  const renderLinks = (isMobile = false) => {
    return navLinks
      .filter(link => link.roles.includes(role))
      .map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.title}
            href={link.href}
            onClick={() => setIsMenuOpen(false)}
            className={`
              ${isMobile ? "text-lg" : "text-sm"}
              ${isActive ? "text-white bg-white/10" : "text-gray-300"}
              font-medium rounded-md px-3 py-2 transition-all duration-200 hover:text-white hover:bg-white/10
            `}
          >
            {link.title}
          </Link>
        );
      });
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2 text-white font-bold text-xl">
              <Boxes className="h-7 w-7 text-blue-400" />
              Rentkar
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {renderLinks()}
              {role ? (
                <button
                  onClick={handleLogout}
                  className="bg-red-500/80 text-white px-4 py-2 text-sm font-semibold rounded-md hover:bg-red-600 transition-colors duration-200 flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="bg-blue-500/80 text-white px-4 py-2 text-sm font-semibold rounded-md hover:bg-blue-600 transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-green-500/80 text-white px-4 py-2 text-sm font-semibold rounded-md hover:bg-green-600 transition-colors duration-200"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <aside
        className={`
          fixed top-0 right-0 h-full w-64 bg-gray-900/90 backdrop-blur-xl z-40 transition-transform duration-300 ease-in-out
          ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
          md:hidden
        `}
      >
        <div className="flex flex-col p-5 pt-20 space-y-4">
          {renderLinks(true)}
          {role ? (
            <button
              onClick={handleLogout}
              className="mt-4 bg-red-500/80 w-full text-white px-4 py-3 text-md font-semibold rounded-md hover:bg-red-600 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="mt-4 bg-blue-500/80 w-full text-white px-4 py-3 text-md font-semibold rounded-md hover:bg-blue-600 transition-colors duration-200 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-green-500/80 w-full text-white px-4 py-3 text-md font-semibold rounded-md hover:bg-green-600 transition-colors duration-200 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </aside>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        ></div>
      )}
    </>
  );
}
