const { validationResult } = require("express-validator");
const ErrorResponse = require("../utils/errorResponse");

/**
 * Middleware to validate requests using express-validator
 * Checks for validation errors and returns appropriate response
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Get the first error message
    const errorMsg = errors.array()[0].msg;
    
    // Return a standardized error response
    return next(new ErrorResponse(errorMsg, 400));
  }
  
  next();
};

module.exports = validateRequest;
