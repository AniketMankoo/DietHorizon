const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.json({ message: "Admin module is working!" });
});

module.exports = router; // ✅ Correct Export
