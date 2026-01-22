import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    platform: {
      type: String,
      required: true,
      enum: ["shopify", "woocommerce"],
    },

    storeUrl: {
      type: String,
      required: true,
      trim: true,
    },

    credentials: {
      // Shopify
      accessToken: {
        type: String,
        trim: true,
      },
      apiVersion: {
        type: String,
        default: "2024-01",
      },

      // WooCommerce
      consumerKey: {
        type: String,
        trim: true,
      },
      consumerSecret: {
        type: String,
        trim: true,
      },
    },

    status: {
      type: String,
      enum: ["CONNECTED", "FAILED"],
      default: "FAILED",
    },

    lastSyncAt: {
      type: Date,
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Prevent same store being added twice by same user
 */
storeSchema.index(
  { platform: 1, storeUrl: 1, createdBy: 1 },
  { unique: true }
);

const Store = mongoose.model("Store", storeSchema);
export default Store;
