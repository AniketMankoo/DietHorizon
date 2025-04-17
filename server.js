require("dotenv").config();
require("express-async-errors");
const express = require("express");
const mongoose = require("mongoose");
const errorHandler = require("./middlewares/errorMiddleware");

const app = express();

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    process.exit(1);
});

app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.get("/", (req, res) => {
    res.send("Welcome to Artzy");
});

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/categories", categoryRoutes);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to Database");
    } catch (error) {
        console.error("Database Connection Failed:", error);
        process.exit(1);
    }
};

app.use(errorHandler);

const PORT = process.env.PORT || 3300;
let server;

connectDB().then(() => {
    server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection:", reason);
    if (server) {
        server.close(() => process.exit(1));
    } else {
        process.exit(1);
    }
});

process.on("SIGTERM", () => {
    console.log("Server shutting down...");
    if (server) {
        server.close(() => {
            console.log("Server closed.");
            mongoose.connection.close(() => {
                console.log("MongoDB connection closed.");
                process.exit(0);
            });
        });
    }
});
