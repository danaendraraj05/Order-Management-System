import { useState } from "react";

export const AddStoreModal = ({
  isOpen,
  onClose,
  onSuccess,
}: any) => {
  const [platform, setPlatform] = useState<"shopify" | "woocommerce">("shopify");
  const [storeName, setStoreName] = useState("");
  const [storeUrl, setStoreUrl] = useState("");

  // Shopify
  const [accessToken, setAccessToken] = useState("");

  // WooCommerce
  const [consumerKey, setConsumerKey] = useState("");
  const [consumerSecret, setConsumerSecret] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload =
      platform === "shopify"
        ? {
            platform,
            name: storeName,
            storeUrl,
            credentials: {
              accessToken,
              apiVersion: "2024-01",
            },
          }
        : {
            platform,
            name: storeName,
            storeUrl,
            credentials: {
              consumerKey,
              consumerSecret,
            },
          };

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/stores`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to add store");
      }

      // 🔥 IMPORTANT
      onSuccess(data); // notify parent
      onClose();
    } catch (err: any) {
      alert(err.message);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">Add Store</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Platform */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Platform
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as any)}
              className="w-full rounded-lg border border-white/20 bg-[#020617]/80 px-3 py-2 text-white"
            >
              <option value="shopify">Shopify</option>
              <option value="woocommerce">WooCommerce</option>
            </select>
          </div>

          {/* Store Name */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Store Name
            </label>
            <input
              className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2 text-white"
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
              placeholder={
                platform === "shopify"
                  ? "https://store.myshopify.com"
                  : "https://example.com"
              }
              value={storeUrl}
              onChange={(e) => setStoreUrl(e.target.value)}
              required
            />
          </div>

          {/* Shopify Token */}
          {platform === "shopify" && (
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
          )}

          {/* WooCommerce Keys */}
          {platform === "woocommerce" && (
            <>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Consumer Key
                </label>
                <input
                  className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2 text-white"
                  placeholder="ck_xxxxxxxxxx"
                  value={consumerKey}
                  onChange={(e) => setConsumerKey(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Consumer Secret
                </label>
                <input
                  className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2 text-white"
                  placeholder="cs_xxxxxxxxxx"
                  value={consumerSecret}
                  onChange={(e) => setConsumerSecret(e.target.value)}
                  required
                />
              </div>
            </>
          )}

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
