const express = require('express');
const router = express.Router();

let categories = [
  { id: 1, name: 'Electronics', status: 'Active' },
  { id: 2, name: 'Groceries', status: 'Active' }
];

router.get('/', (req, res) => {
  res.json({ success: true, data: categories });
});

router.post('/', (req, res) => {
  const { name } = req.body;
  const newCategory = { id: categories.length + 1, name, status: 'Active' };
  categories.push(newCategory);
  res.status(201).json({ success: true, data: newCategory });
});

module.exports = router;
