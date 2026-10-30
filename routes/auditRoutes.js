const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');

router.get('/audit-logs', auditController.getLogs);
router.post('/audit-logs', auditController.createLog);

module.exports = router;

