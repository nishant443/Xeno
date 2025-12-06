const env = require('./config/env');
const logger = require('./config/logger');
const app = require('./app');
const { sequelize } = require('./models');
const { scheduleIngestionJobs } = require('./utils/cronJobs');

const connectWithRetry = async (maxRetries = 5, delayMs = 2000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.info(`Attempt ${attempt}/${maxRetries} to connect to database...`);
      await sequelize.authenticate();
      logger.info('✅ Database connected successfully');
      return;
    } catch (error) {
      logger.warn(
        `❌ Connection attempt ${attempt} failed: ${error.message}\n` +
        `Check DB_HOST=${env.db.host}, DB_PORT=${env.db.port}, DB_NAME=${env.db.name}`
      );
      
      if (attempt < maxRetries) {
        const delay = delayMs * Math.pow(2, attempt - 1);
        logger.info(`Retrying in ${delay / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
};

const start = async () => {
  try {
    await connectWithRetry();
    await sequelize.sync();

    const PORT = process.env.PORT || env.port;

    app.listen(PORT, () => {
      logger.info(`Server listening on http://localhost:${PORT}`);
    });

    scheduleIngestionJobs();
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    logger.error(`DB Configuration: HOST=${env.db.host}, PORT=${env.db.port}, DB=${env.db.name}, USER=${env.db.user}`);
    process.exit(1);
  }
};

start();
