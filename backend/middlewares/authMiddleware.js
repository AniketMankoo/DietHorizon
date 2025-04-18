const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("./asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const errorMessages = require("../utils/errorMessages");

/**
 * Middleware to protect routes that require authentication
 * Verifies JWT token and attaches user to request object
 */
const protectMiddleware = asyncHandler(async (req, res, next) => {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        // Extract token from Bearer token string
        token = req.headers.authorization.split(" ")[1];
    } 
    // Alternative: Check for token in cookies (if using cookie-based auth)
    else if (req.cookies?.token) {
        token = req.cookies.token;
    }

    // If no token found, return unauthorized error
    if (!token) {
        return next(new ErrorResponse(errorMessages.UNAUTHORIZED, 401));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database
        const user = await User.findById(decoded.userId).select("-password");

        // Check if user still exists
        if (!user) {
            return next(new ErrorResponse(errorMessages.USER_NOT_FOUND, 401));
        }
        
        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        // Handle specific token errors
        if (error.name === "TokenExpiredError") {
            return next(new ErrorResponse(errorMessages.TOKEN_EXPIRED, 401));
        }
        if (error.name === "JsonWebTokenError") {
            return next(new ErrorResponse(errorMessages.INVALID_TOKEN, 401));
        }
        
        // Generic auth error
        return next(new ErrorResponse(errorMessages.UNAUTHORIZED, 401));
    }
});

/**
 * Middleware to authorize based on user roles
 * @param {...String} roles - Allowed roles for the route
 * @returns {Function} - Express middleware function
 */
const authorizeRoles = (...roles) => {
    const allowedRoles = new Set(roles);

    return (req, res, next) => {
        // Check if user exists and has role property
        if (!req.user || !req.user.role) {
            return next(new ErrorResponse(errorMessages.ACCESS_DENIED, 403));
        }
        
        // Check if user's role is allowed
        if (!allowedRoles.has(req.user.role)) {
            return next(new ErrorResponse(errorMessages.FORBIDDEN, 403));
        }
        
        next();
    };
};

module.exports = { protectMiddleware, authorizeRoles };
