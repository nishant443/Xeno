const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Tenant = sequelize.define('Tenant', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    shopDomain: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    accessToken: {
      type: DataTypes.STRING,
      allowNull: false
    },
    adminEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    adminPasswordHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'active', 'disabled'),
      defaultValue: 'pending'
    },
    lastSyncedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'tenants'
  });

  return Tenant;
};
