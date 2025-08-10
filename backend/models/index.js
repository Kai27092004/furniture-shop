// File: backend/models/index.js

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import các models
db.User = require('./user.model')(sequelize, DataTypes);
db.Category = require('./category.model')(sequelize, DataTypes);
db.Product = require('./product.model')(sequelize, DataTypes);
// Thêm Order và OrderItem models ở đây khi bạn tạo chúng

// Định nghĩa các mối quan hệ (Associations)
// Một Category có nhiều Product
db.Category.hasMany(db.Product, { as: 'products', foreignKey: 'categoryId' });
// Một Product thuộc về một Category
db.Product.belongsTo(db.Category, { as: 'category', foreignKey: 'categoryId' });


// Một User có thể có nhiều Order
// db.User.hasMany(db.Order, { as: 'orders', foreignKey: 'userId' });
// db.Order.belongsTo(db.User, { as: 'user', foreignKey: 'userId' });

// Một Order có nhiều OrderItem
// db.Order.hasMany(db.OrderItem, { as: 'items', foreignKey: 'orderId' });
// db.OrderItem.belongsTo(db.Order, { as: 'order', foreignKey: 'orderId' });

// Một Product có thể nằm trong nhiều OrderItem
// db.Product.hasMany(db.OrderItem, { as: 'orderItems', foreignKey: 'productId' });
// db.OrderItem.belongsTo(db.Product, { as: 'product', foreignKey: 'productId' });

module.exports = db;