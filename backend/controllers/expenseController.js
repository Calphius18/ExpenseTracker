const xlsx = require("xlsx");
const Expense = require("../models/Expense");

// Add Expense Source
exports.addExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icons, source, name, category, amount, date} = req.body|| {};

        if (!source || !amount ||  !category || !name || !date) {
        return res.status(400).json({ message: "Please provide all required fields." });
    }
        const newExpense = new Expense({
            userId,
            icons,
            source,
            category,
            amount,
            name,
            date: new Date(date)
        });
        await newExpense.save();
        res.status(200).json(newExpense);
    } catch (error) {
        res.status(500).json({ message: "Error adding Expense source", error: error.message });
    }
}

// Get All Add Expense Sources
exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const expenses = await Expense.find({ userId }).sort({ date: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: "Error fetching Expense sources", error: error.message });
    }
    
}

// Delete Expense Source
exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Expense source deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting Expense source", error: error.message });
    }
}

// Download Excel
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({userId}).sort({ date: -1})

        const data = expense.map((item) => ({
                Source: item.source,
                Category: item.category,
                Amount: item.amount,
                Date: item.date,
                Name: item.name
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);

        xlsx.utils.book_append_sheet(wb, ws, "Expense");
        xlsx.writeFile(wb, "Expense_details.xlsx");
        res.download("Expense_details.xlsx");
    } catch (error) {
        res.status(500).json({message: "Server Error"});
    }
};