const logger = require('../config/logger');
const { ingestTenantData } = require('../services/ingestionService');
const { Tenant } = require('../models');

const scheduleIngestionJobs = (intervalMs = 1000 * 60 * 30) => {
  setInterval(async () => {
    const tenants = await Tenant.findAll({ where: { status: 'active' } });
    for (const tenant of tenants) {
      try {
        await ingestTenantData(tenant.id);
      } catch (error) {
        logger.error(`Failed to ingest tenant ${tenant.shopDomain}: ${error.message}`);
      }
    }
  }, intervalMs);

  logger.info(`Scheduled ingestion job every ${intervalMs / 60000} minutes`);
};

module.exports = {
  scheduleIngestionJobs
};
