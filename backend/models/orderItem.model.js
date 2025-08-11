module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define('OrderItem', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        orderId: { type: DataTypes.INTEGER, allowNull: false },
        productId: { type: DataTypes.INTEGER, allowNull: true }, // Cho phép null phòng trường hợp sản phẩm bị xóa
        quantity: { type: DataTypes.INTEGER, allowNull: false },
        price: { type: DataTypes.DECIMAL(10, 2), allowNull: false } // Lưu lại giá tại thời điểm mua
    }, {
        tableName: 'OrderItems',
        timestamps: false // Bảng này không cần timestamps
    });

    return OrderItem;
};