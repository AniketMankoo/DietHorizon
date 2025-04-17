const jwt = require("jsonwebtoken");

/**
 * Generate a JWT token for a user
 * @param {Object} payload - The data to encode in the token (usually contains userId)
 * @param {string} [expiresIn] - Optional override for token expiration
 * @returns {string} The signed JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(
    payload, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

/**
 * Verify and decode a JWT token
 * @param {string} token - The token to verify
 * @returns {Object} The decoded token payload
 * @throws {Error} If token is invalid or expired
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw error; // Will be caught by errorMiddleware
  }
};

/**
 * Generate a token response with cookie
 * @param {Object} user - User object to generate token for
 * @param {number} statusCode - HTTP status code to return
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 */
const sendTokenResponse = (user, statusCode, res, message) => {
  // Create token payload with user ID
  const payload = { userId: user._id };
  
  // Generate token
  const token = generateToken(payload);

  // Cookie options
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  // Secure cookie in production
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      message,
      token
    });
};

module.exports = {
  generateToken,
  verifyToken,
  sendTokenResponse
};
