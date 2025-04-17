const User = require("../models/userModel");
const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
        return next(new ErrorResponse("User not found", 404));
    }
    res.status(200).json({ success: true, data: user });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateUserProfile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        return next(new ErrorResponse("User not found", 404));
    }

    const { name, email, phone, address } = req.body;

    if (email && email !== user.email) {
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return next(new ErrorResponse("Email already in use", 400));
        }
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
        },
    });
});

/**
 * @desc    Change user password
 * @route   PUT /api/users/change-password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select("+password");
    if (!user || !(await user.comparePassword(oldPassword))) {
        return next(new ErrorResponse("Invalid current password", 401));
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password updated successfully",
    });
});

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, data: users });
});

/**
 * @desc    Assign role to a user (Admin only)
 * @route   PUT /api/users/:id/assign-role
 * @access  Private/Admin
 */
const assignRole = asyncHandler(async (req, res, next) => {
    const { role } = req.body;

    if (!role || !["user", "admin"].includes(role)) {
        return next(new ErrorResponse("Invalid role", 400));
    }

    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorResponse("User not found", 404));
    }

    user.role = role;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Role assigned successfully",
        data: {
            id: user._id,
            name: user.name,
            role: user.role,
        },
    });
});

/**
 * @desc    Update user role (Admin only)
 * @route   PUT /api/users/:id/update-role
 * @access  Private/Admin
 */
const updateUserRole = asyncHandler(async (req, res, next) => {
    const { role } = req.body;

    if (!role || !["user", "admin"].includes(role)) {
        return next(new ErrorResponse("Invalid role", 400));
    }

    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorResponse("User not found", 404));
    }

    user.role = role;
    await user.save();

    res.status(200).json({
        success: true,
        message: "User role updated successfully",
        data: {
            id: user._id,
            role: user.role,
        },
    });
});

module.exports = {
    getUserProfile,
    updateUserProfile,
    changePassword,
    getAllUsers,
    assignRole,
    updateUserRole
};
        