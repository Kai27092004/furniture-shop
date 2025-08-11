const db = require('../models');
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await db.Category.findAll();
        res.status(200).send(categories);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};