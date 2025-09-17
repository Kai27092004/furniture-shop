// File: backend/server.js

const express = require('express');
const cors = require('cors'); //Giấy thông hành", cho phép frontend được quyền giao tiếp với backend.
require('dotenv').config();

const app = express();
const db = require('./models'); // Import db object từ models/index.js

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Phục vụ các tệp tĩnh từ thư mục 'public'
app.use(express.static('public'));

// Đồng bộ database
// db.sequelize.sync({ force: true }) // Dùng { force: true } để xóa và tạo lại bảng, chỉ dùng trong dev
db.sequelize.sync()
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Furniture Shop Backend API!' });
});

// Sử dụng các routes đã định nghĩa
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));
app.use('/api/chatbot', require('./routes/chatbot.routes'));
// Thêm các routes khác ở đây...

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});