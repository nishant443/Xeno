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
	// Inline implementation to avoid Export/caching issues on deployed server
	(async () => {
		try {
			const { Tenant, Customer, Product, Order, CustomEvent } = require('../models');
			const { Op } = require('sequelize');

			const demoTenants = await Tenant.findAll({
				where: {
					[Op.or]: [
						{ shopDomain: 'test-store.myshopify.com' },
						{ accessToken: { [Op.like]: '%shpat_test%' } },
						{ adminEmail: 'admin@teststore.com' }
					]
				}
			});

			if (!demoTenants || demoTenants.length === 0) {
				return res.json({ status: 'ok', message: 'No demo tenants found', cleared: {} });
			}

			let totals = { customers: 0, orders: 0, products: 0, events: 0, tenants: demoTenants.length };

			for (const tenant of demoTenants) {
				const tid = tenant.id;
				const [customersDeleted, ordersDeleted, productsDeleted, eventsDeleted] = await Promise.all([
					Customer.destroy({ where: { tenantId: tid } }),
					Order.destroy({ where: { tenantId: tid } }),
					Product.destroy({ where: { tenantId: tid } }),
					CustomEvent.destroy({ where: { tenantId: tid } })
				]);

				totals.customers += customersDeleted;
				totals.orders += ordersDeleted;
				totals.products += productsDeleted;
				totals.events += eventsDeleted;
			}

			return res.json({ status: 'ok', message: 'Demo data cleaned', cleared: totals });
		} catch (err) {
			return res.status(500).json({ status: 'error', message: 'Clean demo failed', error: err.message });
		}
	})();
});

module.exports = router;
