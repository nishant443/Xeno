const { Router } = require('express');
const { initializeDatabase, fillSampleData } = require('../controllers/initController');

const router = Router();

// Initialize database with test data if empty
// Support both GET (convenient for browser testing) and POST (for programmatic usage)
router.get('/initialize', initializeDatabase);
router.post('/initialize', initializeDatabase);

// Create demo/sample records (customers, products, orders, events)
// Optional query param: tenantId to target a specific tenant
router.get('/sample', fillSampleData);

module.exports = router;
