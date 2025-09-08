const express = require("express");
const {
    addExpense, 
    getAllExpense,
    deleteExpense,
    downloadExpenseExcel,
    uploadExpenseExcel
} = require("../controllers/expenseController");

const {protect} = require("../middleware/authMiddleware");

const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.post("/add", protect, addExpense);
router.get("/get", protect, getAllExpense);
router.delete("/:id", protect, deleteExpense);
router.get("/downloadExcel", protect, downloadExpenseExcel);
router.post("/uploadExcel", protect, upload.single("file"), uploadExpenseExcel);

module.exports = router;
