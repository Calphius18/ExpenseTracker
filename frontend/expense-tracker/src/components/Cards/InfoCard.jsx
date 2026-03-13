import React from "react";

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="flex gap-6 bg-white p-6 rounded-[28px] shadow-sm border border-gray-100/80 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group">
      <div
        className={`w-14 h-14 flex items-center justify-center text-[22px] text-white ${color} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <div>
        <h6 className="text-sm font-medium text-gray-400 mb-1 uppercase tracking-wider">
          {label}
        </h6>
        <span className="text-2xl font-bold text-gray-800">₦{value}</span>
      </div>
    </div>
  );
};

export default InfoCard;
