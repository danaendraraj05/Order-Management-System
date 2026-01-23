# 📦 Order Management System (OMS)

A unified **Order Management System** that connects **Shopify** and **WooCommerce** stores and displays orders in a single dashboard.

This project fetches orders **directly via REST APIs** (no webhooks required) and supports syncing multiple stores per user.

---

## 🚀 Features

* ✅ Connect multiple Shopify & WooCommerce stores
* ✅ Secure backend-only credential handling
* ✅ Live order sync from both platforms
* ✅ Combined (concatenated) order list
* ✅ Revenue calculation
* ✅ Cloudways-compatible (REST API supported)

---

## 🧱 Tech Stack

### Backend

* Node.js
* Express
* MongoDB
* Axios / Fetch
* JWT Authentication

### Frontend

* React (Vite)
* Tailwind CSS
* Context API (Auth)
* REST API integration

### Hosting

* WooCommerce: **Cloudways**
* Shopify: Shopify Cloud
* Backend: Any Node-compatible host

---

## 🛒 Shopify Store Setup

### 1️⃣ Create a Custom App

1. Go to **Shopify Admin**
2. Navigate to:

   ```
   Settings → Apps and sales channels
   ```
3. Click **Develop apps**
4. Click **Create an app**
5. Name it (e.g. `OMS App`)

---

### 2️⃣ Configure API Permissions

Inside the app → **Configuration**:

Enable:

* `read_orders`
* `read_customers` (optional)
* `read_products` (optional)

Save changes.

---

### 3️⃣ Install App & Get Access Token

1. Go to **API credentials**
2. Click **Install app**
3. Copy the **Admin API Access Token**

Token format:

```
shpat_************
```

---

### 4️⃣ Add Shopify Store in OMS

| Field        | Value                              |
| ------------ | ---------------------------------- |
| Platform     | Shopify                            |
| Store Name   | Any name                           |
| Store URL    | `https://your-store.myshopify.com` |
| Access Token | Admin API Access Token             |
| API Version  | `2024-01`                          |

---

## 🛍️ WooCommerce Store Setup (Cloudways)

### 1️⃣ Ensure WooCommerce is Installed

* WordPress Admin → Plugins
* WooCommerce must be **installed & activated**

---

### 2️⃣ Generate REST API Keys

1. Go to:

   ```
   WooCommerce → Settings → Advanced → REST API
   ```
2. Click **Add Key**
3. Fill:

   * Description: `OMS App`
   * User: Admin user
   * Permissions: **Read / Write**
4. Click **Generate API key**

Copy:

* **Consumer Key** → `ck_********`
* **Consumer Secret** → `cs_********`

⚠️ Keys are shown only once.

---

### 3️⃣ Verify Permalinks (Mandatory)

Go to:

```
Settings → Permalinks
```

Select:

```
Post name
```

Click **Save Changes** (even if already selected).

---

### 4️⃣ Add WooCommerce Store in OMS

| Field           | Value                    |
| --------------- | ------------------------ |
| Platform        | WooCommerce              |
| Store Name      | Any name                 |
| Store URL       | `https://yourdomain.com` |
| Consumer Key    | `ck_********`            |
| Consumer Secret | `cs_********`            |

---

## 🔄 Order Sync Behavior

* Orders are fetched **live** from the store APIs
* No order data is permanently stored
* Syncing one store **does not overwrite** orders from other stores
* Orders are merged using:

  ```
  storeId + orderId
  ```

---

## 💱 Currency Handling

### WooCommerce

```
WooCommerce → Settings → General → Currency
```

Change currency as required (USD, EUR, etc).

### OMS Display

OMS displays the total exactly as received from the platform.

---

## 🔐 Security Notes

* ❌ API credentials are **never sent to frontend**
* ✅ Credentials are stored securely in backend
* ✅ `/stores` API excludes credentials
* ✅ JWT protected routes

---

## 🧪 Testing

### Shopify

* Create a test order
* Click **Sync Orders**
* Verify order appears in OMS

### WooCommerce

* Create an order
* Click **Sync Orders**
* Verify order appears in OMS

---

## 📁 Environment Variables

### Backend

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

### Frontend

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 📌 Future Enhancements

* Webhook-based real-time sync
* Order caching
* Pagination & filters
* Currency normalization
* Sync-all stores button

---


## 👨‍💻 Author

Built for learning and experimentation with real-world OMS concepts.

---
