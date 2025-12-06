const sequelize = require('../config/db');
const Tenant = require('./Tenant')(sequelize);
const Customer = require('./Customer')(sequelize);
const Order = require('./Order')(sequelize);
const Product = require('./Product')(sequelize);
const CustomEvent = require('./CustomEvent')(sequelize);

Tenant.hasMany(Customer, { foreignKey: 'tenantId' });
Tenant.hasMany(Order, { foreignKey: 'tenantId' });
Tenant.hasMany(Product, { foreignKey: 'tenantId' });
Tenant.hasMany(CustomEvent, { foreignKey: 'tenantId' });

Customer.belongsTo(Tenant, { foreignKey: 'tenantId' });
Order.belongsTo(Tenant, { foreignKey: 'tenantId' });
Order.belongsTo(Customer, { foreignKey: 'customerId' });
Product.belongsTo(Tenant, { foreignKey: 'tenantId' });
CustomEvent.belongsTo(Tenant, { foreignKey: 'tenantId' });

module.exports = {
  sequelize,
  Tenant,
  Customer,
  Order,
  Product,
  CustomEvent
};
