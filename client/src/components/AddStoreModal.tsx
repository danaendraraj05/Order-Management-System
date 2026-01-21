import { useState } from "react";

export const AddStoreModal = ({ isOpen, onClose }: any) => {
  const [platform, setPlatform] = useState("shopify");
  const [storeName, setStoreName] = useState("");
  const [storeUrl, setStoreUrl] = useState("");
  const [accessToken, setAccessToken] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      platform,
      name: storeName,
      storeUrl,
      credentials: {
        accessToken,
        apiVersion: "2024-01",
      },
    };

    console.log("STORE PAYLOAD", payload);
    // 🔜 will call backend API here

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl p-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">
            Add Store
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
        {/* Platform */}
        <div>
        <label className="block text-sm text-gray-300 mb-1">
            Platform
        </label>

        <div className="relative">
            <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="
                w-full appearance-none
                rounded-lg border border-white/20
                bg-[#020617]/80
                px-3 py-2 pr-10
                text-white
                focus:outline-none focus:ring-2 focus:ring-white/30
            "
            >
            <option value="shopify" className="bg-[#020617] text-white">
                Shopify
            </option>
            <option value="woocommerce" className="bg-[#020617] text-white">
                WooCommerce
            </option>
            </select>

            {/* Custom Arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
            ▼
            </div>
        </div>
        </div>


          {/* Store Name */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Store Name
            </label>
            <input
              className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2 text-white"
              placeholder="EU Store"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              required
            />
          </div>

          {/* Store URL */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Store URL
            </label>
            <input
              className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2 text-white"
              placeholder="https://store.myshopify.com"
              value={storeUrl}
              onChange={(e) => setStoreUrl(e.target.value)}
              required
            />
          </div>

          {/* Token */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Access Token
            </label>
            <input
              className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2 text-white"
              placeholder="shpat_xxxxx"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-white py-2 font-medium text-black hover:bg-gray-200 transition"
          >
            Add Store
          </button>
        </form>
      </div>
    </div>
  );
};
