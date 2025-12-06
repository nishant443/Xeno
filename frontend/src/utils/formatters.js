export const formatCurrency = (value, currency = 'USD') => {
  if (value == null) {
    return '$0.00';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(Number(value) || 0);
};

export const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US').format(Number(value) || 0);
};
