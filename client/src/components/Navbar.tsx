import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const Navbar = () => {
  const { user, logout, loading } = useAuth();

  // ⛔ Don't render navbar until auth is resolved
  if (loading) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mt-4 rounded-xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-lg">
          <div className="flex h-14 items-center justify-between px-4">

            {/* Brand */}
            <Link
              to="/"
              className="flex items-center gap-2 text-white font-semibold tracking-wide"
            >
              <span className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                📦
              </span>
              OMS
            </Link>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <span className="hidden sm:block text-sm text-gray-300">
                    Hi, <span className="text-white">{user.username}</span>
                  </span>

                  <button
                    onClick={logout}
                    className="rounded-lg bg-red-500/90 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10 transition"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-200 transition"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
};
