// backend/models/Expense.js

const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    icons: {
      type: String,
    },
    source: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["CAPEX", "OPEX", "Transport Fees"],
      default: "CAPEX",
    },
    category: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    percentagePaid: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
      set: v => {
        const num = Number(v) || 0;
        if (num < 0) return 0;
        if (num > 100) return 100;
        return num;
      },
    },
    balanceAmount: {
      type: Number,
      default: 0, // This will be overridden by the pre-save hook
    },
    date: {
      type: Date,
      default: Date.now,
    },
    name: {
      type: String,
      required: true,
    },
    externalId: {
      type: String,
      index: true,
    },
  },
  { timestamps: true }
);

// Unique index for (userId + externalId)
ExpenseSchema.index({ userId: 1, externalId: 1 }, { unique: true });

// Helper to compute balance
function computeBalance(amount, percentagePaid) {
  const a = Number(amount) || 0;
  const p = Number(percentagePaid) || 0;
  const bal = a - (a * p) / 100;
  return Math.round((bal + Number.EPSILON) * 100) / 100;
}

// Auto-calc balance on save (new or modified)
ExpenseSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("amount") || this.isModified("percentagePaid")) {
    this.balanceAmount = computeBalance(this.amount, this.percentagePaid);
  }
  next();
});

// Auto-calc balance on findOneAndUpdate
ExpenseSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const update = this.getUpdate();

    // Check if amount or percentagePaid are being updated
    const isAmountModified = update.amount !== undefined || (update.$set && update.$set.amount !== undefined);
    const isPercentageModified = update.percentagePaid !== undefined || (update.$set && update.$set.percentagePaid !== undefined);

    if (!isAmountModified && !isPercentageModified) {
      return next();
    }

    // Get the original document to get the current values
    const doc = await this.model.findOne(this.getQuery()).lean();
    if (!doc) {
        return next();
    }

    // Get the new values from the update object or fall back to the old ones
    const newAmount = (update.$set && update.$set.amount !== undefined) ? update.$set.amount : (update.amount !== undefined ? update.amount : doc.amount);
    const newPercentagePaid = (update.$set && update.$set.percentagePaid !== undefined) ? update.$set.percentagePaid : (update.percentagePaid !== undefined ? update.percentagePaid : doc.percentagePaid);

    const newBalance = computeBalance(newAmount, newPercentagePaid);

    // Apply the updated balance to the update object
    if (!update.$set) {
      update.$set = {};
    }
    update.$set.balanceAmount = newBalance;
    this.setUpdate(update);

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Expense", ExpenseSchema);