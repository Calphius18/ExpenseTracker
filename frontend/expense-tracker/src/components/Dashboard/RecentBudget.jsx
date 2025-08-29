import { ArrowRight } from "lucide-react";
import React from "react";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import moment from "moment";

const RecentBudget = ({ transactions, onSeeMore }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Budget</h5>

        <button className="card-btn" onClick={onSeeMore}>
          See All <ArrowRight className="text-base" />
        </button>
      </div>

      <div className="mt-6">
        {transactions?.slice(0,5)?.map((item) => (
            <TransactionInfoCard
                key={item._id}
                title={item.category+" -> "+item.source}
                icon={item.icon}
                date={moment(item.date).format("Do MMM YYYY")}
                amount={item.amount}
                type="budget"
                hideDeleteBtn
                />
        ))}
      </div>
    </div>
  );
};

export default RecentBudget;
