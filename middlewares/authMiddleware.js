const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const errorMessages = require("../utils/errorMessages");

const protectMiddleware = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } else {
        return next(new ErrorResponse(errorMessages.UNAUTHORIZED, 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select("-password");

        if (!req.user) {
            return next(new ErrorResponse(errorMessages.INVALID_TOKEN, 401));
        }

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return next(new ErrorResponse(errorMessages.TOKEN_EXPIRED, 401));
        }
        return next(new ErrorResponse(errorMessages.UNAUTHORIZED, 401));
    }
});

const authorizeRoles = (...roles) => {
    const allowedRoles = new Set(roles);

    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return next(new ErrorResponse(errorMessages.ACCESS_DENIED, 403));
        }
        if (!allowedRoles.has(req.user.role)) {
            return next(new ErrorResponse(errorMessages.FORBIDDEN, 403));
        }
        next();
    };
};

module.exports = { protectMiddleware, authorizeRoles };