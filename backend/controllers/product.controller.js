// File: backend/controllers/product.controller.js

const db = require('../models');
const Product = db.Product;
const Category = db.Category;

// Lấy tất cả sản phẩm (có thể kèm theo lọc và phân trang sau này)
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name'] // Chỉ lấy id và name của category
            }]
        });
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Lấy một sản phẩm theo ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [{
                model: Category,
                as: 'category'
            }]
        });
        if (product) {
            res.status(200).send(product);
        } else {
            res.status(404).send({ message: "Không tìm thấy sản phẩm." });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Tạo sản phẩm mới (chỉ Admin)
exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).send(product);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};