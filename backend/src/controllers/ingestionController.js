const { ingestTenantData } = require('../services/ingestionService');

const triggerIngestion = async (req, res, next) => {
  try {
    const stats = await ingestTenantData(req.tenant.id);
    res.json({ status: 'ok', stats });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  triggerIngestion
};
