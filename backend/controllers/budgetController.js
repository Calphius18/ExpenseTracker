const xlsx = require("xlsx");
const Budget = require("../models/Budget");

// Add Budget Source
exports.addBudget = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icons, source, category, amount, date} = req.body|| {};

        if (!source || !amount || !category || !date) {
        return res.status(400).json({ message: "Please provide all required fields." });
    }
        const newBudget = new Budget({
            userId,
            icons,
            source,
            category,
            amount,
            date: new Date(date)
        });
        await newBudget.save();
        res.status(200).json(newBudget);
    } catch (error) {
        res.status(500).json({ message: "Error adding budget source", error: error.message });
    }
}

// Get All Add Budget Sources
exports.getAllBudget = async (req, res) => {
    const userId = req.user.id;

    try {
        const budgets = await Budget.find({ userId }).sort({ date: -1 });
        res.status(200).json(budgets);
    } catch (error) {
        res.status(500).json({ message: "Error fetching budget sources", error: error.message });
    }
    
}

// Delete Budget Source
exports.deleteBudget = async (req, res) => {
    try {
        await Budget.findByIdAndDelete(req.params.id);
        res.json({ message: "Budget source deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting budget source", error: error.message });
    }
}

// Download Excel
exports.downloadBudgetExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const budget = await Budget.find({userId}).sort({ date: -1})

        const data = budget.map((item) => ({
                Source: item.source,
                Category: item.category,
                Amount: item.amount,
                Date: item.date
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);

        xlsx.utils.book_append_sheet(wb, ws, "Budget");
        xlsx.writeFile(wb, "budget_details.xlsx");
        res.download("budget_details.xlsx");
    } catch (error) {
        res.status(500).json({message: "Server Error"});
    }
};