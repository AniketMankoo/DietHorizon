require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS
app.use(morgan("dev")); // Log requests

// Sample Route (To Check API)
app.get("/", (req, res) => {
    res.json({ message: "DietHorizon API is running..." });
});

const aiRoutes = require("./modules/ai/ai.routes");
app.use("/api/ai", aiRoutes);


// Import Routes
const adminRoutes = require("./modules/admin/admin.routes");
const authRoutes = require("./modules/auth/auth.routes");
const chatRoutes = require("./modules/chat/chat.routes");
const ecommerceRoutes = require("./modules/ecommerce/ecommerce.routes");
const notificationsRoutes = require("./modules/notifications/notifications.routes");
const usersRoutes = require("./modules/users/users.routes");

// Use Routes
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/store", ecommerceRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/users", usersRoutes);

// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));