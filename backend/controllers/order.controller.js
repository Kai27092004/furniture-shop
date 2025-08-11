const db = require('../models');

exports.createOrder = async (req, res) => {
    const userId = req.userId; // Lấy từ middleware xác thực
    const { cartItems, shippingAddress } = req.body;

    // Bắt đầu một transaction
    const t = await db.sequelize.transaction();

    try {
        // --- BƯỚC 1: TÍNH TỔNG TIỀN Ở SERVER ĐỂ ĐẢM BẢO AN TOÀN ---
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

        // --- BƯỚC 2: TẠO ĐƠN HÀNG (ORDER) ---
        const order = await db.Order.create({
            userId,
            totalAmount,
            shippingAddress
        }, { transaction: t });

        // --- BƯỚC 3: TẠO CHI TIẾT ĐƠN HÀNG (ORDER ITEMS) VÀ CẬP NHẬT KHO ---
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
        res.status(201).send({ message: "Đặt hàng thành công!", orderId: order.id });

    } catch (error) {
        // Nếu có lỗi, rollback tất cả thay đổi
        await t.rollback();
        res.status(500).send({ message: "Đặt hàng thất bại: " + error.message });
    }
};