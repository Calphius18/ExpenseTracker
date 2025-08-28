import React from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";

const Budget = () => {
  return (
    <DashboardLayout activeMenu="Budget">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="">Budget</div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Budget;
