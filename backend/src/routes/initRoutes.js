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

// Clean demo records for tenants created by initializer
// This removes only demo tenant records (based on shopDomain/accessToken/adminEmail)
router.get('/clean-demo', (req, res) => {
	// route wiring will call controller
	const { cleanDemoData } = require('../controllers/initController');
	return cleanDemoData(req, res);
});

module.exports = router;
