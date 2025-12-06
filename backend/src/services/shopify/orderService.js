const { getClient } = require('./shopifyClient');
const logger = require('../../config/logger');

const fetchOrders = async (tenant, params = {}) => {
  const client = getClient(tenant);
  const allOrders = [];
  let lastId = null;
  let pageCount = 0;

  // Shopify API supports limit and since_id for pagination
  do {
    pageCount += 1;
    const pageParams = {
      ...params,
      limit: 250, // max per page
      status: params.status || 'any', // fetch all statuses by default
    };

    // Use since_id to get orders after the last fetched order (cursor-like)
    if (lastId) {
      pageParams.since_id = lastId;
    }

    try {
      const response = await client.get('/orders.json', { params: pageParams });
      const orders = response.data.orders || [];
      
      if (orders.length === 0) {
        break; // No more orders
      }

      allOrders.push(...orders);
      lastId = orders[orders.length - 1].id; // Set cursor to last order ID

      logger.info(`Fetched page ${pageCount} with ${orders.length} orders for tenant ${tenant.shopDomain}`);

      // Safety limit to prevent infinite loops
      if (pageCount > 100) {
        logger.warn(`Reached page limit (100) while fetching orders for ${tenant.shopDomain}`);
        break;
      }

      // Stop if we got fewer orders than the limit (last page)
      if (orders.length < 250) {
        break;
      }
    } catch (error) {
      logger.error(`Error fetching orders page ${pageCount} for tenant ${tenant.shopDomain}:`, error.message);
      break;
    }
  } while (pageCount < 100);

  logger.info(`Fetched total ${allOrders.length} orders in ${pageCount} pages for tenant ${tenant.shopDomain}`);
  return allOrders;
};

module.exports = {
  fetchOrders
};
