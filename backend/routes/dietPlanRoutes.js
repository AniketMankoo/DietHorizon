const express = require('express');
const router = express.Router();
const {
    createDietPlan,
    getTrainerDietPlans,
    getUserDietPlans,
    getDietPlan,
    updateDietPlan,
    deleteDietPlan
} = require('../controllers/dietPlanController');
const { protectMiddleware, authorizeRoles } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { validateDietPlan } = require('../validations/dietPlanValidation');

// All routes are protected
router.use(protectMiddleware);

// User routes
router.get('/', getUserDietPlans);
router.get('/:id', getDietPlan);

// Trainer routes
router.get('/trainer', authorizeRoles('trainer', 'admin'), getTrainerDietPlans);
router.post('/', authorizeRoles('trainer', 'admin'), validateDietPlan, validate, createDietPlan);
router.put('/:id', authorizeRoles('trainer', 'admin'), validateDietPlan, validate, updateDietPlan);
router.delete('/:id', authorizeRoles('trainer', 'admin'), deleteDietPlan);

module.exports = router;
