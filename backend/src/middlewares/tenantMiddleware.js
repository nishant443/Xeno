module.exports = (req, res, next) => {
  if (!req.authenticatedTenant) {
    return res.status(400).json({ message: 'Tenant missing in request context' });
  }

  req.tenant = req.authenticatedTenant;
  next();
};
