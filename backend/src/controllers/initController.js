const bcryptjs = require('bcryptjs');
const { Tenant } = require('../models');
const env = require('../config/env');
const logger = require('../config/logger');

/**
 * Initialize database with test tenant if empty
 * Safe to call multiple times - will only create if table is empty
 */
const initializeDatabase = async (req, res) => {
  try {
    logger.info('🔧 Initialization endpoint called');

    // Check if any tenants exist
    const existingTenants = await Tenant.findAll({ limit: 1 });

    if (existingTenants.length > 0) {
      logger.info('✅ Database already initialized with tenants');
      return res.json({
        status: 'already_initialized',
        message: 'Database already has tenants',
        tenantCount: existingTenants.length
      });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash('password123', 10);

    // Create test tenant
    const testTenant = await Tenant.create({
      name: 'Test Store',
      shopDomain: 'test-store.myshopify.com',
      accessToken: 'shpat_test123456789',
      adminEmail: 'admin@teststore.com',
      adminPasswordHash: hashedPassword,
      status: 'active'
    });

    logger.info('✅ Test tenant created during initialization');

    res.json({
      status: 'initialized',
      message: 'Database initialized with test tenant',
      credentials: {
        email: 'admin@teststore.com',
        password: 'password123'
      },
      tenant: {
        id: testTenant.id,
        name: testTenant.name,
        shopDomain: testTenant.shopDomain
      }
    });
  } catch (error) {
    logger.error('❌ Initialization failed:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Initialization failed',
      error: error.message
    });
  }
};

/**
 * Create demo/sample data for a tenant so dashboard shows meaningful values
 * Safe to call multiple times — uses upsert semantics where possible
 */
const fillSampleData = async (req, res) => {
  try {
    logger.info('🔧 Fill sample data endpoint called');

    const tenantId = req.query.tenantId;
    let tenant;
    if (tenantId) {
      tenant = await Tenant.findByPk(tenantId);
    } else {
      const found = await Tenant.findOne();
      tenant = found;
    }

    if (!tenant) {
      return res.status(404).json({ status: 'error', message: 'Tenant not found' });
    }

    const { Customer, Product, Order, CustomEvent } = require('../models');

    // Simple in-memory sample data
    const customers = [
      { id: 1001, tenantId: tenant.id, firstName: 'Nishant', lastName: 'Kumar', email: 'nishant@example.com', totalSpent: 250.00 },
      { id: 1002, tenantId: tenant.id, firstName: 'Asha', lastName: 'Patel', email: 'asha@example.com', totalSpent: 420.50 },
      { id: 1003, tenantId: tenant.id, firstName: 'Liam', lastName: 'Ng', email: 'liam@example.com', totalSpent: 75.99 }
    ];

    const products = [
      { id: 2001, tenantId: tenant.id, title: 'Blue Hoodie', vendor: 'Acme', inventoryQuantity: 12 },
      { id: 2002, tenantId: tenant.id, title: 'Coffee Mug', vendor: 'Acme', inventoryQuantity: 48 },
      { id: 2003, tenantId: tenant.id, title: 'Sticker Pack', vendor: 'Acme', inventoryQuantity: 150 }
    ];

    const now = new Date();
    const orders = [
      { id: 30001, tenantId: tenant.id, customerId: 1001, totalPrice: 120.00, currency: 'USD', processedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7) },
      { id: 30002, tenantId: tenant.id, customerId: 1002, totalPrice: 220.50, currency: 'USD', processedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 6) },
      { id: 30003, tenantId: tenant.id, customerId: 1001, totalPrice: 130.00, currency: 'USD', processedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3) },
      { id: 30004, tenantId: tenant.id, customerId: 1003, totalPrice: 75.99, currency: 'USD', processedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2) }
    ];

    const events = [
      { tenantId: tenant.id, externalId: 'evt-1', type: 'checkout_started', status: 'open', occurredAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2), payload: { note: 'Started checkout' } },
      { tenantId: tenant.id, externalId: 'evt-2', type: 'cart_abandoned', status: 'abandoned', occurredAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1), payload: { note: 'Abandoned cart' } }
    ];

    // Upsert records (use upsert to avoid duplicate PK errors)
    for (const c of customers) {
      await Customer.upsert(c);
    }
    for (const p of products) {
      await Product.upsert(p);
    }
    for (const o of orders) {
      await Order.upsert(o);
    }
    for (const e of events) {
      await CustomEvent.upsert(e);
    }

    tenant.lastSyncedAt = new Date();
    await tenant.save();

    logger.info('✅ Sample data inserted');

    return res.json({ status: 'ok', message: 'Sample data created', counts: { customers: customers.length, products: products.length, orders: orders.length, events: events.length } });
  } catch (error) {
    logger.error('❌ Fill sample data failed:', error.message);
    return res.status(500).json({ status: 'error', message: 'Fill sample data failed', error: error.message });
  }
};

module.exports = {
  initializeDatabase,
  fillSampleData
};
