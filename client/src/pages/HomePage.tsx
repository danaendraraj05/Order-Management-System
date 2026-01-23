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
  const [syncMessage, setSyncMessage] = useState<string | null>(null);


  /* =====================================================
     INITIAL LOAD
  ===================================================== */
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const init = async () => {
      try {
        const userRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/auth/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const userData = await userRes.json();
        setUsername(userData.username);

        const storeRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/stores`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const storeData = await storeRes.json();
        setStores(storeData);
        for (const store of storeData) {
          if (store.status === "CONNECTED") {
            syncOrders(store._id);
          }
        }
      } catch {
        navigate("/login");
      } finally {
        setLoadingStores(false);
      }
    };

    init();
  }, [token]);


  const refreshStores = async () => {
    try {
      setLoadingStores(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/stores`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStores(await res.json());
    } finally {
      setLoadingStores(false);
    }
  };


  /* =====================================================
     SYNC ORDERS (CONCATENATED + SAFE)
  ===================================================== */
  const syncOrders = async (storeId: string) => {
    try {
      setSyncingStoreId(storeId);
      setSyncMessage(null);

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/stores/${storeId}/sync`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setOrders((prevOrders) => {
        const map = new Map<string, any>();

        for (const o of prevOrders) {
          map.set(`${o.storeId}-${o.id}`, o);
        }

        for (const o of data.orders) {
          map.set(`${o.storeId}-${o.id}`, o);
        }

        return Array.from(map.values()).sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );
      });

      setSyncMessage(
        `✔ Synced ${data.totalOrders} orders from ${data.storeName}`
      );

      setTimeout(() => setSyncMessage(null), 3000);

      const storesRes = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/stores`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStores(await storesRes.json());
    } catch (err: any) {
      setSyncMessage(err.message || "Sync failed");
    } finally {
      setSyncingStoreId(null);
    }
  };


  /* =====================================================
     REVENUE TODAY
  ===================================================== */
  const calculateRevenueToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return orders
      .filter((order) => new Date(order.createdAt) >= today)
      .reduce((sum, order) => sum + Number(order.total || 0), 0);
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
      {syncMessage && (
        <div className="max-w-7xl mx-auto mb-4">
          <div className="rounded-lg bg-green-500/20 px-4 py-2 text-sm text-green-400">
            {syncMessage}
          </div>
        </div>
      )}


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

      {/* Stores */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-medium text-white">Connected Stores</h2>
            <p className="text-sm text-gray-400">
              Manage your store connections
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            + Add Store
          </button>
        </div>

        <AddStoreModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={refreshStores}
        />


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loadingStores ? (
            <p className="text-gray-400 text-sm">Loading stores...</p>
          ) : stores.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No stores connected yet
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

      {/* Orders */}
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
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                    No orders synced yet
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <OrderRow
                    key={`${order.storeId}-${order.id}`}
                    id={order.orderNumber}
                    platform={order.platform}
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

/* =====================================================
   UI COMPONENTS
===================================================== */

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
  <div className="rounded-xl border border-white/10 bg-white/10 backdrop-blur-xl p-5">
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
