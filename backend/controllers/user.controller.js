// File: backend/controllers/user.controller.js

const db = require('../models');
const User = db.User;

// <-- CHÚ THÍCH: Bỏ comment các dòng này để có thể sử dụng các model Order, OrderItem và Product.
const Order = db.Order; 
const OrderItem = db.OrderItem;
const Product = db.Product;

// Lấy thông tin profile của user đang đăng nhập (Hàm này đã đúng, giữ nguyên)
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.userId, {
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

// <-- CHÚ THÍCH: Toàn bộ hàm getMyOrders dưới đây đã được viết lại hoàn toàn.
// Chức năng: Lấy lịch sử tất cả đơn hàng của người dùng đang đăng nhập.
exports.getMyOrders = async (req, res) => {
    try {
        // <-- CHÚ THÍCH: Sử dụng hàm `findAll` của model Order để tìm tất cả đơn hàng.
        const orders = await Order.findAll({
            // <-- CHÚ THÍCH: Điều kiện `where` để lọc đơn hàng theo `userId`. 
            // `req.userId` được lấy từ middleware `isAuthenticated` sau khi giải mã token.
            where: { userId: req.userId },

            // <-- CHÚ THÍCH: Sắp xếp kết quả trả về. Đơn hàng mới nhất sẽ được xếp lên đầu.
            order: [['createdAt', 'DESC']], 
            
            // <-- CHÚ THÍCH: Dùng `include` để lấy dữ liệu từ các bảng liên quan (giống như JOIN trong SQL).
            include: [{
                // <-- CHÚ THÍCH: Lấy các bản ghi trong bảng OrderItem liên quan đến đơn hàng này.
                // 'as: items' phải khớp với alias bạn đã định nghĩa trong `models/index.js`.
                model: OrderItem,
                as: 'items',
                include: [{
                    // <-- CHÚ THÍCH: Trong mỗi OrderItem, lại lấy tiếp thông tin sản phẩm từ bảng Product.
                    model: Product,
                    as: 'product',
                    // <-- CHÚ THÍCH: Chỉ lấy những thuộc tính cần thiết của sản phẩm để giảm dung lượng dữ liệu trả về.
                    attributes: ['id', 'name', 'imageUrl'] 
                }]
            }]
        });

        // <-- CHÚ THÍCH: Trả về danh sách đơn hàng đã tìm thấy với status code 200 (OK).
        res.status(200).send(orders);
    } catch (error) {
        // <-- CHÚ THÍCH: Bắt lỗi nếu có bất kỳ vấn đề nào xảy ra trong quá trình truy vấn.
        res.status(500).send({ message: error.message });
    }
};