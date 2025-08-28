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

//Incase "2:30:21"
export const addThousandsSeparator = (num) => {
  if (num === null || num === undefined) return "";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const prepareExpenseBarChartData = (data = []) => {
  const chartData = data.map((item) =>({
    category: item?.category,
    amount: item?.amount,
  }));

  return chartData;
}