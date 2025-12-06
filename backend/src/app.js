const express = require('express');
const cors = require('cors');
const tenantRoutes = require('./routes/tenantRoutes');
const ingestionRoutes = require('./routes/ingestionRoutes');
const metricRoutes = require('./routes/metricRoutes');
const authRoutes = require('./routes/authRoutes');
const initRoutes = require('./routes/initRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// CORS FIX
const allowedOrigins = [
    "http://localhost:5173",
    "https://xeno-frontend-yypm.onrender.com"
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// FIX health route
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// API Routes
app.use('/api/tenants', tenantRoutes);
app.use('/api/ingestion', ingestionRoutes);
app.use('/api/metrics', metricRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/init', initRoutes);

app.use(errorHandler);

module.exports = app;
