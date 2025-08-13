// File: backend/controllers/product.controller.js

const db = require('../models');
const Product = db.Product;
const Category = db.Category;

// Lấy tất cả sản phẩm (có thể kèm theo lọc và phân trang sau này)
exports.getAllProducts = async (req, res) => {
    const { categoryId } = req.query;
    const whereCondition = {};
    if (categoryId) {
        whereCondition.categoryId = categoryId;
    }
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

// --- PHẦN THÊM MỚI BẮT ĐẦU TỪ ĐÂY ---

// <-- THÊM MỚI: Hàm để cập nhật (sửa) thông tin sản phẩm
exports.updateProduct = async (req, res) => {
    // Lấy id của sản phẩm từ URL, ví dụ: /api/products/12
    const id = req.params.id; 
    try {
        // Tìm sản phẩm trong database bằng id (Primary Key)
        const product = await Product.findByPk(id);

        // Nếu tìm thấy sản phẩm
        if (product) {
            // Dùng hàm update của Sequelize để cập nhật sản phẩm với dữ liệu mới
            // Dữ liệu mới được lấy từ body của request
            await product.update(req.body);
            res.status(200).send({ 
                message: "Cập nhật sản phẩm thành công.",
                data: product 
            });
        } else {
            // Nếu không tìm thấy, trả về lỗi 404
            res.status(404).send({ 
                message: `Không tìm thấy sản phẩm với id=${id}.` 
            });
        }
    } catch (error) {
        res.status(500).send({ message: "Lỗi khi cập nhật sản phẩm: " + error.message });
    }
};

// <-- THÊM MỚI: Hàm để xóa một sản phẩm
exports.deleteProduct = async (req, res) => {
    // Lấy id của sản phẩm từ URL
    const id = req.params.id;
    try {
        // Dùng hàm destroy của Sequelize để xóa sản phẩm
        // Hàm này sẽ xóa tất cả các bản ghi khớp với điều kiện trong 'where'
        const num = await Product.destroy({
            where: { id: id }
        });

        // Hàm destroy trả về số lượng bản ghi đã được xóa.
        // Nếu số lượng là 1, có nghĩa là đã xóa thành công.
        if (num == 1) {
            res.status(200).send({ 
                message: "Xóa sản phẩm thành công!" 
            });
        } else {
            // Nếu số lượng là 0, tức là không tìm thấy sản phẩm để xóa.
            res.status(404).send({ 
                message: `Không tìm thấy sản phẩm với id=${id} để xóa.` 
            });
        }
    } catch (error) {
        res.status(500).send({ message: "Lỗi khi xóa sản phẩm: " + error.message });
    }
};