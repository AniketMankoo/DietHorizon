const express = require('express');
const router = express.Router();
const {
    createWorkoutPlan,
    getTrainerWorkoutPlans,
    getUserWorkoutPlans,
    getWorkoutPlan,
    updateWorkoutPlan,
    deleteWorkoutPlan
} = require('../controllers/workoutPlanController');
const { protectMiddleware, authorizeRoles } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { validateWorkoutPlan } = require('../validations/workoutPlanValidation');

// All routes are protected
router.use(protectMiddleware);

// IMPORTANT: Place more specific routes before generic ones
// Trainer routes - THESE MUST COME BEFORE THE /:id ROUTE
router.get('/trainer', authorizeRoles('trainer', 'admin'), getTrainerWorkoutPlans);
router.post('/', authorizeRoles('trainer', 'admin'), validateWorkoutPlan, validate, createWorkoutPlan);

// User routes
router.get('/', getUserWorkoutPlans);
// THIS ROUTE SHOULD COME AFTER MORE SPECIFIC ROUTES
router.get('/:id', getWorkoutPlan);

// Other routes
router.put('/:id', authorizeRoles('trainer', 'admin'), validateWorkoutPlan, validate, updateWorkoutPlan);
router.delete('/:id', authorizeRoles('trainer', 'admin'), deleteWorkoutPlan);

module.exports = router;
