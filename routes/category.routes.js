
const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/category.controller');

// Get all categories
router.get('/', categoryController.getAll);

// Get one category by ID
router.get('/:id', categoryController.getById);

// Create a category
router.post('/', categoryController.create);

// Update a category
router.put('/:id', categoryController.update);

// Delete a category
router.delete('/:id', categoryController.remove);

module.exports = router;
