module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        userId: { type: DataTypes.INTEGER, allowNull: false },
        totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        status: {
            type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
            allowNull: false,
            defaultValue: 'pending'
        },
        shippingAddress: { type: DataTypes.TEXT, allowNull: false },
        customerNotes: { type: DataTypes.TEXT, allowNull: true }
    }, {
        tableName: 'Orders',
        timestamps: true // Bảng này có createdAt và updatedAt
    });

    return Order;
};