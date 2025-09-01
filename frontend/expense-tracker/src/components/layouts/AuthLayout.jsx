import React from "react";
import CARD_EXP from "../../assets/images/card_exp.png";
import { TrendingUpDown } from "lucide-react";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex">
      <div className="w-screen h-screen px-12 pt-8 pb-12 md:w-[60vw]">
        <h2 className="text-lg font-medium text-black">Expense Tracker</h2>
        {children}
      </div>

      <div className="hidden md:block h-screen bg-orange-100 w-[40vw] bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative">
        <div className="w-48 h-48 rounded-[40px] bg-orange-600 absolute -top-7 -left-5" />
        <div className="w-48 h-56 rounded-[40px] border-[20px] border-amber-600 absolute top-[130px] -right-10" />
        <div className="w-48 h-48 rounded-[40px] bg-red-500 absolute -bottom-7 -left-5" />

        <div className="grid grid-cols-1 z-20">
          <StatsInfoCard
            icon={<TrendingUpDown className="w-6 h-6"/>}
            label="Track Your Expenses & Budget"
            value="100,000"
            color="bg-primary"
          />
        </div>

        <img
          src={CARD_EXP}
          alt="card_exp"
          className="w-64 lg:w-[90%] absolute bottom-10 shadow-lg shadow-orange-400/20 rounded-2xl"
        />
      </div>
    </div>
  );
};

export default AuthLayout;

const StatsInfoCard = ({icon, label, value, color}) => {
  return (
    <div className="flex gap-6 bg-white p-4 rounded-xl shadow-md shadow-orange-400/20 border border-gray-200/50 z-10">
      <div
        className={`w-12 h-12 flex items-center justify-center text-white text-[26px] ${color} rounded-full drop-shadow-xl`}
      >
        {icon}
      </div>
      <div>
        <h6 className="text-xs text-gray-500 mb-1">{label}</h6>
        <span className="text-[20px]">₦{value}</span>
      </div>
    </div>
  );
};
