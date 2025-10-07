const express = require('express');
const router = express.Router();

// Import route modules
const productRoutes = require('./productRoutes');
const cartRoutes = require('./cartRoutes');
const authRoutes = require('./authRoutes');

// API Routes
router.use('/products', productRoutes);
router.use('/carts', cartRoutes);
router.use('/auth', authRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Shopping Cart API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 404 handler for API routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

module.exports = router;