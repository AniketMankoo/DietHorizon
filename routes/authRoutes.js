const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const { validateUserRegistration, validateUserLogin } = require("../validations/userValidation");
const validateRequest = require("../middlewares/validateMiddleware");

const router = express.Router();

router.post("/register", validateUserRegistration, validateRequest, registerUser);

router.post("/login", validateUserLogin, validateRequest, loginUser);

module.exports = router;
