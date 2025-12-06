const { Router } = require('express');
const { authenticate } = require('../controllers/authController');

const router = Router();

router.post('/login', authenticate);

module.exports = router;
