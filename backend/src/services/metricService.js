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
      // Start of day (00:00:00)
      const s = new Date(startDate);
      s.setUTCHours(0, 0, 0, 0);
      where.processedAt[Op.gte] = s;
    }
    if (endDate) {
      // End of day (23:59:59.999)
      const e = new Date(endDate);
      e.setUTCHours(23, 59, 59, 999);
      where.processedAt[Op.lte] = e;
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

  // If a date range was provided, return a zero-filled series for every day in the range
  const plainRows = rows.map((row) => row.get({ plain: true }));
  if (startDate || endDate) {
    // build inclusive date array
    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date();
    // normalize time to UTC midnight to match DATE() output
    const toYMD = (d) => {
      const yy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yy}-${mm}-${dd}`;
    };

    const days = [];
    const cur = new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate()));
    const last = new Date(Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()));
    while (cur <= last) {
      days.push(toYMD(cur));
      cur.setUTCDate(cur.getUTCDate() + 1);
    }

    const rowMap = new Map(plainRows.map((r) => [String(r.date), r]));
    return days.map((d) => {
      const r = rowMap.get(d);
      return {
        date: d,
        orderCount: r ? Number(r.orderCount) || 0 : 0,
        totalSales: r ? Number(r.totalSales) || 0 : 0
      };
    });
  }

  return plainRows.map((r) => ({
    date: String(r.date),
    orderCount: Number(r.orderCount) || 0,
    totalSales: Number(r.totalSales) || 0
  }));
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
