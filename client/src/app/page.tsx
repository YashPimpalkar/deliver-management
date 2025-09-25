// 📂 app/page.tsx

import { Shield, User } from "lucide-react"; // Using lucide-react for icons
export default function Home() {
  return (
    <>
      <main className="flex flex-col items-center justify-center w-full min-h-screen px-4 bg-gradient-to-br from-gray-900 via-blue-950 to-slate-900 text-white overflow-hidden">
        
        {/* Main Content Card - Now with responsive padding and max-width */}
        <div className="relative z-10 flex flex-col items-center p-6 space-y-4 text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl w-full max-w-sm md:max-w-lg md:p-8 md:space-y-6">
          
          {/* Responsive Heading */}
          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-400 md:text-5xl">
            🚀 Rentkar Delivery
          </h1>
          
          {/* Responsive Paragraph */}
          <p className="text-md text-slate-300 md:text-lg">
            Welcome back! Please select your role to continue.
          </p>

          {/* Responsive Buttons: Stack on mobile, side-by-side on larger screens */}
          <div className="flex flex-col sm:flex-row gap-4 w-full pt-4">
            
            {/* Admin Login Button */}
            <button className="flex items-center justify-center w-full px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105">
              <Shield className="w-5 h-5 mr-2" />
              Login as Admin
            </button>
            
            {/* Partner Login Button */}
            <button className="flex items-center justify-center w-full px-6 py-3 font-semibold text-slate-900 bg-slate-100 rounded-lg shadow-lg hover:bg-white transition-all duration-300 ease-in-out transform hover:scale-105">
              <User className="w-5 h-5 mr-2" />
              Login as Partner
            </button>

          </div>
        </div>

        {/* Decorative background blobs - Hidden on small screens to reduce clutter */}
        <div className="hidden md:block absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="hidden md:block absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-400 rounded-full opacity-10 blur-3xl animate-pulse animation-delay-4000"></div>

      </main>
    </>
  );
}