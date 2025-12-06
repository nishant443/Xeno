require('dotenv').config();
const bcryptjs = require('bcryptjs');
const { sequelize, Tenant } = require('./src/models');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Sync models
    await sequelize.sync();
    console.log('✅ Models synced');

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

    console.log('✅ Test tenant created:');
    console.log(`   Email: admin@teststore.com`);
    console.log(`   Password: password123`);
    console.log(`   Tenant ID: ${testTenant.id}`);

    await sequelize.close();
    console.log('✅ Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
