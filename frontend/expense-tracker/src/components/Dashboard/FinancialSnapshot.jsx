import React from "react";

const FinancialSnapshot = ({ totalBalance, totalBudget, totalExpense }) => {
    const total = totalBudget || 1; // Prevent division by zero
    const balancePercentage = Math.min((totalBalance / total) * 100, 100);
    const expensePercentage = Math.min((totalExpense / total) * 100, 100);

    // SVG parameters
    const size = 200;
    const strokeWidth = 14;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    // Calculate offsets (starting from top)
    const balanceOffset = circumference - (balancePercentage / 100) * circumference;
    const expenseOffset = circumference - (expensePercentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center py-4">
            <div className="relative" style={{ width: size, height: size }}>
                {/* Background Circle */}
                <svg width={size} height={size} className="transform -rotate-90">
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="transparent"
                        stroke="#f1f5f9"
                        strokeWidth={strokeWidth}
                    />
                    {/* Budget Circle (as background) */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="transparent"
                        stroke="#e2e8f0"
                        strokeWidth={strokeWidth}
                        className="opacity-50"
                    />
                    {/* Expenses Arc */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="transparent"
                        stroke="#ef4444"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={expenseOffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                    {/* Balance Arc */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="transparent"
                        stroke="#2dd4bf"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={balanceOffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>

                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Total Balance</span>
                    <span className="text-xl font-bold text-slate-800">
                        ₦{totalBalance.toLocaleString()}
                    </span>
                    <div className="mt-1 flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-secondary"></div>
                        <span className="text-[9px] text-slate-500 font-medium">
                            {Math.round(balancePercentage)}% of Budget
                        </span>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-8 grid grid-cols-3 gap-4 w-full px-4">
                <div className="flex flex-col items-center border-r border-slate-100 last:border-0 px-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase mb-1">Budget</span>
                    <span className="text-sm font-bold text-slate-700">₦{totalBudget.toLocaleString()}</span>
                </div>
                <div className="flex flex-col items-center border-r border-slate-100 last:border-0 px-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase mb-1">Balance</span>
                    <span className="text-sm font-bold text-secondary">₦{totalBalance.toLocaleString()}</span>
                </div>
                <div className="flex flex-col items-center border-r border-slate-100 last:border-0 px-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase mb-1">Expenses</span>
                    <span className="text-sm font-bold text-red-500">₦{totalExpense.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};

export default FinancialSnapshot;
