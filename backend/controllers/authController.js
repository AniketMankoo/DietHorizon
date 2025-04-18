// controllers/authController.js
const crypto = require('crypto');
const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');
const errorMessages = require('../utils/errorMessages');
const asyncHandler = require('../middlewares/asyncHandler');
const jwt = require('jsonwebtoken');

/**
 * @desc    Register a user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password) {
        return next(new ErrorResponse(errorMessages.REQUIRED_FIELDS, 400));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new ErrorResponse(errorMessages.EMAIL_EXISTS, 400));
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role: role || 'user'
    });

    sendTokenResponse(user, 201, res, "User registered successfully");
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return next(new ErrorResponse(errorMessages.REQUIRED_FIELDS, 400));
    }

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new ErrorResponse(errorMessages.INVALID_CREDENTIALS, 401));
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return next(new ErrorResponse(errorMessages.INVALID_CREDENTIALS, 401));
    }

    sendTokenResponse(user, 200, res, "Login successful");
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
});

/**
 * @desc    Logout user / clear cookie
 * @route   GET /api/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "User logged out successfully"
    });
});

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new ErrorResponse(errorMessages.REQUIRED_FIELDS, 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
        return next(new ErrorResponse(errorMessages.USER_NOT_FOUND, 404));
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    
    await user.save({ validateBeforeSave: false });
    
    // In a production app, you would send an email with the reset token
    // For development, just return the token
    
    res.status(200).json({
        success: true,
        message: "Password reset email sent",
        resetToken // In production, remove this line
    });
});

/**
 * @desc    Reset password
 * @route   PUT /api/auth/reset-password/:resetToken
 * @access  Public
 */
const resetPassword = asyncHandler(async (req, res, next) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resetToken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorResponse(errorMessages.INVALID_TOKEN, 400));
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res, "Password reset successful");
});

/**
 * @desc    Update user details
 * @route   PUT /api/auth/update-details
 * @access  Private
 */
const updateDetails = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    };

    // Only include fields that are actually provided
    Object.keys(fieldsToUpdate).forEach(key => 
        fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    if (Object.keys(fieldsToUpdate).length === 0) {
        return next(new ErrorResponse(errorMessages.REQUIRED_FIELDS, 400));
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        message: "User details updated successfully",
        data: user
    });
});

/**
 * @desc    Update password
 * @route   PUT /api/auth/update-password
 * @access  Private
 */
const updatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.comparePassword(req.body.currentPassword))) {
        return next(new ErrorResponse(errorMessages.INVALID_CREDENTIALS, 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res, "Password updated successfully");
});

/**
 * Get token from model, create cookie and send response
 */
const sendTokenResponse = (user, statusCode, res, message) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

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
    register,
    login,
    getMe,
    logout,
    forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword
};
