import axios from "axios";
import Store from "../models/Store.js";

/**
 * Create & validate store
 */
export const createStore = async (req, res) => {
  try {
    const { platform, name, storeUrl, credentials } = req.body;

    if (!platform || !name || !storeUrl || !credentials) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 🔐 Validate Shopify store using REAL API
    if (platform === "shopify") {
      try {
        await axios.get(
          `${storeUrl}/admin/api/${credentials.apiVersion || "2024-01"}/shop.json`,
          {
            headers: {
              "X-Shopify-Access-Token": credentials.accessToken,
            },
          }
        );
      } catch (err) {
        return res.status(400).json({
          message: "Shopify connection failed",
        });
      }
    }

    // (Woo validation will be added later)

    const store = await Store.create({
      name,
      platform,
      storeUrl,
      credentials,
      status: "CONNECTED",
      createdBy: req.user.id,
    });

    res.status(201).json(store);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Store already exists",
      });
    }

    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

/**
 * Get all stores for logged-in user
 */
export const getStores = async (req, res) => {
  try {
    const stores = await Store.find({ createdBy: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(stores);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

export const syncStoreOrders = async (req, res) => {
  try {
    const store = await Store.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    let orders = [];

    // 🟢 Shopify
    if (store.platform === "shopify") {
      const response = await fetch(
        `${store.storeUrl}/admin/api/${store.credentials.apiVersion}/orders.json?limit=10`,
        {
          headers: {
            "X-Shopify-Access-Token": store.credentials.accessToken,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Shopify orders");
      }

      const data = await response.json();
      orders = data.orders.map((o) => ({
        id: o.id,
        orderNumber: o.name,
        platform: "Shopify",
        customer: o.customer?.first_name || "Guest",
        total: o.total_price,
        status: o.financial_status,
        createdAt: o.created_at,
        store: store.name,
      }));
    }

    // 🟠 WooCommerce (later)
    if (store.platform === "woocommerce") {
      // Placeholder for now
    }

    // Update last sync time
    store.lastSyncAt = new Date();
    await store.save();

    res.json({
      storeId: store._id,
      storeName: store.name,
      totalOrders: orders.length,
      orders,
    });
  } catch (err) {
    res.status(500).json({
      message: "Order sync failed",
      error: err.message,
    });
  }
};
