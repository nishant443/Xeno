const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CustomEvent = sequelize.define('CustomEvent', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    tenantId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    externalId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true
    },
    occurredAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    payload: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    tableName: 'custom_events',
    indexes: [
      {
        unique: true,
        fields: ['tenantId', 'externalId', 'type']
      }
    ]
  });

  return CustomEvent;
};

