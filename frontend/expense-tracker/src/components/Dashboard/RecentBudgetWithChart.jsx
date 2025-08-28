import React, { useEffect, useState } from 'react'
import CustomPieChart from '../Charts/CustomPieChart';

const COLORS = ["#f5875c", "#22c55e", "#ef4444"];


const RecentBudgetWithChart = ( { data, totalBudget }) => {

    const [chartData, setChartData] = useState([]);

    const prepareChartData = () => {
        const dataArr = data?.map((item) => ({
            name: item?.source,
            amount: item?.amount,
        }));

        setChartData(dataArr);
    };

    useEffect(() => {
      prepareChartData();
    
      return () => {
        
      }
    }, [data]);
    
    
  return (
    <div className='card'>
        <div className="flex items-center justify-between">
            <h5 className="text-lg">Last 60 Days Budget</h5>
        </div>

        <CustomPieChart
            data={chartData}
            label="Total Budget"
            totalAmount={`${totalBudget}`}
            showTextAnchor
            colors={COLORS}      
        />
    </div>
  )
}

export default RecentBudgetWithChart