const { getClient } = require('./shopifyClient');

const fetchCustomers = async (tenant, params = {}) => {
  const client = getClient(tenant);
  const response = await client.get('/customers.json', { params });
  return response.data.customers || [];
};

module.exports = {
  fetchCustomers
};
