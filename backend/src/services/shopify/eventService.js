const { getClient } = require('./shopifyClient');

const fetchAbandonedCheckouts = async (tenant, params = {}) => {
  const client = getClient(tenant);
  const response = await client.get('/checkouts.json', {
    params: { status: 'abandoned', ...params }
  });
  return response.data.checkouts || [];
};

const fetchOpenCheckouts = async (tenant, params = {}) => {
  const client = getClient(tenant);
  const response = await client.get('/checkouts.json', {
    params: { status: 'open', ...params }
  });
  return response.data.checkouts || [];
};

module.exports = {
  fetchAbandonedCheckouts,
  fetchOpenCheckouts
};

