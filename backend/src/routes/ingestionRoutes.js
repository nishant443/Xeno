const { Router } = require('express');
const { triggerIngestion } = require('../controllers/ingestionController');
const authMiddleware = require('../middlewares/authMiddleware');
const tenantMiddleware = require('../middlewares/tenantMiddleware');

const router = Router();

router.post('/run', authMiddleware, tenantMiddleware, triggerIngestion);

module.exports = router;
