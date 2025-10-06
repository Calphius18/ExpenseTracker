const express = require("express");
const {
  addExpense, 
  getAllExpense,
  deleteExpense,
  downloadExpenseExcel,
  uploadExpenseExcel,
  getExpensesReport,         
  downloadExpensesReport     
} = require("../controllers/expenseController");

const { protect } = require("../middleware/authMiddleware");
const { requireRole, requireAdmin } = require("../middleware/roleMiddleware");

const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

// Everyone (viewer, user, admin) can view expenses
router.get("/get", protect, requireRole("viewer", "user", "admin"), getAllExpense);

// Only user/admin can add expense
router.post("/add", protect, requireRole("user", "admin"), addExpense);

// Only user/admin can upload Excel
router.post("/uploadExcel", protect, requireRole("user", "admin"), upload.single("file"), uploadExpenseExcel);

// Only user/admin can download Excel
router.get("/downloadExcel", protect, requireRole("user", "admin"), downloadExpenseExcel);

// Reports — view only (viewer/user/admin)
router.get("/report", protect, requireRole("viewer", "user", "admin"), getExpensesReport);

// Report download — user/admin only
router.get("/downloadReport", protect, requireRole("user", "admin"), downloadExpensesReport);

// Delete — admin only
router.delete("/:id", protect, requireAdmin, deleteExpense);

module.exports = router;