const mongoose = require("mongoose"); 

const ExpenseSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId, ref: "User", required: true
    },
    icons: {
        type: String
    },
    source: {
        type: String, required : true
    }, // e.g Head Office, Branch.
    category: {
        type: String, required : true
    }, // e.g For Repairs, Subscription.
    amount: {
        type: Number, required: true
    },
    date: {
        type: Date, default: Date.now
    },
    name: {
        type: String, required : true
    },
    externalId: {
        type: String,
        index: true
    } // 👈 optional transaction identifier from Excel
}, {timestamps: true});

// 👇 This ensures (userId + externalId) is unique
ExpenseSchema.index({ userId: 1, externalId: 1 }, { unique: true });

module.exports = mongoose.model("Expense", ExpenseSchema);
