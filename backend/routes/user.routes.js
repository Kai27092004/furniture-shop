const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');
const { isAuthenticated } = require('../middleware/auth.middleware');

// Các route này yêu cầu người dùng phải đăng nhập
router.use(isAuthenticated);

router.get('/profile', controller.getProfile);
router.get('/my-orders', controller.getMyOrders);

module.exports = router;