const {
  getDashboardMetrics,
  getOrdersByDate,
  getTopCustomers,
  getAllOrders,
  getAllCustomers
} = require('../services/metricService');

const fetchMetrics = async (req, res, next) => {
  try {
    const metrics = await getDashboardMetrics(req.tenant.id);
    res.json(metrics);
  } catch (error) {
    next(error);
  }
};

const fetchOrdersByDate = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await getOrdersByDate(req.tenant.id, startDate, endDate);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const fetchTopCustomers = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 5;
    const customers = await getTopCustomers(req.tenant.id, limit);
    res.json(customers);
  } catch (error) {
    next(error);
  }
};

const fetchAllOrders = async (req, res, next) => {
  try {
    const orders = await getAllOrders(req.tenant.id);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const fetchAllCustomers = async (req, res, next) => {
  try {
    const customers = await getAllCustomers(req.tenant.id);
    res.json(customers);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  fetchMetrics,
  fetchOrdersByDate,
  fetchTopCustomers,
  fetchAllOrders,
  fetchAllCustomers
};
