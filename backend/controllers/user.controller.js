// File: backend/controllers/user.controller.js

const db = require('../models');
const User = db.User;
const Order = db.Order;
const OrderItem = db.OrderItem;
const Product = db.Product;

// <-- CHÚ THÍCH: HÀM NÀY GIỮ NGUYÊN -->
// Chức năng: Lấy thông tin hồ sơ của người dùng đang đăng nhập.
exports.getProfile = async (req, res) => {
    try {
        // req.userId được lấy từ token sau khi đi qua middleware `isAuthenticated`.
        const user = await User.findByPk(req.userId, {
            // Luôn luôn không trả về mật khẩu để đảm bảo an toàn.
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).send({ message: "Không tìm thấy người dùng." });
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// <-- CHÚ THÍCH: HÀM NÀY GIỮ NGUYÊN -->
// Chức năng: Lấy lịch sử đơn hàng của người dùng đang đăng nhập.
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            // Lọc các đơn hàng chỉ thuộc về user này.
            where: { userId: req.userId },
            // Sắp xếp đơn hàng mới nhất lên đầu.
            order: [['createdAt', 'DESC']],
            // Lấy kèm dữ liệu từ các bảng liên quan để hiển thị chi tiết.
            include: [{
                model: OrderItem,
                as: 'items', // Bao gồm các sản phẩm trong đơn hàng.
                include: [{
                    model: Product,
                    as: 'product', // Trong mỗi sản phẩm, lấy thông tin cơ bản.
                    attributes: ['id', 'name', 'imageUrl']
                }]
            }]
        });
        res.status(200).send(orders);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// <-- CHÚ THÍCH: HÀM NÀY LÀ HÀM MỚI ĐỂ PHỤC VỤ TRANG ADMIN -->
// Chức năng: [ADMIN] Lấy danh sách tất cả người dùng trong hệ thống.
// Hàm này sẽ được gọi từ trang Quản lý Người dùng của Admin.
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            // Sắp xếp theo ID.
            order: [['id', 'ASC']],
            // Luôn loại bỏ mật khẩu khi trả về danh sách.
            attributes: { exclude: ['password'] }
        });
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};