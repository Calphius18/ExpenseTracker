import moment from "moment";

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const getInitials = (name) => {
  if(!name) return "";

  const words = name.split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++ ) {
    initials += words[i][0];
  }

  return initials.toUpperCase();
};

export const addThousandsSeparator = (num) => {
  if (num === null || num === undefined) return "";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const prepareExpenseBarChartData = (data = []) => {
  const sortedData = [...data].sort((a,b) => new Date(a.date) - new Date(b.date))

  const chartData = sortedData.map((item) =>({
    month: moment(item?.date).format("Do MMM"),
    amount: item?.amount,
    source: item?.source,
    category: item?.category,
    id:item?._id,
    name: item?.name
  }));
  
  return chartData;
}
export const prepareBudgetBarChartData = (data = []) => {
  const sortedData = [...data].sort((a,b) => new Date(a.date) - new Date(b.date))

  const chartData = sortedData.map((item) =>({
    month: moment(item?.date).format("Do MMM YYYY"),
    amount: item?.amount,
    source: item?.source,
    category: item?.category,
    name: item?.name,
    id:item._id
  }));
  
  return chartData;
}

export const prepareExpenseLineChartData = (data = []) => {
 const sortedData = [...data].sort((a,b) => new Date(a.date) - new Date(b.date))

  const chartData = sortedData.map((item) =>({
    month: moment(item?.date).format("Do MMM YYYY"),
    amount: item?.amount,
    source: item?.source,
    category: item?.category,
    name: item?.name
  }));
  
  return chartData;
}