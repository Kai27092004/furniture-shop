// File: backend/controllers/order.controller.js

const db = require('../models');

// --- HÀM 1: TẠO ĐƠN HÀNG MỚI (Code của bạn, đã hoạt động tốt) ---
// Chức năng: Xử lý logic khi người dùng xác nhận đặt hàng từ giỏ hàng.
exports.createOrder = async (req, res) => {
    const userId = req.userId; // Lấy từ middleware xác thực
    const { cartItems, shippingAddress } = req.body;

    // Bắt đầu một transaction để đảm bảo toàn vẹn dữ liệu
    const t = await db.sequelize.transaction();

    try {
        // BƯỚC 1: TÍNH TỔNG TIỀN Ở SERVER ĐỂ ĐẢM BẢO AN TOÀN
        let totalAmount = 0;
        const productIds = cartItems.map(item => item.id);
        const products = await db.Product.findAll({ where: { id: productIds } });
        
        for (const cartItem of cartItems) {
            const product = products.find(p => p.id === cartItem.id);
            if (!product) {
                throw new Error(`Sản phẩm với ID ${cartItem.id} không tồn tại.`);
            }
            if (product.stockQuantity < cartItem.quantity) {
                throw new Error(`Không đủ số lượng cho sản phẩm: ${product.name}. Chỉ còn ${product.stockQuantity} sản phẩm.`);
            }
            totalAmount += product.price * cartItem.quantity;
        }

        // BƯỚC 2: TẠO ĐƠN HÀNG (ORDER)
        const order = await db.Order.create({
            userId,
            totalAmount,
            shippingAddress
        }, { transaction: t });

        // BƯỚC 3: TẠO CHI TIẾT ĐƠN HÀNG (ORDER ITEMS) VÀ CẬP NHẬT KHO
        for (const cartItem of cartItems) {
            const product = products.find(p => p.id === cartItem.id);
            // Tạo chi tiết đơn hàng
            await db.OrderItem.create({
                orderId: order.id,
                productId: product.id,
                quantity: cartItem.quantity,
                price: product.price // Lấy giá từ database, không tin tưởng giá từ client
            }, { transaction: t });

            // Cập nhật số lượng tồn kho
            product.stockQuantity -= cartItem.quantity;
            await product.save({ transaction: t });
        }

        // Nếu mọi thứ thành công, commit transaction
        await t.commit();
        
        // Trả về thông báo thành công cùng với thông tin cần thiết cho frontend
        res.status(201).send({ 
            message: "Đặt hàng thành công!", 
            orderId: order.id,
            totalAmount: order.totalAmount
        });

    } catch (error) {
        // Nếu có lỗi, rollback tất cả thay đổi trong transaction
        await t.rollback();
        res.status(500).send({ message: "Đặt hàng thất bại: " + error.message });
    }
};

// --- HÀM 2: HỦY ĐƠN HÀNG (Code của bạn, đã hoạt động tốt) ---
// Chức năng: Cho phép người dùng hủy đơn hàng của chính họ khi nó đang ở trạng thái "pending".
exports.cancelOrder = async (req, res) => {
    // Lấy userId từ token đã xác thực để đảm bảo bảo mật
    const userId = req.userId; 
    // Lấy orderId từ tham số trên đường dẫn URL (ví dụ: /api/orders/15/cancel)
    const { orderId } = req.params;

    // Bắt đầu một transaction để đảm bảo việc hủy đơn và hoàn kho được thực hiện cùng lúc
    const t = await db.sequelize.transaction();

    try {
        // Tìm đơn hàng cần hủy với các điều kiện an toàn:
        // 1. ID phải khớp.
        // 2. Phải thuộc về người dùng đang đăng nhập (ngăn người dùng hủy đơn của người khác).
        // 3. Trạng thái phải là 'pending' (không thể hủy đơn đã giao hoặc đã hủy).
        const order = await db.Order.findOne({
            where: {
                id: orderId,
                userId: userId,
                status: 'pending'
            },
            include: [{ model: db.OrderItem, as: 'items' }], // Lấy kèm các sản phẩm trong đơn để hoàn kho
            transaction: t
        });

        // Nếu không tìm thấy đơn hàng nào thỏa mãn các điều kiện trên
        if (!order) {
            await t.rollback(); // Dừng và hủy bỏ transaction
            return res.status(404).send({ message: "Không tìm thấy đơn hàng hoặc đơn hàng không thể hủy." });
        }

        // Cập nhật trạng thái của đơn hàng thành 'cancelled'
        order.status = 'cancelled';
        await order.save({ transaction: t });

        // Vòng lặp để hoàn trả lại số lượng cho từng sản phẩm trong đơn hàng đã hủy
        for (const item of order.items) {
            // Sử dụng hàm `increment` của Sequelize để cộng lại số lượng vào 'stockQuantity'
            await db.Product.increment('stockQuantity', {
                by: item.quantity, // Số lượng cần cộng lại
                where: { id: item.productId }, // Điều kiện tìm sản phẩm
                transaction: t
            });
        }

        // Nếu tất cả các bước trên thành công, xác nhận và lưu lại tất cả thay đổi
        await t.commit();
        res.status(200).send({ message: "Hủy đơn hàng thành công." });

    } catch (error) {
        // Nếu có bất kỳ lỗi nào xảy ra trong quá trình trên, hủy bỏ mọi thay đổi
        await t.rollback();
        res.status(500).send({ message: "Lỗi khi hủy đơn hàng: " + error.message });
    }
};


// --- HÀM 3: CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (Phần code thêm mới) ---
// Chức năng: Cập nhật trạng thái của một đơn hàng. Được dùng sau khi thanh toán thành công.
exports.updateOrderStatus = async (req, res) => {
    // Lấy userId từ token để đảm bảo chỉ chủ đơn hàng mới có quyền cập nhật.
    const userId = req.userId;
    // Lấy orderId từ tham số trên đường dẫn URL (ví dụ: /api/orders/15/status)
    const { orderId } = req.params;
    // Lấy trạng thái mới từ body của request (ví dụ: { "status": "processing" })
    const { status } = req.body;

    // Kiểm tra xem trạng thái mới có hợp lệ hay không (tùy chọn nhưng nên có)
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).send({ message: "Trạng thái không hợp lệ." });
    }

    try {
        // Tìm đơn hàng, điều kiện an toàn là phải khớp cả orderId và userId
        const order = await db.Order.findOne({
            where: {
                id: orderId,
                userId: userId,
            }
        });

        // Nếu không tìm thấy đơn hàng của người dùng này
        if (!order) {
            return res.status(404).send({ message: "Không tìm thấy đơn hàng." });
        }

        // Cập nhật trạng thái và lưu lại vào database
        order.status = status;
        await order.save();

        // Trả về thông báo thành công và thông tin đơn hàng đã cập nhật
        res.status(200).send({ message: `Cập nhật trạng thái đơn hàng thành công.`, order });

    } catch (error) {
        res.status(500).send({ message: "Lỗi khi cập nhật trạng thái đơn hàng: " + error.message });
    }
};
// [ADMIN] Lấy tất cả đơn hàng
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await db.Order.findAll({
            order: [['createdAt', 'DESC']],
            include: [{ model: db.User, as: 'user', attributes: ['id', 'fullName', 'email'] }]
        });
        res.status(200).send(orders);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};