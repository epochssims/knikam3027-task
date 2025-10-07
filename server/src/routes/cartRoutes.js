const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { adminAuth } = require('../middleware/auth');
const { validateCartSubmission, validateCartReview } = require('../middleware/validation');

// Public routes
router.post('/submit', validateCartSubmission, cartController.submitCart);
router.get('/:id', cartController.getCartById);

// Admin only routes
router.get('/', adminAuth, cartController.getAllCarts);
router.put('/:id/review', adminAuth, validateCartReview, cartController.reviewCart);
router.get('/admin/stats', adminAuth, cartController.getCartStats);

module.exports = router;