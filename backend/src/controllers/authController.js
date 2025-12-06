const { loginWithEmail } = require('../services/authService');

const authenticate = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await loginWithEmail(email, password);

    if (!result) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      tenantId: result.tenant.id,
      shopDomain: result.tenant.shopDomain,
      email: result.tenant.adminEmail,
      authToken: result.token
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticate
};
