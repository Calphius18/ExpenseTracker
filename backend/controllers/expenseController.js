const xlsx = require("xlsx");
const Expense = require("../models/Expense");
const asyncHandler = require("../utils/asyncHandler");

// ✅ Add Expense
exports.addExpense = asyncHandler(async (req, res) => {
  const userId = req.user.id; // keep for tracking who added

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
    res.status(400);
    throw new Error("Please provide all required fields.");
  }

  const newExpense = new Expense({
    userId, // keep for audit trail
    icons,
    source: String(source).trim(),
    category: String(category).trim(),
    amount: Number(amount),
    type: type || "CAPEX",
    percentagePaid: Number(percentagePaid) || 0,
    name: String(name).trim(),
    date: date ? new Date(date) : new Date(),
  });

  await newExpense.save();
  res.status(200).json(newExpense);
});

// ✅ Get All Expenses (shared across all users)
// ✅ Get All Expenses (shared across all users)
exports.getAllExpense = asyncHandler(async (req, res) => {
  const expenses = await Expense.find().sort({ date: -1 });
  res.status(200).json(expenses);
});

// ✅ Delete Expense
exports.deleteExpense = asyncHandler(async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ message: "Expense deleted successfully" });
});

// ✅ Download Excel (shared)
exports.downloadExpenseExcel = asyncHandler(async (req, res) => {
  const expenses = await Expense.find().sort({ date: -1 });

  const data = expenses.map((item) => ({
    Source: item.source,
    Category: item.category,
    Amount: item.amount,
    Date: item.date,
    Name: item.name,
    Type: item.type,
    PercentagePaid: item.percentagePaid,
    BalanceAmount: item.balanceAmount,
    AddedBy: item.userId || "Unknown", // optional tracker
  }));

  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(data);
  xlsx.utils.book_append_sheet(wb, ws, "Expense");

  const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=Expense_details.xlsx"
  );
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.send(buffer);
});

// ✅ Upload Excel (shared)
exports.uploadExpenseExcel = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  // Parse Excel
  const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { defval: null });

  const expenses = [];

  const ALLOWED_TYPES = ["CAPEX", "OPEX", "Transport Fees"];

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

    const cleanType = ALLOWED_TYPES.includes(String(Type).trim())
      ? String(Type).trim()
      : "CAPEX";

    let parsedDate;
    if (typeof DateField === "number") {
      const excelEpoch = new Date(Date.UTC(1899, 11, 30));
      parsedDate = new Date(excelEpoch.getTime() + DateField * 86400000);
    } else {
      parsedDate = new Date(DateField);
      if (isNaN(parsedDate.getTime())) continue;
    }

    const normalizedDate = parsedDate.toISOString().split("T")[0];
    const amountNum = Number(Amount);
    const paidPercent = Number(PercentagePaid) || 0;
    const balance = amountNum - (amountNum * paidPercent) / 100;

    expenses.push({
      userId, // record uploader
      source: String(Source).trim(),
      category: String(Category).trim(),
      amount: amountNum,
      name: String(Name).trim(),
      date: normalizedDate,
      icons: Icons || null,
      type: cleanType,
      percentagePaid: paidPercent,
      balanceAmount: balance,
      externalId: ExternalId ? String(ExternalId).trim() : undefined,
    });
  }

  if (!expenses.length) {
    res.status(400);
    throw new Error("No valid rows found in file");
  }

  const operations = expenses.map((exp) => {
    const filter = exp.externalId
      ? { externalId: exp.externalId }
      : {
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
            source: exp.source,
            category: exp.category,
            name: exp.name,
            date: exp.date,
            icons: exp.icons,
            externalId: exp.externalId,
            userId: exp.userId,
          },
          $set: {
            amount: exp.amount,
            percentagePaid: exp.percentagePaid,
            balanceAmount: exp.balanceAmount,
            type: exp.type,
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
});

// ✅ Get Report (shared)
// ✅ Get Report (shared)
exports.getExpensesReport = asyncHandler(async (req, res) => {
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

  const baseFilter = {};

  if (name) baseFilter.name = new RegExp(name, "i");
  if (source) baseFilter.source = new RegExp(source, "i");
  if (type) baseFilter.type = type;
  if (search) {
    baseFilter.$or = [
      { name: new RegExp(search, "i") },
      { source: new RegExp(search, "i") },
      { category: new RegExp(search, "i") },
    ];
  }

  if (dateFrom || dateTo) {
    baseFilter.date = {};
    if (dateFrom) baseFilter.date.$gte = new Date(dateFrom);
    if (dateTo) {
      const d = new Date(dateTo);
      d.setHours(23, 59, 59, 999);
      baseFilter.date.$lte = d;
    }
  }

  const p = Math.max(1, parseInt(page, 10) || 1);
  const lim = Math.max(1, Math.min(5000, parseInt(limit, 10) || 1000));
  const skip = (p - 1) * lim;

  const sortOrder = order === "asc" ? 1 : -1;
  const sort = { [sortBy]: sortOrder };

  const [expenses, total] = await Promise.all([
    Expense.find(baseFilter).sort(sort).skip(skip).limit(lim).lean(),
    Expense.countDocuments(baseFilter),
  ]);

  res.json({ expenses, total, page: p, limit: lim });
});

// ✅ Download Filtered Report (shared)
exports.downloadExpensesReport = asyncHandler(async (req, res) => {
  const { name, source, type, dateFrom, dateTo, search } = req.query;

  const baseFilter = {};
  if (name) baseFilter.name = new RegExp(name, "i");
  if (source) baseFilter.source = new RegExp(source, "i");
  if (type) baseFilter.type = type;
  if (search) {
    baseFilter.$or = [
      { name: new RegExp(search, "i") },
      { source: new RegExp(search, "i") },
      { category: new RegExp(search, "i") },
    ];
  }

  if (dateFrom || dateTo) {
    baseFilter.date = {};
    if (dateFrom) baseFilter.date.$gte = new Date(dateFrom);
    if (dateTo) {
      const d = new Date(dateTo);
      d.setHours(23, 59, 59, 999);
      baseFilter.date.$lte = d;
    }
  }

  const expenses = await Expense.find(baseFilter).sort({ date: -1 }).lean();

  const data = expenses.map((e) => ({
    Source: e.source,
    Category: e.category,
    Type: e.type,
    Name: e.name,
    Amount: e.amount,
    Date: e.date ? new Date(e.date).toISOString().split("T")[0] : "",
    PercentagePaid: e.percentagePaid,
    BalanceAmount: e.balanceAmount,
    AddedBy: e.userId || "Unknown",
  }));

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
});
