const express = require('express');
const router = express.Router();

let orders = [];

router.post('/', (req, res) => {
  const { userId, items, totalAmount } = req.body;
  const newOrder = {
    id: orders.length + 1,
    userId,
    items,
    totalAmount,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  orders.push(newOrder);
  req.app.emit('audit', { action: 'ORDER_CREATED', orderId: newOrder.id, userId });
  res.status(201).json({ success: true, data: newOrder });
});

router.get('/:id', (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  res.json({ success: true, data: order });
});

module.exports = router;
