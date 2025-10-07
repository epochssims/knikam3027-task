const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { adminAuth } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validation');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/categories', productController.getCategories);
router.get('/:id', productController.getProductById);

// Admin only routes
router.post('/', adminAuth, validateProduct, productController.createProduct);
router.put('/:id', adminAuth, validateProduct, productController.updateProduct);
router.delete('/:id', adminAuth, productController.deleteProduct);

module.exports = router;