const axios = require('axios');
const env = require('../../config/env');

const buildHeaders = (tenant) => ({
  'X-Shopify-Access-Token': tenant?.accessToken || env.shopify.accessToken,
  'Content-Type': 'application/json'
});

const getBaseUrl = (tenant) => {
  const shopDomain = tenant?.shopDomain;
  if (!shopDomain) {
    throw new Error('Tenant shop domain missing');
  }
  return `https://${shopDomain}/admin/api/2024-10`;
};

const getClient = (tenant) => {
  return axios.create({
    baseURL: getBaseUrl(tenant),
    headers: buildHeaders(tenant),
    timeout: 10000
  });
};

module.exports = {
  getClient
};
