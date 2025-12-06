const crypto = require('crypto');
const env = require('../../config/env');
const logger = require('../../config/logger');

const verifySignature = (rawBody, signature) => {
  const digest = crypto
    .createHmac('sha256', env.webhookSecret)
    .update(rawBody, 'utf8')
    .digest('base64');

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
};

const handleWebhook = async (topic, rawBody) => {
  logger.info(`Received webhook topic=${topic}`);
  // extend with business logic as needed
};

module.exports = {
  verifySignature,
  handleWebhook
};
