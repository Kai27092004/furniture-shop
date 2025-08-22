// File: backend/models/category.model.js

module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false, unique: true },
        description: { type: DataTypes.TEXT, allowNull: true }
    }, {
        tableName: 'Categories',
        timestamps: false
    });

    return Category;
};