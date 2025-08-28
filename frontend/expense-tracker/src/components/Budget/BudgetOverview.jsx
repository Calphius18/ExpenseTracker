import React, { useEffect, useState } from 'react'

import CustomBarChart from '../../components/Charts/CustomBarChart';
import { prepareBudgetBarChartData } from '../../utils/helper';
import { Plus } from 'lucide-react';

const BudgetOverview = ({transactions, onAddBudget}) => {

    const [chartData, setChartData] = useState([])

    useEffect(() => {
      const result = prepareBudgetBarChartData(transactions);
      setChartData(result);
    
      return () => {
        
      }
    }, [transactions]);

  return (
    <div className='card'>
        <div className="flex items-center justify-between">
            <div className="">
                <h5 className="text-lg">Budget Overview</h5>
                <p className="text-xs text-gray-400 mt-0.5">Keep Track And Analyze Of Your Budget Trends</p>
            </div>

            <button className="add-btn" onClick={onAddBudget}>
                <Plus className='text-lg'/>
                Add Budget
            </button>
        </div>

        <div className='mt-10'>
            <CustomBarChart data={chartData}/>
        </div>

    </div>
  )
}

export default BudgetOverview