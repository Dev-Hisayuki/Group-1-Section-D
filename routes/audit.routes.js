const express = require('express');
const router = express.Router();
const { auditLogs } = require('../middleware/audit');

router.get('/logs', (req, res) => {
  res.json({ success: true, logs: auditLogs });
});

module.exports = router;
