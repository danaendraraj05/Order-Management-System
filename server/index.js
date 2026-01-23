import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import storeRoutes from './routes/storeRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🔥 IMPORTANT: connect DB BEFORE routes
await connectDB();

// Routes
app.use('/auth', authRoutes);
app.use('/stores', storeRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('🚀 MERN Auth Starter Backend Running');
});

// Start server ONLY for local / VPS
const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
}

export default app;