import React from "react";

const DailySpendBarList = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-slate-400 min-h-[250px]">
                <p className="text-sm font-medium">No recent activity detected</p>
            </div>
        );
    }

    // Get max amount for relative scaling
    const maxAmount = Math.max(...data.map(item => item.amount)) || 1;

    return (
        <div className="flex items-end justify-between gap-1 h-[250px] mt-8 pt-4 pb-2 px-2">
            {data.slice(0, 10).map((item, index) => {
                const heightPercentage = Math.max((item.amount / maxAmount) * 100, 5); // Min 5% height
                const isEven = index % 2 === 0;

                return (
                    <div key={index} className="flex-1 flex flex-col items-center group relative h-full">
                        {/* Tooltip */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            <p className="font-bold">₦{item.amount.toLocaleString()}</p>
                            <p className="text-[9px] opacity-70">{item.month}</p>
                        </div>

                        {/* Bar */}
                        <div className="flex-1 w-full flex flex-col justify-end">
                            <div
                                className={`w-full rounded-t-lg transition-all duration-500 ease-out cursor-help
                  ${isEven ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-orange-200'}
                  group-hover:opacity-80
                `}
                                style={{ height: `${heightPercentage}%` }}
                            ></div>
                        </div>

                        {/* Label */}
                        <div className="mt-4 flex flex-col items-center">
                            <span className="text-[9px] font-bold text-slate-400 rotate-45 origin-left whitespace-nowrap">
                                {item.month.split(' ')[0]}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default DailySpendBarList;
