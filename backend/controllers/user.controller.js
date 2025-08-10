const db = require('../models');
const User = db.User;
// Tạm thời chưa cần Order, sẽ thêm sau
// const Order = db.Order; 
// const OrderItem = db.OrderItem;
// const Product = db.Product;

// Lấy thông tin profile của user đang đăng nhập
exports.getProfile = async (req, res) => {
    try {
        // req.userId được gắn vào từ middleware isAuthenticated
        const user = await User.findByPk(req.userId, {
            // Không trả về mật khẩu
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

// Lấy lịch sử đơn hàng của user đang đăng nhập
// CHÚNG TA SẼ HOÀN THIỆN HÀM NÀY SAU KHI CÓ LOGIC ĐẶT HÀNG
exports.getMyOrders = async (req, res) => {
    // Tạm thời trả về mảng rỗng
    res.status(200).send([]);
};