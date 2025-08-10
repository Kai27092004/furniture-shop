// File: backend/middleware/auth.middleware.js

const jwt = require('jsonwebtoken');
const db = require('../models');

exports.isAuthenticated = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send({ message: "Vui lòng đăng nhập để truy cập." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: "Token không hợp lệ hoặc đã hết hạn." });
        }
        req.userId = decoded.id; // Gắn id của user vào request
        req.userRole = decoded.role; // Gắn role của user vào request
        next();
    });
};

exports.isAdmin = (req, res, next) => {
    if (req.userRole && req.userRole === 'admin') {
        next();
    } else {
        res.status(403).send({ message: "Yêu cầu quyền Admin!" });
    }
};