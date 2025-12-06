const { Router } = require('express');
const {
  fetchMetrics,
  fetchOrdersByDate,
  fetchTopCustomers,
  fetchAllOrders,
  fetchAllCustomers
} = require('../controllers/metricController');
const authMiddleware = require('../middlewares/authMiddleware');
const tenantMiddleware = require('../middlewares/tenantMiddleware');

const router = Router();

router.get('/', authMiddleware, tenantMiddleware, fetchMetrics);
router.get('/orders-by-date', authMiddleware, tenantMiddleware, fetchOrdersByDate);
router.get('/top-customers', authMiddleware, tenantMiddleware, fetchTopCustomers);
router.get('/orders', authMiddleware, tenantMiddleware, fetchAllOrders);
router.get('/customers', authMiddleware, tenantMiddleware, fetchAllCustomers);

module.exports = router;
