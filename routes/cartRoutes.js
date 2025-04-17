const express = require("express");
const { addToCart, getCart, removeFromCart } = require("../controllers/cartController");
const { protectMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/add", protectMiddleware, addToCart);
router.get("/", protectMiddleware, getCart);
router.delete("/:id", protectMiddleware, removeFromCart);

module.exports = router;
