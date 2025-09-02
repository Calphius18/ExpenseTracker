const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
    userId : {
            type: mongoose.Schema.Types.ObjectId, ref: "User", required: true
    },
    icons: {
        type: String
    },
    source: {
        type: String, required : true
    }, // e.g Head Office budget, Internet, Licenses, etc.
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

module.exports = mongoose.model("Budget", BudgetSchema);