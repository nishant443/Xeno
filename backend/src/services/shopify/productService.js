const { getClient } = require('./shopifyClient');

const fetchProducts = async (tenant, params = {}) => {
  const client = getClient(tenant);
  const response = await client.get('/products.json', { params });
  return response.data.products || [];
};

module.exports = {
  fetchProducts
};
