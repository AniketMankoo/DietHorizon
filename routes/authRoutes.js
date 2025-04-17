const express = require("express");
const { 
    register, 
    login, 
    getMe, 
    forgotPassword, 
    resetPassword, 
    logout,
    updateDetails,
    updatePassword 
} = require("../controllers/authController");
const { validateUserRegistration, validateUserLogin } = require("../validations/userValidation");
const validateRequest = require("../middlewares/validateMiddleware");
const { protectMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", validateUserRegistration, validateRequest, register);
router.post("/login", validateUserLogin, validateRequest, login);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassword);

// Protected routes
router.get("/me", protectMiddleware, getMe);
router.get("/logout", protectMiddleware, logout);
router.put("/update-details", protectMiddleware, updateDetails);
router.put("/update-password", protectMiddleware, updatePassword);

module.exports = router;
