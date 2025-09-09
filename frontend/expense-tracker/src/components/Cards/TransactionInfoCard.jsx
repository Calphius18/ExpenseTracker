import React from "react";
import { TrendingUp, TrendingDown, Trash2, ArrowRightLeft } from "lucide-react";

const TransactionInfoCard = ({
  title,
  icon,
  date,
  amount,
  type,
  hideDeleteBtn,
  onDelete,
}) => {
  const getAmountStyles = () =>
    type === "budget" ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500";

  return (
    <div className="group relative flex items-center gap-4 mt-2 p-3 rounded-lg hover:bg-gray-100/60">
      {/* Icon */}
      <div className="w-12 h-12 flex items-center justify-center text-xl text-gray-800 bg-gray-100 rounded-full">
        {icon ? (
          <img src={icon} alt={title} className="w-6 h-6" />
        ) : (
          <ArrowRightLeft />
        )}
      </div>

      {/* Details */}
      <div className="flex-1">
        <p className="text-sm text-gray-700 font-medium">{title}</p>
        <p className="text-xs text-gray-400 mt-1">{date}</p>
      </div>

      {/* Amount + Delete */}
      <div className="flex flex-col items-end md:flex-row md:items-center gap-2">
        {/* Amount */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${getAmountStyles()}`}
        >
          <h6 className="text-xs font-medium whitespace-nowrap">
            {type === "budget" ? "+" : "-"} ₦{amount}
          </h6>
          {type === "budget" ? <TrendingUp /> : <TrendingDown />}
        </div>

        {/* Delete button */}
        {!hideDeleteBtn && (
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
