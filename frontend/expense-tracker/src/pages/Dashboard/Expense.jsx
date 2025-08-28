import React from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'

const Expense = () => {
  return (
    <DashboardLayout activeMenu="Expenses">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="">Expenses</div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Expense