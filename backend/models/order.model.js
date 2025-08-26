// File: backend/models/order.model.js

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
        timestamps: true
    });

    Order.associate = (models) => {
        // Một Order thuộc về một User
        Order.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });
        // Một Order có nhiều OrderItem
        Order.hasMany(models.OrderItem, {
            foreignKey: 'orderId',
            as: 'items'
        });
    };

    return Order;
};