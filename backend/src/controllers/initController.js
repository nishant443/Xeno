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

module.exports = {
  initializeDatabase
};
