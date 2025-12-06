const env = require('./config/env');
const logger = require('./config/logger');
const app = require('./app');
const { sequelize } = require('./models');
const { scheduleIngestionJobs } = require('./utils/cronJobs');

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(env.port, () => {
      logger.info(`Server listening on http://localhost:${env.port}`);
    });
    scheduleIngestionJobs();
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

start();
