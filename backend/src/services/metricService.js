const { Op, fn, col } = require('sequelize');
const {
  sequelize,
  Customer,
  Order,
  Product,
  CustomEvent
} = require('../models');

const getDashboardMetrics = async (tenantId) => {
  const [
    customerCount,
    orderCount,
    productCount,
    sales,
    cartAbandonedCount,
    checkoutStartedCount
  ] = await Promise.all([
    Customer.count({ where: { tenantId } }),
    Order.count({ where: { tenantId } }),
    Product.count({ where: { tenantId } }),
    Order.sum('totalPrice', { where: { tenantId } }),
    CustomEvent.count({ where: { tenantId, type: 'cart_abandoned' } }),
    CustomEvent.count({ where: { tenantId, type: 'checkout_started' } })
  ]);

  return {
    customerCount,
    orderCount,
    productCount,
    totalSales: sales || 0,
    cartAbandonedCount,
    checkoutStartedCount
  };
};

const getOrdersByDate = async (tenantId, startDate, endDate) => {
  const where = { tenantId };
  if (startDate || endDate) {
    where.processedAt = {};
    if (startDate) {
      where.processedAt[Op.gte] = new Date(startDate);
    }
    if (endDate) {
      where.processedAt[Op.lte] = new Date(endDate);
    }
  }

  const rows = await Order.findAll({
    attributes: [
      [fn('DATE', col('processedAt')), 'date'],
      [fn('COUNT', col('id')), 'orderCount'],
      [fn('SUM', col('totalPrice')), 'totalSales']
    ],
    where,
    group: [fn('DATE', col('processedAt'))],
    order: [[fn('DATE', col('processedAt')), 'ASC']]
  });

  return rows.map((row) => row.get({ plain: true }));
};

const getTopCustomers = async (tenantId, limit = 5) => {
  const customers = await Customer.findAll({
    where: { tenantId },
    attributes: ['id', 'firstName', 'lastName', 'email', 'totalSpent'],
    order: [['totalSpent', 'DESC']],
    limit
  });

  return customers.map((customer) => customer.get({ plain: true }));
};

const getAllOrders = async (tenantId) => {
  const orders = await Order.findAll({
    where: { tenantId },
    attributes: ['id', 'totalPrice', 'processedAt'],
    order: [['processedAt', 'DESC']],
    limit: 100
  });

  return orders.map((order) => ({
    id: order.id,
    name: `Order #${order.id}`,
    total: order.totalPrice,
    updatedAt: order.processedAt
  }));
};

const getAllCustomers = async (tenantId) => {
  const customers = await Customer.findAll({
    where: { tenantId },
    attributes: ['id', 'firstName', 'lastName', 'email', 'totalSpent', 'updatedAt'],
    order: [['updatedAt', 'DESC']],
    limit: 100
  });

  return customers.map((customer) => ({
    id: customer.id,
    name: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || customer.email,
    total: Number(customer.totalSpent) || 0,
    updatedAt: customer.updatedAt
  }));
};

module.exports = {
  getDashboardMetrics,
  getOrdersByDate,
  getTopCustomers,
  getAllOrders,
  getAllCustomers
};
