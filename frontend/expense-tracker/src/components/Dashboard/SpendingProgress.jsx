import React from "react";

const SpendingProgress = ({ data, total }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-slate-400">
                <p className="text-sm font-medium">No distribution data available</p>
            </div>
        );
    }

    const COLORS = [
        "bg-indigo-500",
        "bg-teal-500",
        "bg-orange-500",
        "bg-purple-500",
        "bg-blue-500",
        "bg-red-500",
        "bg-yellow-500",
    ];

    return (
        <div className="space-y-6 py-4">
            {data.map((item, index) => {
                const percentage = total > 0 ? (item.amount / total) * 100 : 0;
                const colorClass = COLORS[index % COLORS.length];

                return (
                    <div key={index} className="space-y-2">
                        <div className="flex justify-between items-end px-1">
                            <div className="space-y-0.5">
                                <p className="text-xs font-bold text-slate-700 uppercase tracking-tight">
                                    {item.name}
                                </p>
                                <p className="text-[10px] text-slate-400 font-medium">
                                    {item.category}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-[13px] font-bold text-slate-800">
                                    ₦{item.amount.toLocaleString()}
                                </p>
                                <p className={`text-[10px] font-bold ${colorClass.replace('bg-', 'text-')}`}>
                                    {percentage.toFixed(1)}%
                                </p>
                            </div>
                        </div>

                        {/* Progress Track */}
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${colorClass} rounded-full transition-all duration-1000 ease-out`}
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default SpendingProgress;
