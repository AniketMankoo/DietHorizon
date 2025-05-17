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

// Add a middleware to check if the user is a trainer or admin
const isTrainerOrAdmin = (req, res, next) => {
    if (req.user.role !== 'trainer' && req.user.role !== 'admin') {
        return next(new ErrorResponse(errorMessages.FORBIDDEN, 403));
    }
    next();
};
  
/**
 * Middleware to authorize based on user roles
 * @param {...String} roles - Allowed roles for the route
 * @returns {Function} - Express middleware function
 */
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // Convert both the user role and the required roles to lowercase for case-insensitive comparison
        if (!req.user || !roles.map(role => role.toLowerCase()).includes(req.user.role.toLowerCase())) {
            return next(
                new ErrorResponse(errorMessages.FORBIDDEN, 403)
            );
        }
        next();
    };
};
/**
 * Middleware to check if the user is a trainer
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const isTrainer = (req, res, next) => {
    if (req.user.role !== "trainer") {
        return next(new ErrorResponse(errorMessages.FORBIDDEN, 403));
    }
    next();
}
/**
 * Middleware to check if the user is a client
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const isClient = (req, res, next) => {
    if (req.user.role !== "client") {
        return next(new ErrorResponse(errorMessages.FORBIDDEN, 403));
    }
    next();
}
/**
 * Middleware to check if the user is an admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return next(new ErrorResponse(errorMessages.FORBIDDEN, 403));
    }
    next();
}

module.exports = { protectMiddleware, authorizeRoles };
