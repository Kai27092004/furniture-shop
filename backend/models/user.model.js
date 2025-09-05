// File: backend/models/user.model.js
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        role: {
            type: DataTypes.ENUM('customer', 'admin'),
            allowNull: false,
            defaultValue: 'customer'
        }
    }, {
        tableName: 'Users',
        timestamps: true
    });

    // Hook để hash password trước khi tạo user
    User.beforeCreate(async (user) => {
        if (user.password) {
            const saltRounds = 12;
            user.password = await bcrypt.hash(user.password, saltRounds);
        }
    });

    // Hook để hash password trước khi cập nhật user (nếu password thay đổi)
    User.beforeUpdate(async (user) => {
        if (user.changed('password') && user.password) {
            const saltRounds = 12;
            user.password = await bcrypt.hash(user.password, saltRounds);
        }
    });

    User.associate = (models) => {
        // Một User có thể có nhiều Order
        User.hasMany(models.Order, {
            foreignKey: 'userId',
            as: 'orders'
        });
    };

    return User;
};