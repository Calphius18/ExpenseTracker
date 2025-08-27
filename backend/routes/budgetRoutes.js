const express = require("express");
const {
    addBudget, 
    getAllBudget,
    deleteBudget,
    downloadBudgetExcel
} = require("../controllers/budgetController");

const {protect} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, addBudget);
router.get("/get", protect, getAllBudget);
router.delete("/:id", protect, deleteBudget);
router.get("/downloadExcel", protect, downloadBudgetExcel);

module.exports = router;
