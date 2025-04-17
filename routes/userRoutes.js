const express = require("express");
const {
    getUserProfile,
    updateUserProfile,
    changePassword,
    getAllUsers,
    assignRole,
    updateUserRole
} = require("../controllers/userController");

const { protectMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateMiddleware");
const {
    validateUserProfileUpdate,
    validateChangePassword,
    validateAssignRole
} = require("../validations/userValidation");

const router = express.Router();

router.get("/profile", protectMiddleware, getUserProfile);

router.put("/profile", protectMiddleware, validateUserProfileUpdate, validateRequest, updateUserProfile);

router.put("/change-password", protectMiddleware, validateChangePassword, validateRequest, changePassword);

router.get("/", protectMiddleware, authorizeRoles("admin"), getAllUsers);

router.put("/:id/assign-role", protectMiddleware, authorizeRoles("admin"), validateAssignRole, validateRequest, assignRole);

router.put("/:id/update-role", protectMiddleware, authorizeRoles("admin"), validateAssignRole, validateRequest, updateUserRole);

module.exports = router;
