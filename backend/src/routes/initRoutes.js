const { Router } = require('express');
const { initializeDatabase } = require('../controllers/initController');

const router = Router();

// Initialize database with test data if empty
// Support both GET (convenient for browser testing) and POST (for programmatic usage)
router.get('/initialize', initializeDatabase);
router.post('/initialize', initializeDatabase);

module.exports = router;
