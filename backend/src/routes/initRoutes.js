const { Router } = require('express');
const { initializeDatabase } = require('../controllers/initController');

const router = Router();

// Initialize database with test data if empty
router.post('/initialize', initializeDatabase);

module.exports = router;
