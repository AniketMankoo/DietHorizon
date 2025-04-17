// In utils/errorResponse.js
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        
        // Capture stack trace (maintains proper stack trace in errors)
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ErrorResponse;
