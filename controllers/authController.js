const User = require("../models/userModel");
const jwtUtils = require("../utils/jwtUtils");
const ErrorMessage = require("../utils/errorMessage"); 
const asyncHandler = require("../middleware/asyncHandler");

const registerUser = asyncHandler(async (req, res, next) => {
    let { name, email, password, phone, countryCode, address, role } = req.body;

    if (!name || !email || !password || !phone || !address) {
        return next(new ErrorMessage("Please provide all required fields", 400));
    }

    email = email.toLowerCase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new ErrorMessage("Email already in use", 400));
    }

    if (role && role === "admin" && req.user?.role !== "admin") {
        return next(new ErrorMessage("Not authorized to assign admin role", 403));
    }

    const newUser = await User.create({ name, email, password, phone, countryCode, address, role });

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        token: jwtUtils.generateToken(newUser._id),
        user: {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            countryCode: newUser.countryCode,
            address: newUser.address,
            role: newUser.role,
        },
    });
});

const loginUser = asyncHandler(async (req, res, next) => {
    let { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorMessage("Please provide email and password", 400));
    }

    email = email.toLowerCase(); 

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
        return next(new ErrorMessage("Invalid email or password", 401));
    }

    res.status(200).json({
        success: true,
        message: "Login successful",
        token: jwtUtils.generateToken(user._id),
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            countryCode: user.countryCode,
            address: user.address,
            role: user.role,
        },
    });
});

module.exports = { registerUser, loginUser };
