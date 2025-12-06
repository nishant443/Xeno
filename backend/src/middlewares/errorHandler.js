const logger = require('../config/logger');

module.exports = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  logger.error(err.message);

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
};
