// controllers/userController.js
const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');
const errorMessages = require('../utils/errorMessages');
const asyncHandler = require('../middlewares/asyncHandler');

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find().select('-password');

    res.status(200).json({
        success: true,
        count: users.length,
        data: users
    });
});

/**
 * @desc    Get single user
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
const getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
        return next(new ErrorResponse(errorMessages.USER_NOT_FOUND, 404));
    }

    res.status(200).json({
        success: true,
        data: user
    });
});

/**
 * @desc    Create user
 * @route   POST /api/users
 * @access  Private/Admin
 */
const createUser = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    // Check if all required fields are provided
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

    res.status(201).json({
        success: true,
        message: "User created successfully",
        data: user
    });
});

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
const updateUser = asyncHandler(async (req, res, next) => {
    const { name, email, role } = req.body;

    // Create object with only provided fields
    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (email) fieldsToUpdate.email = email;
    if (role) fieldsToUpdate.role = role;

    if (Object.keys(fieldsToUpdate).length === 0) {
        return next(new ErrorResponse(errorMessages.REQUIRED_FIELDS, 400));
    }

    // Check if user exists
    let user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorResponse(errorMessages.USER_NOT_FOUND, 404));
    }

    // Check if email already exists (if updating email)
    if (email && email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new ErrorResponse(errorMessages.EMAIL_EXISTS, 400));
        }
    }

    // Update user
    user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    }).select('-password');

    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: user
    });
});

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = asyncHandler(async (req, res, next) => {
    let user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponse(errorMessages.USER_NOT_FOUND, 404));
    }

    // Prevent deleting self
    if (user._id.toString() === req.user.id) {
        return next(new ErrorResponse("Cannot delete your own account", 400));
    }

    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: {}
    });
});

/**
 * @desc    Update user role
 * @route   PUT /api/users/:id/role
 * @access  Private/Admin
 */
const updateUserRole = asyncHandler(async (req, res, next) => {
    const { role } = req.body;

    if (!role) {
        return next(new ErrorResponse(errorMessages.REQUIRED_FIELDS, 400));
    }

    // Check if valid role
    if (!['user', 'admin'].includes(role.toLowerCase())) {
        return next(new ErrorResponse(errorMessages.INVALID_ROLE, 400));
    }

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponse(errorMessages.USER_NOT_FOUND, 404));
    }

    user.role = role.toLowerCase();
    await user.save();

    res.status(200).json({
        success: true,
        message: "User role updated successfully",
        data: user
    });
});

/**
 * @desc    Change password
 * @route   PUT /api/users/:id/password
 * @access  Private/Admin
 */
const changePassword = asyncHandler(async (req, res, next) => {
    const { newPassword } = req.body;

    if (!newPassword) {
        return next(new ErrorResponse(errorMessages.REQUIRED_FIELDS, 400));
    }

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponse(errorMessages.USER_NOT_FOUND, 404));
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Password changed successfully"
    });
});

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    updateUserRole,
    changePassword
};
