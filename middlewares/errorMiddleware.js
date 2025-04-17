const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors).map((val) => val.message).join(", ");
    }

    if (err.code === 11000) {
        statusCode = 400;
        message = `Duplicate field value entered: ${JSON.stringify(err.keyValue)}`;
    }

    if (err.name === "CastError") {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    res.status(statusCode).json({
        success: false,
        message,
    });
};

module.exports = errorHandler;