const { body } = require('express-validator');

const validation = {
  // Product validation
  validateProduct: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Product name is required')
      .isLength({ max: 100 })
      .withMessage('Product name cannot exceed 100 characters'),
    
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Product description is required')
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),
    
    body('price')
      .isNumeric()
      .withMessage('Price must be a number')
      .custom((value) => {
        if (value < 0) {
          throw new Error('Price must be positive');
        }
        return true;
      }),
    
    body('category')
      .notEmpty()
      .withMessage('Product category is required')
      .isIn(['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Other'])
      .withMessage('Invalid category'),
    
    body('stock')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Stock must be a non-negative integer'),
    
    body('image')
      .optional()
      .isURL()
      .withMessage('Image must be a valid URL')
  ],

  // Cart submission validation
  validateCartSubmission: [
    body('customerName')
      .trim()
      .notEmpty()
      .withMessage('Customer name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Customer name must be between 2 and 100 characters'),
    
    body('customerEmail')
      .trim()
      .isEmail()
      .withMessage('Valid email is required')
      .normalizeEmail(),
    
    body('items')
      .isArray({ min: 1 })
      .withMessage('Cart must contain at least one item'),
    
    body('items.*.productId')
      .notEmpty()
      .withMessage('Product ID is required')
      .isMongoId()
      .withMessage('Invalid product ID'),
    
    body('items.*.quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be at least 1')
  ],

  // Cart review validation
  validateCartReview: [
    body('status')
      .notEmpty()
      .withMessage('Status is required')
      .isIn(['approved', 'declined'])
      .withMessage('Status must be either approved or declined'),
    
    body('reviewedBy')
      .trim()
      .notEmpty()
      .withMessage('Reviewer name is required'),
    
    body('notes')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Notes cannot exceed 500 characters')
  ],

  // User registration validation
  validateUserRegistration: [
    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username is required')
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username can only contain letters, numbers, and underscores'),
    
    body('email')
      .trim()
      .isEmail()
      .withMessage('Valid email is required')
      .normalizeEmail(),
    
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    
    body('role')
      .optional()
      .isIn(['admin', 'customer'])
      .withMessage('Role must be either admin or customer')
  ],

  // User login validation
  validateUserLogin: [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Valid email is required')
      .normalizeEmail(),
    
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ]
};

module.exports = validation;