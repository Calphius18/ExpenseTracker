const xlsx = require("xlsx");
const Expense = require("../models/Expense");

// Add Expense Source
exports.addExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const {
      icons,
      type,
      percentagePaid,
      source,
      name,
      category,
      amount,
      date,
    } = req.body || {};

    if (
      !source ||
      !amount ||
      percentagePaid === undefined ||
      !type ||
      !category ||
      !name ||
      !date
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    const newExpense = new Expense({
      userId,
      icons,
      source: String(source).trim(),
      category: String(category).trim(),
      amount: Number(amount), // ensure number
      type: type || "Cash", // default if missing
      percentagePaid: Number(percentagePaid) || 0,
      name: String(name).trim(),
      date: date ? new Date(date) : new Date(), // default to now if missing
    });

    await newExpense.save();
    res.status(200).json(newExpense);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding Expense source", error: error.message });
  }
};

// Get All Expenses
exports.getAllExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching Expense sources",
      error: error.message,
    });
  }
};

// Delete Expense Source
exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense source deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting Expense source", error: error.message });
  }
};

// Download Excel
exports.downloadExpenseExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });

    const data = expenses.map((item) => ({
      Source: item.source,
      Category: item.category,
      Amount: item.amount,
      Date: item.date,
      Name: item.name,
      Type: item.type,
      PercentagePaid: item.percentagePaid,
      BalanceAmount: item.balanceAmount,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);

    xlsx.utils.book_append_sheet(wb, ws, "Expense");
    xlsx.writeFile(wb, "Expense_details.xlsx");
    res.download("Expense_details.xlsx");
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Upload Excel
exports.uploadExpenseExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Parse Excel
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet, { defval: null });

    const expenses = [];

    for (const row of rows) {
      const {
        Source,
        Category,
        Type,
        PercentagePaid,
        Amount,
        Name,
        Date: DateField,
        Icons,
        ExternalId,
      } = row;

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

      // Normalize date to YYYY-MM-DD (string)
      const normalizedDate = parsedDate.toISOString().split("T")[0];

      const amountNum = Number(Amount);
      const paidPercent = Number(PercentagePaid) || 0;
      const balance = amountNum - (amountNum * paidPercent) / 100;

      expenses.push({
        userId,
        source: String(Source).trim(),
        category: String(Category).trim(),
        amount: amountNum,
        name: String(Name).trim(),
        date: normalizedDate,
        icons: Icons || null,
        type: Type || "CAPEX",
        percentagePaid: paidPercent,
        balanceAmount: balance,
        externalId: ExternalId ? String(ExternalId).trim() : undefined,
      });
    }

    if (!expenses.length) {
      return res
        .status(400)
        .json({ message: "No valid rows found in uploaded file" });
    }

    // Bulk write
    const operations = expenses.map((exp) => {
      const filter = exp.externalId
        ? { userId: exp.userId, externalId: exp.externalId }
        : {
            userId: exp.userId,
            source: exp.source,
            name: exp.name,
            category: exp.category,
            date: exp.date,
          };

      return {
  updateOne: {
    filter,
    update: {
      $setOnInsert: {
        userId: exp.userId,
        source: exp.source,
        category: exp.category,
        name: exp.name,
        date: exp.date,
        icons: exp.icons,
        externalId: exp.externalId,
      },
      $set: {
        amount: exp.amount,        // ✅ Update amount if it changes
        percentagePaid: exp.percentagePaid,
        balanceAmount: exp.balanceAmount,
        type: exp.type,            // ✅ Now updates Type safely
      },
    },
    upsert: true,
  },
};

    });

    const result = await Expense.bulkWrite(operations);

    res.status(200).json({
      message: "Expenses uploaded / updated successfully",
      totalRows: rows.length,
      attempted: expenses.length,
      inserted: result.upsertedCount,
      updated: result.modifiedCount,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res
      .status(500)
      .json({ message: "Error uploading expenses", error: error.message });
  }
};

// GET report of expenses (JSON)
exports.getExpensesReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      source,
      type,
      dateFrom,
      dateTo,
      search,
      page = 1,
      limit = 1000,
      sortBy = "date",
      order = "desc",
    } = req.query;

    // Base filter
    const baseFilter = { userId };

    if (name) baseFilter.name = new RegExp(name, "i");
    if (source) baseFilter.source = new RegExp(source, "i");
    if (type) baseFilter.type = type;

    // Search across multiple fields
    if (search) {
      baseFilter.$or = [
        { name: new RegExp(search, "i") },
        { source: new RegExp(search, "i") },
        { category: new RegExp(search, "i") },
      ];
    }

    // Date range filter (use the actual `date` field, not createdAt)
    if (dateFrom || dateTo) {
      baseFilter.date = {};
      if (dateFrom) baseFilter.date.$gte = new Date(dateFrom);
      if (dateTo) {
        const d = new Date(dateTo);
        d.setHours(23, 59, 59, 999); // include the full "to" day
        baseFilter.date.$lte = d;
      }
    }

    // Pagination
    const p = Math.max(1, parseInt(page, 10) || 1);
    const lim = Math.max(1, Math.min(5000, parseInt(limit, 10) || 1000));
    const skip = (p - 1) * lim;

    // Sort
    const sortOrder = order === "asc" ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    // Query
    const [expenses, total] = await Promise.all([
      Expense.find(baseFilter).sort(sort).skip(skip).limit(lim).lean().exec(),
      Expense.countDocuments(baseFilter),
    ]);

    res.json({
      expenses,
      total,
      page: p,
      limit: lim,
    });
  } catch (err) {
    console.error("getExpensesReport error:", err);
    res.status(500).json({ message: "Error fetching report of expenses", error: err.message });
  }
};

// DOWNLOAD filtered expenses as Excel
exports.downloadExpensesReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, source, type, dateFrom, dateTo, search } = req.query;

    // Base filter
    const baseFilter = { userId };
    if (name) baseFilter.name = new RegExp(name, "i");
    if (source) baseFilter.source = new RegExp(source, "i");
    if (type) baseFilter.type = type;

    // Search across multiple fields
    if (search) {
      baseFilter.$or = [
        { name: new RegExp(search, "i") },
        { source: new RegExp(search, "i") },
        { category: new RegExp(search, "i") },
      ];
    }

    // Date range filter
    if (dateFrom || dateTo) {
      baseFilter.date = {};
      if (dateFrom) baseFilter.date.$gte = new Date(dateFrom);
      if (dateTo) {
        const d = new Date(dateTo);
        d.setHours(23, 59, 59, 999); // include the full "to" day
        baseFilter.date.$lte = d;
      }
    }

    // Query
    const expenses = await Expense.find(baseFilter).sort({ date: -1 }).lean();

    // Transform for Excel
    const data = expenses.map((e) => ({
      Source: e.source,
      Category: e.category,
      Type: e.type,
      Name: e.name,
      Amount: e.amount,
      Date: e.date ? new Date(e.date).toISOString().split("T")[0] : "",
      PercentagePaid: e.percentagePaid,
      BalanceAmount: e.balanceAmount,
    }));

    // Generate Excel
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expenses");

    const buffer = xlsx.write(wb, { bookType: "xlsx", type: "buffer" });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=filtered_expenses.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (err) {
    console.error("downloadExpensesReport error:", err);
    res
      .status(500)
      .json({ message: "Error downloading expenses", error: err.message });
  }
};
