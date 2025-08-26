// File: backend/models/product.model.js

module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: false },
        price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        stockQuantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        imageUrl: { type: DataTypes.STRING, allowNull: false },
        sku: { type: DataTypes.STRING, unique: true, allowNull: true },
        dimensions: { type: DataTypes.STRING, allowNull: true },
        material: { type: DataTypes.STRING, allowNull: true },
        categoryId: { type: DataTypes.INTEGER, allowNull: true }
    }, {
        tableName: 'Products',
        timestamps: true
    });

    Product.associate = (models) => {
        // Một Product thuộc về một Category
        Product.belongsTo(models.Category, {
            foreignKey: 'categoryId',
            as: 'category'
        });
        // Một Product có thể nằm trong nhiều OrderItem
        Product.hasMany(models.OrderItem, {
            foreignKey: 'productId',
            as: 'orderItems'
        });
    };

    return Product;
};