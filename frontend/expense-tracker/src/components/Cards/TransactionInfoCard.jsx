import React from "react";
import { TrendingUp, TrendingDown, Trash2, ArrowRightLeft } from "lucide-react";

const TransactionInfoCard = ({
  title,
  icon,
  date,
  amount,
  type,
  disableDelete, // ✅ renamed (was hideDeleteBtn)
  onDelete,
}) => {
  const getAmountStyles = () =>
    type === "budget" ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500";

  return (
    <div className="group relative flex items-center gap-4 mt-2 p-3 rounded-2xl hover:bg-gray-50/80 border border-transparent hover:border-gray-100 transition-all duration-300">
      {/* Icon */}
      <div className="w-12 h-12 flex items-center justify-center text-xl text-gray-800 bg-slate-100/50 rounded-xl group-hover:scale-110 transition-transform">
        {icon ? (
          <img src={icon} alt={title} className="w-6 h-6 object-contain" />
        ) : (
          <ArrowRightLeft className="text-slate-400" size={20} />
        )}
      </div>

      {/* Details */}
      <div className="flex-1">
        <p className="text-sm text-slate-700 font-semibold group-hover:text-primary transition-colors">{title}</p>
        <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{date}</p>
      </div>

      {/* Amount + Delete */}
      <div className="flex flex-col items-end md:flex-row md:items-center gap-3">
        {/* Amount */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${getAmountStyles()}`}
        >
          <h6 className="text-[13px] font-bold whitespace-nowrap">
            {type === "budget" ? "+" : "-"} ₦{amount}
          </h6>
          {type === "budget" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        </div>

        {/* Delete button */}
        {!disableDelete && ( // ✅ only show for admins
          <>
            {/* Mobile: Full red button */}
            <button
              className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-red-500 text-white text-xs font-medium md:hidden cursor-pointer"
              onClick={onDelete}
            >
              <Trash2 size={16} />
              Delete
            </button>

            {/* Desktop: Subtle icon-only with tooltip */}
            <div className="hidden md:flex relative group/icon">
              <button
                className="text-gray-400 hover:text-red-500 
               opacity-0 group-hover:opacity-100 
               transition-opacity cursor-pointer"
                onClick={onDelete}
              >
                <Trash2 size={18} />
              </button>

              {/* Tooltip */}
              <span
                className="absolute -top-9 left-1/2 -translate-x-1/2 
               bg-red-500 text-white text-xs rounded px-2 py-1 
               opacity-0 translate-y-1 
               group-hover/icon:opacity-100 group-hover/icon:translate-y-0 
               transition-all duration-500 whitespace-nowrap
               after:content-[''] after:absolute after:top-full after:left-1/2 
               after:-translate-x-1/2 after:border-4 after:border-transparent 
               after:border-t-red-500"
              >
                Delete
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionInfoCard;
