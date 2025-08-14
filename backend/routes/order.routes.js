const express = require('express');
const router = express.Router();
const controller = require('../controllers/order.controller');
const { isAuthenticated } = require('../middleware/auth.middleware');

// Route để tạo đơn hàng mới, yêu cầu phải đăng nhập
router.post('/', isAuthenticated, controller.createOrder);
// <-- THÊM MỚI: Route để hủy đơn hàng, yêu cầu đăng nhập
router.put('/:orderId/cancel', isAuthenticated, controller.cancelOrder);
router.put('/:orderId/status', isAuthenticated, controller.updateOrderStatus);


module.exports = router;