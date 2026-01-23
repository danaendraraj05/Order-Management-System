import axios from "axios";
import Store from "../models/Store.js";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const WooCommerce = WooCommerceRestApi.default;


/* =====================================================
   CREATE STORE (VALIDATION ONLY)
===================================================== */
export const createStore = async (req, res) => {
  try {
    const { platform, name, storeUrl, credentials } = req.body;

    if (!platform || !name || !storeUrl || !credentials) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let status = "CONNECTED";
    let connectionError = null;

    /* ---------------- Shopify Validation (STRICT) ---------------- */
    if (platform === "shopify") {
      try {
        await axios.get(
          `${storeUrl}/admin/api/${credentials.apiVersion || "2024-01"}/shop.json`,
          {
            headers: {
              "X-Shopify-Access-Token": credentials.accessToken,
            },
            timeout: 10000,
          }
        );
      } catch (err) {
        return res.status(400).json({
          message: "Shopify connection failed",
        });
      }
    }

    /* ---------------- WooCommerce Validation (NON-BLOCKING) ---------------- */
    if (platform === "woocommerce") {
      try {
        const response = await axios.get(
          `${storeUrl}/wp-json/wc/v3/system_status`,
          {
            auth: {
              username: credentials.consumerKey,
              password: credentials.consumerSecret,
            },
            timeout: 10000,
          }
        );

        if (!response.data || !response.data.environment) {
          throw new Error("Invalid WooCommerce response");
        }
      } catch (err) {
        status = "FAILED";
        connectionError =
          "WooCommerce API blocked by hosting provider or firewall";
      }
    }

    /* ---------------- Create Store ALWAYS ---------------- */
    const store = await Store.create({
      name,
      platform,
      storeUrl,
      credentials,
      status,
      connectionError,
      createdBy: req.user?.id || null,
    });

    res.status(201).json({
      message:
        status === "FAILED"
          ? "Store created, but connection failed"
          : "Store created successfully",
      store,
    });
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

/* =====================================================
   GET STORES (NO CREDENTIALS)
===================================================== */
export const getStores = async (req, res) => {
  try {
    const stores = await Store.find({ createdBy: req.user.id })
      .select("-credentials")
      .sort({ createdAt: -1 });

    res.json(stores);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

/* =====================================================
   SYNC STORE ORDERS
===================================================== */
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

    /* ---------------- Shopify Orders ---------------- */
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
        storeId: store._id,
      }));
    }

    if (store.platform === "woocommerce") {
      const woo = new WooCommerce({
        url: store.storeUrl,
        consumerKey: store.credentials.consumerKey,
        consumerSecret: store.credentials.consumerSecret,
        version: "wc/v3",
        timeout: 15000,
      });


      const response = await woo.get("orders", {
        per_page: 10,
        order: "desc",
      });


      if (!Array.isArray(response.data)) {
        throw new Error("Invalid WooCommerce orders response");
      }

      orders = response.data.map((o) => ({
        id: o.id,
        orderNumber: `#${o.number}`,
        platform: "WooCommerce",
        customer: o.billing?.first_name
          ? `${o.billing.first_name} ${o.billing.last_name}`
          : "Guest",
        total: o.total,
        status: o.status,
        createdAt: o.date_created,
        store: store.name,
        storeId: store._id,
      }));
    }


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

/* =====================================================
   TEST STORE CONNECTION
===================================================== */
export const testStoreConnection = async (req, res) => {
  try {
    const store = await Store.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    /* ---------------- Shopify ---------------- */
    if (store.platform === "shopify") {
      try {
        await axios.get(
          `${store.storeUrl}/admin/api/${store.credentials.apiVersion}/shop.json`,
          {
            headers: {
              "X-Shopify-Access-Token": store.credentials.accessToken,
            },
            timeout: 10000,
          }
        );

        return res.json({
          status: "CONNECTED",
          message: "Shopify connection successful",
        });
      } catch {
        return res.status(400).json({
          status: "FAILED",
          message: "Shopify connection failed",
        });
      }
    }

    /* ---------------- WooCommerce ---------------- */
    if (store.platform === "woocommerce") {
      try {
        await axios.get(
          `${store.storeUrl}/wp-json/wc/v3/system_status`,
          {
            params: {
              consumer_key: store.credentials.consumerKey,
              consumer_secret: store.credentials.consumerSecret,
            },
            timeout: 10000,
          }
        );

        return res.json({
          status: "CONNECTED",
          message: "WooCommerce connection successful",
        });
      } catch {
        return res.status(400).json({
          status: "FAILED",
          message: "WooCommerce connection failed",
        });
      }
    }

    res.status(400).json({ message: "Unsupported platform" });
  } catch (err) {
    res.status(500).json({
      message: "Connection test failed",
      error: err.message,
    });
  }
};

