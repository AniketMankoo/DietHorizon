const WorkoutPlan = require('../models/workoutPlanModel');
const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');
const errorMessages = require('../utils/errorMessages');
const asyncHandler = require('../middlewares/asyncHandler');

/**
 * @desc    Create a new workout plan
 * @route   POST /api/workout-plans
 * @access  Private/Trainer
 */
exports.createWorkoutPlan = asyncHandler(async (req, res, next) => {
    const { title, description, userId, duration, exercises } = req.body;

    // Validate required fields
    if (!title || !userId || !exercises) {
        return next(new ErrorResponse(errorMessages.REQUIRED_FIELDS, 400));
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorResponse(errorMessages.USER_NOT_FOUND, 404));
    }

    // Create the workout plan
    const workoutPlan = await WorkoutPlan.create({
        title,
        description,
        user: userId,
        trainer: req.user.id,
        duration: duration || 7, // Default 7 days
        exercises,
        status: 'Active'
    });

    res.status(201).json({
        success: true,
        message: "Workout plan created successfully",
        data: workoutPlan
    });
});

/**
 * @desc    Get all workout plans created by trainer
 * @route   GET /api/workout-plans/trainer
 * @access  Private/Trainer
 */
exports.getTrainerWorkoutPlans = asyncHandler(async (req, res, next) => {
    const workoutPlans = await WorkoutPlan.find({ trainer: req.user.id })
        .populate('user', 'name email')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: workoutPlans.length,
        data: workoutPlans
    });
});

/**
 * @desc    Get workout plans assigned to current user
 * @route   GET /api/workout-plans
 * @access  Private
 */
exports.getUserWorkoutPlans = asyncHandler(async (req, res, next) => {
    const workoutPlans = await WorkoutPlan.find({ user: req.user.id })
        .populate('trainer', 'name email')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: workoutPlans.length,
        data: workoutPlans
    });
});

/**
 * @desc    Get single workout plan by ID
 * @route   GET /api/workout-plans/:id
 * @access  Private
 */
exports.getWorkoutPlan = asyncHandler(async (req, res, next) => {
    const workoutPlan = await WorkoutPlan.findById(req.params.id)
        .populate('trainer', 'name email')
        .populate('user', 'name email');

    if (!workoutPlan) {
        return next(new ErrorResponse(errorMessages.WORKOUT_PLAN_NOT_FOUND, 404));
    }

    // Check if user has access to this workout plan
    if (
        workoutPlan.user.toString() !== req.user.id &&
        workoutPlan.trainer.toString() !== req.user.id &&
        req.user.role !== 'admin'
    ) {
        return next(new ErrorResponse(errorMessages.UNAUTHORIZED_WORKOUT_PLAN, 403));
    }

    res.status(200).json({
        success: true,
        data: workoutPlan
    });
});

/**
 * @desc    Update workout plan
 * @route   PUT /api/workout-plans/:id
 * @access  Private/Trainer
 */
exports.updateWorkoutPlan = asyncHandler(async (req, res, next) => {
    let workoutPlan = await WorkoutPlan.findById(req.params.id);

    if (!workoutPlan) {
        return next(new ErrorResponse(errorMessages.WORKOUT_PLAN_NOT_FOUND, 404));
    }

    // Check ownership
    if (workoutPlan.trainer.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(errorMessages.UNAUTHORIZED_WORKOUT_PLAN, 403));
    }

    // Update the workout plan
    workoutPlan = await WorkoutPlan.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        message: "Workout plan updated successfully",
        data: workoutPlan
    });
});

/**
 * @desc    Delete workout plan
 * @route   DELETE /api/workout-plans/:id
 * @access  Private/Trainer
 */
exports.deleteWorkoutPlan = asyncHandler(async (req, res, next) => {
    const workoutPlan = await WorkoutPlan.findById(req.params.id);

    if (!workoutPlan) {
        return next(new ErrorResponse(errorMessages.WORKOUT_PLAN_NOT_FOUND, 404));
    }

    // Check ownership
    if (workoutPlan.trainer.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(errorMessages.UNAUTHORIZED_WORKOUT_PLAN, 403));
    }

    await workoutPlan.deleteOne();

    res.status(200).json({
        success: true,
        message: "Workout plan deleted successfully",
        data: {}
    });
});