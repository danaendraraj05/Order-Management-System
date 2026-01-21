import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      alert("Account created! Please login.");
      navigate("/login");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#020617] to-black px-4">
      
      {/* Glass Card */}
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl p-8">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-white">
            Create Account
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Get started with your Order Management System
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Choose a username"
              className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a secure password"
              className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-white py-2.5 font-medium text-black hover:bg-gray-200 transition"
          >
            Create Account
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-white hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
