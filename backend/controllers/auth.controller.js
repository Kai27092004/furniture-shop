// File: backend/controllers/auth.controller.js

const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = db.User;

// Đăng ký
exports.register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Hash mật khẩu
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            fullName,
            email,
            password: hashedPassword
        });

        res.status(201).send({ message: "Đăng ký tài khoản thành công!" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Đăng nhập
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).send({ message: "Email không tồn tại." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send({ accessToken: null, message: "Sai mật khẩu." });
        }

        // Tạo JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' } // Token hết hạn sau 24 giờ
        );

        res.status(200).send({
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            accessToken: token
        });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};