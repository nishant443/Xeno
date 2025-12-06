const bcrypt = require('bcryptjs');
const { Tenant } = require('../models');

const listTenants = async (req, res, next) => {
  try {
    const tenants = await Tenant.findAll({
      attributes: { exclude: ['adminPasswordHash'] }
    });
    res.json(tenants);
  } catch (error) {
    next(error);
  }
};

const createTenant = async (req, res, next) => {
  try {
    const {
      adminPassword,
      ...rest
    } = req.body;

    if (!adminPassword) {
      return res.status(400).json({ message: 'adminPassword is required' });
    }

    const tenant = await Tenant.create({
      ...rest,
      adminPasswordHash: await bcrypt.hash(adminPassword, 10)
    });

    const plain = tenant.get({ plain: true });
    delete plain.adminPasswordHash;

    res.status(201).json(plain);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listTenants,
  createTenant
};
