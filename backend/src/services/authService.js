const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Tenant } = require('../models');
const env = require('../config/env');

const loginWithEmail = async (email, password) => {
  const tenant = await Tenant.findOne({ where: { adminEmail: email } });
  if (!tenant) {
    return null;
  }

  const isValid = await bcrypt.compare(password, tenant.adminPasswordHash);
  if (!isValid) {
    return null;
  }

  const token = jwt.sign({ tenantId: tenant.id }, env.jwtSecret, { expiresIn: '12h' });

  return { tenant, token };
};

module.exports = {
  loginWithEmail
};
