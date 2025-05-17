const DietPlan = require('../models/dietPlanModel');
const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');
const errorMessages = require('../utils/errorMessages');
const asyncHandler = require('../middlewares/asyncHandler');

/**
 * @desc    Create a new diet plan
 * @route   POST /api/diet-plans
 * @access  Private/Trainer
 */
exports.createDietPlan = asyncHandler(async (req, res, next) => {
    const { title, description, userId, duration, meals } = req.body;

    // Validate required fields
    if (!title || !userId || !meals) {
        return next(new ErrorResponse(errorMessages.REQUIRED_FIELDS, 400));
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorResponse(errorMessages.USER_NOT_FOUND, 404));
    }

    // Create the diet plan
    const dietPlan = await DietPlan.create({
        title,
        description,
        user: userId,
        trainer: req.user.id,
        duration: duration || 7, // Default 7 days
        meals,
        status: 'Active'
    });

    res.status(201).json({
        success: true,
        message: "Diet plan created successfully",
        data: dietPlan
    });
});

/**
 * @desc    Get all diet plans created by trainer
 * @route   GET /api/diet-plans/trainer
 * @access  Private/Trainer
 */
exports.getTrainerDietPlans = asyncHandler(async (req, res, next) => {
    const dietPlans = await DietPlan.find({ trainer: req.user.id })
        .populate('user', 'name email')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: dietPlans.length,
        data: dietPlans
    });
});

/**
 * @desc    Get diet plans assigned to current user
 * @route   GET /api/diet-plans
 * @access  Private
 */
exports.getUserDietPlans = asyncHandler(async (req, res, next) => {
    const dietPlans = await DietPlan.find({ user: req.user.id })
        .populate('trainer', 'name email')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: dietPlans.length,
        data: dietPlans
    });
});

/**
 * @desc    Get single diet plan by ID
 * @route   GET /api/diet-plans/:id
 * @access  Private
 */
exports.getDietPlan = asyncHandler(async (req, res, next) => {
    const dietPlan = await DietPlan.findById(req.params.id)
        .populate('trainer', 'name email')
        .populate('user', 'name email');

    if (!dietPlan) {
        return next(new ErrorResponse(errorMessages.DIET_PLAN_NOT_FOUND, 404));
    }

    // Check if user has access to this diet plan
    if (
        dietPlan.user.toString() !== req.user.id &&
        dietPlan.trainer.toString() !== req.user.id &&
        req.user.role !== 'admin'
    ) {
        return next(new ErrorResponse(errorMessages.UNAUTHORIZED_DIET_PLAN, 403));
    }

    res.status(200).json({
        success: true,
        data: dietPlan
    });
});

/**
 * @desc    Update diet plan
 * @route   PUT /api/diet-plans/:id
 * @access  Private/Trainer
 */
exports.updateDietPlan = asyncHandler(async (req, res, next) => {
    let dietPlan = await DietPlan.findById(req.params.id);

    if (!dietPlan) {
        return next(new ErrorResponse(errorMessages.DIET_PLAN_NOT_FOUND, 404));
    }

    // Check ownership
    if (dietPlan.trainer.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(errorMessages.UNAUTHORIZED_DIET_PLAN, 403));
    }

    // Update the diet plan
    dietPlan = await DietPlan.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        message: "Diet plan updated successfully",
        data: dietPlan
    });
});

/**
 * @desc    Delete diet plan
 * @route   DELETE /api/diet-plans/:id
 * @access  Private/Trainer
 */
exports.deleteDietPlan = asyncHandler(async (req, res, next) => {
    const dietPlan = await DietPlan.findById(req.params.id);

    if (!dietPlan) {
        return next(new ErrorResponse(errorMessages.DIET_PLAN_NOT_FOUND, 404));
    }

    // Check ownership
    if (dietPlan.trainer.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(errorMessages.UNAUTHORIZED_DIET_PLAN, 403));
    }

    await dietPlan.deleteOne();

    res.status(200).json({
        success: true,
        message: "Diet plan deleted successfully",
        data: {}
    });
});
