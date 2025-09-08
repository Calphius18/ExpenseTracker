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

exports.uploadExpenseExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Parse Excel/CSV
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet, { defval: null });

    const expenses = [];

    for (const row of rows) {
      const { Source, Category, Amount, Name, Date: DateField, Icons, ExternalId } = row;

      // Required fields
      if (!Source || !Category || !Amount || !Name || !DateField) continue;

      // Parse Excel date or ISO string
      let parsedDate;
      if (typeof DateField === "number") {
        const excelEpoch = new Date(Date.UTC(1899, 11, 30));
        parsedDate = new Date(excelEpoch.getTime() + DateField * 86400000);
      } else {
        parsedDate = new Date(DateField);
        if (isNaN(parsedDate.getTime())) continue;
      }

      expenses.push({
        userId,
        source: String(Source).trim(),
        category: String(Category).trim(),
        amount: Number(Amount),
        name: String(Name).trim(),
        date: parsedDate,
        icons: Icons || null,
        externalId: ExternalId ? String(ExternalId).trim() : undefined,
      });
    }

    if (!expenses.length) {
      return res
        .status(400)
        .json({ message: "No valid rows found in uploaded file" });
    }

    // Use bulkWrite for deduplication
    const operations = expenses.map((exp) => {
      let filter;

      if (exp.externalId) {
        // Deduplicate by externalId if provided
        filter = { userId: exp.userId, externalId: exp.externalId };
      } else {
        // Fallback deduplication by key fields
        filter = {
          userId: exp.userId,
          date: exp.date,
          amount: exp.amount,
          name: exp.name,
          category: exp.category,
        };
      }

      return {
        updateOne: {
          filter,
          update: { $setOnInsert: exp },
          upsert: true,
        },
      };
    });

    await Expense.bulkWrite(operations);

    res.status(200).json({
      message: "✅ Expenses uploaded successfully (duplicates skipped)",
      totalRows: rows.length,
      attempted: expenses.length,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Error uploading expenses", error: error.message });
  }
};