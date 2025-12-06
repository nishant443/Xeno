import api from './api.js';

export const getMetrics = async () => {
  const { data } = await api.get('/metrics');
  return data;
};

export const triggerIngestion = async () => {
  const { data } = await api.post('/ingestion/run');
  return data;
};

export const getTenants = async () => {
  const { data } = await api.get('/tenants');
  return data;
};

export const getOrdersByDate = async ({ startDate, endDate }) => {
  const { data } = await api.get('/metrics/orders-by-date', {
    params: { startDate, endDate }
  });
  return data;
};

export const getTopCustomers = async (limit = 5) => {
  const { data } = await api.get('/metrics/top-customers', {
    params: { limit }
  });
  return data;
};

export const getOrders = async () => {
  const { data } = await api.get('/metrics/orders');
  return data;
};

export const getCustomers = async () => {
  const { data } = await api.get('/metrics/customers');
  return data;
};
