require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS
app.use(morgan("dev")); // Log requests

app.get("/", (req, res) => {
    res.json({ message: "DietHorizon API is running..." });
});

const dietRoutes = require("./modules/diet/diet.routes"); // 
const aiRoutes = require("./modules/ai/ai.routes");
const userRoutes = require("./modules/users/user.routes"); 

app.use("/api/diet", dietRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/users", userRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
