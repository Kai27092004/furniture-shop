// File: backend/models/user.model.js

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

    User.associate = (models) => {
        // Một User có thể có nhiều Order
        User.hasMany(models.Order, {
            foreignKey: 'userId',
            as: 'orders'
        });
    };

    return User;
};