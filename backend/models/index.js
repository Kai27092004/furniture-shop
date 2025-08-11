// File: backend/models/index.js

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Import kết nối database của bạn

const db = {};

// --- BƯỚC 1: IMPORT VÀ KHỞI TẠO TẤT CẢ CÁC MODEL ---
// Tại bước này, chúng ta đảm bảo tất cả các model được định nghĩa và gán vào đối tượng 'db'
// trước khi chúng ta cố gắng sử dụng chúng để tạo mối quan hệ.

db.User = require('./user.model')(sequelize, DataTypes);
db.Category = require('./category.model')(sequelize, DataTypes);
db.Product = require('./product.model')(sequelize, DataTypes);
db.Order = require('./order.model')(sequelize, DataTypes);
db.OrderItem = require('./orderItem.model')(sequelize, DataTypes);


// --- BƯỚC 2: ĐỊNH NGHĨA TẤT CẢ CÁC MỐI QUAN HỆ (ASSOCIATIONS) ---
// Sau khi Bước 1 hoàn tất, chúng ta có thể chắc chắn rằng các đối tượng
// như 'db.User', 'db.Order' đều đã tồn tại và là các Model hợp lệ.
// Bây giờ việc gọi .hasMany, .belongsTo sẽ không còn bị lỗi.

// Mối quan hệ giữa Category và Product (1-Nhiều)
// Một Category có nhiều Product.
db.Category.hasMany(db.Product, { 
    as: 'products', // Đặt tên cho mối quan hệ để dễ truy vấn
    foreignKey: 'categoryId' 
});
// Mỗi Product thuộc về một Category.
db.Product.belongsTo(db.Category, { 
    as: 'category', 
    foreignKey: 'categoryId' 
});


// Mối quan hệ giữa User và Order (1-Nhiều)
// Một User có thể có nhiều Order.
db.User.hasMany(db.Order, { 
    as: 'orders', 
    foreignKey: 'userId' 
});
// Mỗi Order thuộc về một User.
db.Order.belongsTo(db.User, { 
    as: 'user', 
    foreignKey: 'userId' 
});


// Mối quan hệ giữa Order và OrderItem (1-Nhiều)
// Một Order có nhiều OrderItem (nhiều dòng chi tiết sản phẩm).
db.Order.hasMany(db.OrderItem, { 
    as: 'items', 
    foreignKey: 'orderId' 
});
// Mỗi OrderItem thuộc về một Order.
db.OrderItem.belongsTo(db.Order, { 
    as: 'order', 
    foreignKey: 'orderId' 
});


// Mối quan hệ giữa Product và OrderItem (1-Nhiều)
// Một Product có thể xuất hiện trong nhiều OrderItem.
db.Product.hasMany(db.OrderItem, { 
    as: 'orderItems', 
    foreignKey: 'productId' 
});
// Mỗi OrderItem thuộc về một Product.
db.OrderItem.belongsTo(db.Product, { 
    as: 'product', 
    foreignKey: 'productId' 
});


// --- PHẦN CUỐI: EXPORT ---
db.sequelize = sequelize; // Export instance kết nối
db.Sequelize = Sequelize; // Export chính thư viện Sequelize

module.exports = db; // Export đối tượng db chứa tất cả