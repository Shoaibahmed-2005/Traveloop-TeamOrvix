export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount || 0);
};

export const formatNumber = (num) => new Intl.NumberFormat('en-IN').format(num || 0);
