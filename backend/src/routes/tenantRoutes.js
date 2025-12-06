const { Router } = require('express');
const { listTenants, createTenant } = require('../controllers/tenantController');

const router = Router();

router.get('/', listTenants);
router.post('/', createTenant);

module.exports = router;
