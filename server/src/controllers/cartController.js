const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { validationResult } = require('express-validator');

const cartController = {
  // Submit cart for approval
  submitCart: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { customerName, customerEmail, items } = req.body;

      // Validate products and get current prices
      const cartItems = [];
      for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product with ID ${item.productId} not found`
          });
        }

        if (!product.isActive) {
          return res.status(400).json({
            success: false,
            message: `Product ${product.name} is not available`
          });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
          });
        }

        cartItems.push({
          product: product._id,
          quantity: item.quantity,
          price: product.price
        });
      }

      // Create cart
      const cart = new Cart({
        customerName,
        customerEmail,
        items: cartItems
      });

      await cart.save();
      
      // Populate product details for response
      await cart.populate('items.product');

      res.status(201).json({
        success: true,
        message: 'Cart submitted successfully for approval',
        data: cart
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error submitting cart',
        error: error.message
      });
    }
  },

  // Get all carts (Admin only)
  getAllCarts: async (req, res) => {
    try {
      const { status, page = 1, limit = 10 } = req.query;
      const filter = {};
      
      if (status) {
        filter.status = status;
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
        populate: {
          path: 'items.product',
          select: 'name price category image'
        }
      };

      const carts = await Cart.find(filter)
        .populate('items.product')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Cart.countDocuments(filter);

      res.json({
        success: true,
        data: carts,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching carts',
        error: error.message
      });
    }
  },

  // Get single cart
  getCartById: async (req, res) => {
    try {
      const cart = await Cart.findById(req.params.id)
        .populate('items.product');

      if (!cart) {
        return res.status(404).json({
          success: false,
          message: 'Cart not found'
        });
      }

      res.json({
        success: true,
        data: cart
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching cart',
        error: error.message
      });
    }
  },

  // Approve or decline cart (Admin only)
  reviewCart: async (req, res) => {
    try {
      const { status, notes, reviewedBy } = req.body;

      if (!['approved', 'declined'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status must be either approved or declined'
        });
      }

      const cart = await Cart.findById(req.params.id);

      if (!cart) {
        return res.status(404).json({
          success: false,
          message: 'Cart not found'
        });
      }

      if (cart.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Cart has already been reviewed'
        });
      }

      // If approved, check stock availability again
      if (status === 'approved') {
        for (const item of cart.items) {
          const product = await Product.findById(item.product);
          if (!product || product.stock < item.quantity) {
            return res.status(400).json({
              success: false,
              message: `Insufficient stock for product ID: ${item.product}`
            });
          }
        }

        // Update stock for approved cart
        for (const item of cart.items) {
          await Product.findByIdAndUpdate(
            item.product,
            { $inc: { stock: -item.quantity } }
          );
        }
      }

      cart.status = status;
      cart.notes = notes;
      cart.reviewedBy = reviewedBy;
      cart.reviewedAt = new Date();

      await cart.save();
      await cart.populate('items.product');

      res.json({
        success: true,
        message: `Cart ${status} successfully`,
        data: cart
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error reviewing cart',
        error: error.message
      });
    }
  },

  // Get cart statistics (Admin only)
  getCartStats: async (req, res) => {
    try {
      const stats = await Cart.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$totalAmount' }
          }
        }
      ]);

      const formattedStats = {
        pending: 0,
        approved: 0,
        declined: 0,
        totalRevenue: 0
      };

      stats.forEach(stat => {
        formattedStats[stat._id] = stat.count;
        if (stat._id === 'approved') {
          formattedStats.totalRevenue = stat.totalAmount;
        }
      });

      res.json({
        success: true,
        data: formattedStats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching cart statistics',
        error: error.message
      });
    }
  }
};

module.exports = cartController;