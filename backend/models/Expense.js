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
    }
}, {timestamps: true});

module.exports = mongoose.model("Expense", ExpenseSchema);