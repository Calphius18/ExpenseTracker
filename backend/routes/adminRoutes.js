const express = require("express");
const { getAllUsers, updateUserRole, requestAdminAccess } = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { requireRole, requireAdmin } = require("../middleware/roleMiddleware");

const router = express.Router();

// Admin only — list all users
router.get("/users", protect, requireAdmin, getAllUsers);

// Admin only — promote/demote roles
router.put("/role/:userId", protect, requireAdmin, updateUserRole);

// Viewer/User — request admin promotion
router.post("/request", protect, requireRole("viewer", "user"), requestAdminAccess);

module.exports = router;
