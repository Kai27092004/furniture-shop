// File: backend/models/orderItem.model.js

module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define('OrderItem', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        orderId: { type: DataTypes.INTEGER, allowNull: false },
        productId: { type: DataTypes.INTEGER, allowNull: true },
        quantity: { type: DataTypes.INTEGER, allowNull: false },
        price: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
    }, {
        tableName: 'OrderItems',
        timestamps: false
    });

    OrderItem.associate = (models) => {
        // Một OrderItem thuộc về một Order
        OrderItem.belongsTo(models.Order, {
            foreignKey: 'orderId',
            as: 'order'
        });
        // Một OrderItem tương ứng với một Product
        OrderItem.belongsTo(models.Product, {
            foreignKey: 'productId',
            as: 'product'
        });
    };

    return OrderItem;
};