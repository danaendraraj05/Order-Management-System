import express from "express";
import {
  createStore,
  getStores,
  syncStoreOrders,
} from "../controllers/storeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create store (Shopify/Woo)
router.post("/", protect, createStore);

// Get all stores for logged-in user
router.get("/", protect, getStores);

router.post("/:id/sync", protect, syncStoreOrders);

export default router;
