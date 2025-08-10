// File: backend/routes/product.routes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/product.controller');
const { isAuthenticated, isAdmin } = require('../middleware/auth.middleware');

router.get('/', controller.getAllProducts);
router.get('/:id', controller.getProductById);

// Route này yêu cầu phải đăng nhập và là Admin
router.post('/', [isAuthenticated, isAdmin], controller.createProduct);

module.exports = router;