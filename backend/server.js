// Server dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const dotenv = require('dotenv');
const errorHandler = require('./middlewares/errorMiddleware');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser());

// Load routes
const loadRoutes = () => {
  // Import routes
  const authRoutes = require('./routes/authRoutes');
  const userRoutes = require('./routes/userRoutes');
  const productRoutes = require('./routes/productRoutes');
  const orderRoutes = require('./routes/orderRoutes');
  const adminRoutes = require('./routes/adminRoutes');
  const cartRoutes = require('./routes/cartRoutes');
  const categoryRoutes = require('./routes/categoryRoutes');

  // Setup routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/categories', categoryRoutes);
};

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to DietHorizon API - Server is running!");
});

// Load routes
loadRoutes();

// Error handling middleware
app.use(errorHandler);

// Database Connection
const connectDB = async () => {
  try {
    if (process.env.MONGO_CONNECT !== 'true') {
      console.log("Database connection skipped. Using mock data.");
      return false;
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB Database");
    return true;
  } catch (error) {
    console.error("Database Connection Failed:", error.message);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;
let server;

connectDB().then(() => {
  app.listen(PORT, () => {
    server = http.createServer(app);
    console.log(`Server running on port ${PORT}`);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// For testing purposes
module.exports = app;