const jwt = require('jsonwebtoken');
const { Tenant } = require('../models');
const env = require('../config/env');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: 'Missing auth token' });
    }

    const payload = jwt.verify(token, env.jwtSecret);
    const tenant = await Tenant.findByPk(payload.tenantId);

    if (!tenant) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.authenticatedTenant = tenant;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    next(error);
  }
};
