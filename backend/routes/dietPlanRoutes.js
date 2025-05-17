const express = require('express');
const router = express.Router();
const {
    getDietPlan,
    getUserDietPlans,
    getTrainerDietPlans,
    createDietPlan,
    updateDietPlan,
    deleteDietPlan
} = require('../controllers/dietPlanController');
const { protectMiddleware, authorizeRoles } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { validateDietPlan } = require('../validations/dietPlanValidation');
const ErrorResponse = require('../utils/errorResponse');
const errorMessages = require('../utils/errorMessages');
const asyncHandler = require('../middlewares/asyncHandler');

// Import your controllers and middlewares...

// All routes are protected
router.use(protectMiddleware);

// IMPORTANT: Place more specific routes before generic ones
// Trainer routes - THESE MUST COME BEFORE THE /:id ROUTE
router.get('/trainer', authorizeRoles('trainer', 'admin'), getTrainerDietPlans);
router.post('/', authorizeRoles('trainer', 'admin'), validateDietPlan, validate, createDietPlan);

// User routes
router.get('/', getUserDietPlans);
// THIS ROUTE SHOULD COME AFTER MORE SPECIFIC ROUTES
router.get('/:id', getDietPlan);

// Other routes...
router.put('/:id', authorizeRoles('trainer', 'admin'), validateDietPlan, validate, updateDietPlan);
router.delete('/:id', authorizeRoles('trainer', 'admin'), deleteDietPlan);

module.exports = router;
