import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { AddStoreModal } from "../components/AddStoreModal";

export const HomePage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [stores, setStores] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingStores, setLoadingStores] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [syncingStoreId, setSyncingStoreId] = useState<string | null>(null);

  /* ---------------- Fetch User & Stores ---------------- */

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
     const init = async () => {
        try {
          // Fetch user
          const userRes = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/auth/me`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const userData = await userRes.json();
          setUsername(userData.username);

          // Fetch stores
          const storeRes = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/stores`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const storeData = await storeRes.json();
          setStores(storeData);

          // ✅ AUTO SYNC FIRST CONNECTED STORE
          const connectedStore = storeData.find(
            (s: any) => s.status === "CONNECTED"
          );

          if (connectedStore) {
            await autoSyncOrders(connectedStore._id);
          }

        } catch (err) {
          navigate("/login");
        } finally {
          setLoadingStores(false);
        }
      };

    init();

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

    const fetchStores = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/stores`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setStores(data);
      } catch {
        console.error("Failed to fetch stores");
      } finally {
        setLoadingStores(false);
      }
    };

    const autoSyncOrders = async (storeId: string) => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/stores/${storeId}/sync`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        if (!res.ok) return;

        // populate orders on page load
        setOrders(data.orders);

      } catch (err) {
        console.error("Auto sync failed", err);
      }
    };


    fetchUser();
    fetchStores();
  }, [token]);

  /* ---------------- Sync Orders (Live) ---------------- */

  const syncOrders = async (storeId: string) => {
    try {
      setSyncingStoreId(storeId);

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/stores/${storeId}/sync`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // ✅ store orders in state (LIVE DATA)
      setOrders(data.orders);

      alert(`Synced ${data.totalOrders} orders from ${data.storeName}`);

      // Refresh stores to update lastSyncAt
      const storesRes = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/stores`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStores(await storesRes.json());
    } catch (err: any) {
      alert(err.message || "Sync failed");
    } finally {
      setSyncingStoreId(null);
    }
  };

  const calculateRevenueToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return orders
    .filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= today;
    })
    .reduce((sum, order) => {
      return sum + Number(order.total || 0);
    }, 0);
};


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
          <Stat label="Total Stores" value={stores.length} />
          <Stat label="Orders Synced" value={orders.length} />
          <Stat
            label="Revenue Today"
            value={`$${calculateRevenueToday().toFixed(2)}`}
          />
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
          {loadingStores ? (
            <p className="text-gray-400 text-sm">Loading stores...</p>
          ) : stores.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No stores connected yet. Add your first store.
            </p>
          ) : (
            stores.map((store) => (
              <StoreCard
                key={store._id}
                name={store.name}
                platform={store.platform}
                url={store.storeUrl.replace(/^https?:\/\//, "")}
                lastSync={
                  store.lastSyncAt
                    ? new Date(store.lastSyncAt).toLocaleString()
                    : "Never"
                }
                status={store.status}
                syncing={syncingStoreId === store._id}
                onSync={() => syncOrders(store._id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-lg font-medium text-white mb-3">
          Recent Orders
        </h2>

        <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-xl overflow-hidden">
          <table className="w-full text-sm text-gray-300">
            <thead className="border-b border-white/10 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Order</th>
                <th className="px-4 py-3 text-left">Platform</th>
                <th className="px-4 py-3 text-left">Store</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-gray-400"
                  >
                    No orders synced yet
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <OrderRow
                    key={order.id}
                    id={order.orderNumber}
                    platform="Shopify"
                    store={order.store}
                    customer={order.customer}
                    amount={`$${order.total}`}
                    status={order.status}
                    date={new Date(order.createdAt).toLocaleString()}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Components ---------------- */

const Stat = ({ label, value, highlight }: any) => (
  <div>
    <p className="text-sm text-gray-400">{label}</p>
    <p className={`text-2xl font-semibold ${highlight ? "text-green-400" : "text-white"}`}>
      {value}
    </p>
  </div>
);

const StoreCard = ({
  name,
  platform,
  url,
  lastSync,
  status,
  syncing,
  onSync,
}: any) => (
  <div className="rounded-xl border border-white/10 bg-white/10 backdrop-blur-xl p-5 shadow-lg">
    <h3 className="text-white font-medium">
      {name}
      <span
        className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
          platform === "shopify"
            ? "bg-green-500/20 text-green-400"
            : "bg-orange-500/20 text-orange-400"
        }`}
      >
        {platform}
      </span>
    </h3>

    <p className="text-xs text-gray-400">{url}</p>

    <div className="mt-4 flex items-center justify-between">
      <span className={`text-xs ${status === "CONNECTED" ? "text-green-400" : "text-red-400"}`}>
        ● {status}
      </span>

      <button
        onClick={onSync}
        disabled={syncing}
        className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/20 disabled:opacity-50"
      >
        {syncing ? "Syncing..." : "Sync Orders"}
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
