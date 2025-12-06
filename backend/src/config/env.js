const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const candidatePaths = [
  path.resolve(__dirname, '../../.env'),
  path.resolve(process.cwd(), '.env')
];

for (const envPath of candidatePaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

const number = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: number(process.env.PORT, 4000),
  jwtSecret: process.env.JWT_SECRET || 'dev_secret',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: number(process.env.DB_PORT, 3306),
    name: process.env.DB_NAME || 'xeno',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  },
  shopify: {
    apiKey: process.env.SHOPIFY_API_KEY || '',
    apiSecret: process.env.SHOPIFY_API_SECRET || '',
    accessToken: process.env.SHOPIFY_ACCESS_TOKEN || ''
  },
  webhookSecret: process.env.WEBHOOK_SECRET || ''
};

module.exports = config;
