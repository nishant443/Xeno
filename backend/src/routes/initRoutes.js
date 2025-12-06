const { Router } = require('express');
const { initializeDatabase, fillSampleData, updateTenant, clearTenantData } = require('../controllers/initController');

const router = Router();

// Initialize database with test data if empty
// Support both GET (convenient for browser testing) and POST (for programmatic usage)
router.get('/initialize', initializeDatabase);
router.post('/initialize', initializeDatabase);

// Create demo/sample records (customers, products, orders, events)
// Optional query param: tenantId to target a specific tenant
router.get('/sample', fillSampleData);

// Update tenant with real Shopify credentials
// Query params: shopDomain, accessToken (optional: tenantId)
router.get('/update-tenant', updateTenant);

// Clear all data for a tenant (customers, orders, products, events)
// Optional query param: tenantId
router.get('/clear-data', clearTenantData);

module.exports = router;
