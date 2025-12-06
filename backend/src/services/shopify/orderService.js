const { getClient } = require('./shopifyClient');

const fetchOrders = async (tenant, params = {}) => {
  const client = getClient(tenant);
  const response = await client.get('/orders.json', { params });
  return response.data.orders || [];
};

module.exports = {
  fetchOrders
};
