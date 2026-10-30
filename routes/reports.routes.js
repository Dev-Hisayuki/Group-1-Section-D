const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res) => {
  const reportData = {
    totalSales: 15400,
    totalOrders: 120,
    activeUsers: 45,
    topCategory: 'Electronics',
    recentActivity: [
      { orderId: 101, user: 'John Doe', amount: 250, date: new Date() },
      { orderId: 102, user: 'Jane Smith', amount: 120, date: new Date() }
    ]
  };

  res.json({ success: true, report: reportData });
});

module.exports = router;
