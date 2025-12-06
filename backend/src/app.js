const express = require('express');
const cors = require('cors');
const tenantRoutes = require('./routes/tenantRoutes');
const ingestionRoutes = require('./routes/ingestionRoutes');
const metricRoutes = require('./routes/metricRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/tenants', tenantRoutes);
app.use('/api/ingestion', ingestionRoutes);
app.use('/api/metrics', metricRoutes);
app.use('/api/auth', authRoutes);

app.use(errorHandler);

module.exports = app;
