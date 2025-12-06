const { Tenant, Customer, Order, Product, CustomEvent } = require('../models');
const { fetchCustomers } = require('./shopify/customerService');
const { fetchOrders } = require('./shopify/orderService');
const { fetchProducts } = require('./shopify/productService');
const { fetchAbandonedCheckouts, fetchOpenCheckouts } = require('./shopify/eventService');
const logger = require('../config/logger');

const upsertRecords = async (Model, records, mapFn) => {
  for (const record of records) {
    await Model.upsert(mapFn(record));
  }
};

const ingestTenantData = async (tenantId) => {
  const tenant = await Tenant.findByPk(tenantId);
  if (!tenant) {
    throw new Error('Tenant not found');
  }

  logger.info(`Starting ingestion for tenant ${tenant.shopDomain}`);

  const [customers, orders, products, abandonedCheckouts, openCheckouts] = await Promise.all([
    fetchCustomers(tenant),
    fetchOrders(tenant),
    fetchProducts(tenant),
    fetchAbandonedCheckouts(tenant),
    fetchOpenCheckouts(tenant)
  ]);

  await upsertRecords(Customer, customers, (customer) => ({
    id: customer.id,
    tenantId: tenant.id,
    firstName: customer.first_name,
    lastName: customer.last_name,
    email: customer.email,
    totalSpent: customer.total_spent
  }));

  await upsertRecords(Order, orders, (order) => ({
    id: order.id,
    tenantId: tenant.id,
    customerId: order.customer?.id ?? null,
    totalPrice: order.total_price,
    currency: order.currency,
    processedAt: order.processed_at
  }));

  await upsertRecords(Product, products, (product) => ({
    id: product.id,
    tenantId: tenant.id,
    title: product.title,
    vendor: product.vendor,
    inventoryQuantity: product.variants?.reduce((sum, variant) => sum + (variant.inventory_quantity || 0), 0) || 0
  }));

  const customEvents = [
    ...abandonedCheckouts.map((checkout) => ({
      tenantId: tenant.id,
      externalId: checkout.id.toString(),
      type: 'cart_abandoned',
      status: checkout.abandoned_checkout_url ? 'abandoned' : 'unknown',
      occurredAt: checkout.updated_at || checkout.created_at,
      payload: checkout
    })),
    ...openCheckouts.map((checkout) => ({
      tenantId: tenant.id,
      externalId: `checkout-${checkout.id}`,
      type: 'checkout_started',
      status: checkout.status || 'open',
      occurredAt: checkout.updated_at || checkout.created_at,
      payload: checkout
    }))
  ];

  if (customEvents.length) {
    await upsertRecords(CustomEvent, customEvents, (event) => event);
  }

  tenant.lastSyncedAt = new Date();
  await tenant.save();

  logger.info(`Finished ingestion for tenant ${tenant.shopDomain}`);

  return {
    customers: customers.length,
    orders: orders.length,
    products: products.length,
    customEvents: customEvents.length
  };
};

module.exports = {
  ingestTenantData
};
