import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { AddStoreModal } from "../components/AddStoreModal";


export const HomePage = () => {
  const { token } = useAuth();
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/auth/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setUsername(data.username);
      } catch {
        navigate("/login");
      }
    };

    fetchUser();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black px-6 py-24">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-2xl font-semibold text-white">
          Welcome back, {username}
        </h1>
        <p className="text-gray-400 text-sm">
          Unified order management across WooCommerce and Shopify
        </p>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-xl p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <Stat label="Total Stores" value="2" />
          <Stat label="Active Orders" value="2" />
          <Stat label="Revenue Today" value="$911" />
          <Stat label="Sync Status" value="Live" highlight />
        </div>
      </div>

      {/* Connected Stores */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-medium text-white">
              Connected Stores
            </h2>
            <p className="text-sm text-gray-400">
              Manage your store connections and credentials
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10 transition"
          >
            + Add Store
          </button>

        </div>
        <AddStoreModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StoreCard
            name="Main Store"
            platform="WooCommerce"
            url="shop.example.com"
            lastSync="2 hours ago"
          />
          <StoreCard
            name="EU Store"
            platform="Shopify"
            url="eu-shop.myshopify.com"
            lastSync="5 hours ago"
          />
        </div>
      </div>

      {/* Recent Orders */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-medium text-white">
              Recent Orders
            </h2>
            <p className="text-sm text-gray-400">
              Unified view of orders from all platforms
            </p>
          </div>
          <span className="text-sm text-gray-400">Total: 4</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-xl overflow-hidden">
          <table className="w-full text-sm text-gray-300">
            <thead className="border-b border-white/10 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">Platform</th>
                <th className="px-4 py-3 text-left">Store</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              <OrderRow id="#WC-1847" platform="WooCommerce" store="Main Store" customer="Sarah Chen" amount="$142.50" status="processing" date="2 hours ago" />
              <OrderRow id="#SH-8392" platform="Shopify" store="EU Store" customer="Marcus Webb" amount="$89.00" status="completed" date="3 hours ago" />
              <OrderRow id="#WC-1846" platform="WooCommerce" store="Main Store" customer="Elena Rodriguez" amount="$256.00" status="pending" date="4 hours ago" />
              <OrderRow id="#SH-8391" platform="Shopify" store="EU Store" customer="James Liu" amount="$423.75" status="completed" date="5 hours ago" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ---------- Components ---------- */

const Stat = ({ label, value, highlight }: any) => (
  <div>
    <p className="text-sm text-gray-400">{label}</p>
    <p className={`text-2xl font-semibold ${highlight ? "text-green-400" : "text-white"}`}>
      {value}
    </p>
  </div>
);

const StoreCard = ({ name, platform, url, lastSync }: any) => (
  <div className="rounded-xl border border-white/10 bg-white/10 backdrop-blur-xl p-5 shadow-lg">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-white font-medium">
          {name}{" "}
          <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
            platform === "Shopify"
              ? "bg-green-500/20 text-green-400"
              : "bg-orange-500/20 text-orange-400"
          }`}>
            {platform}
          </span>
        </h3>
        <p className="text-xs text-gray-400">{url}</p>
      </div>
      <button className="text-gray-400 hover:text-white">⟳</button>
    </div>

    <div className="mt-4 flex items-center justify-between">
      <span className="text-xs text-green-400">● Connected</span>
      <button className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/20 transition">
        Sync Orders
      </button>
    </div>

    <p className="mt-2 text-xs text-gray-400">
      Last sync: {lastSync}
    </p>
  </div>
);

const OrderRow = ({ id, platform, store, customer, amount, status, date }: any) => (
  <tr className="border-b border-white/5 last:border-0">
    <td className="px-4 py-3">{id}</td>
    <td className="px-4 py-3">{platform}</td>
    <td className="px-4 py-3">{store}</td>
    <td className="px-4 py-3">{customer}</td>
    <td className="px-4 py-3 font-medium text-white">{amount}</td>
    <td className="px-4 py-3">
      <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
        {status}
      </span>
    </td>
    <td className="px-4 py-3 text-xs text-gray-400">{date}</td>
  </tr>
);
