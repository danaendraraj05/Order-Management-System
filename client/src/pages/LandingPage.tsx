import { Link } from "react-router-dom";

export const LandingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#020617] to-black px-4">
      
      {/* Glass Container */}
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl p-8 md:p-12 text-center">
        
        {/* Badge */}
        <span className="inline-block mb-4 rounded-full bg-white/10 px-4 py-1 text-sm text-gray-300">
          Unified Commerce Platform
        </span>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
          Order Management System
        </h1>

        {/* Subtitle */}
        <p className="text-gray-300 max-w-xl mx-auto mb-8">
          Unified order management across <span className="text-white">Shopify</span> and{" "}
          <span className="text-white">WooCommerce</span>.  
          Sync, track, and manage all your orders from a single dashboard.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="px-6 py-3 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition"
          >
            Get Started
          </Link>

          <Link
            to="/register"
            className="px-6 py-3 rounded-lg border border-white/20 text-white hover:bg-white/10 transition"
          >
            Create Account
          </Link>
        </div>

        {/* Footer Note */}
        <p className="mt-8 text-xs text-gray-400">
          Secure · Multi-store · Real-time Sync
        </p>
      </div>
    </div>
  );
};
