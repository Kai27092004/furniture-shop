// File: frontend/src/services/api.js
import axios from 'axios';

// ### DÒNG CODE ĐƯỢC THÊM VÀO ###
export const BACKEND_URL = 'http://localhost:8080';
// ###############################

// Tạo một instance của axios với cấu hình mặc định
const API = axios.create({
    baseURL: `${BACKEND_URL}/api`, // <-- CHỈNH SỬA DÒNG NÀY
    headers: {
        'Content-Type': 'application/json',
    },
});

// Quan trọng: Interceptor để đính kèm token vào mỗi request
// Khi người dùng đăng nhập, ta lưu token vào localStorage
// Interceptor này sẽ tự động lấy token đó và gắn vào header Authorization
API.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.accessToken) {
            config.headers['Authorization'] = 'Bearer ' + user.accessToken;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Các hàm gọi API cụ thể
// --- Auth ---
export const login = (credentials) => API.post('/auth/login', credentials);
export const register = (userData) => API.post('/auth/register', userData);

// --- Products ---
export const fetchProducts = () => API.get('/products');
export const fetchProductById = (id) => API.get(`/products/${id}`);
export const createProduct = (productData) => API.post('/products', productData);
export const updateProduct = (id, productData) => API.put(`/products/${id}`, productData);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const fetchProductsByCategory = (categoryId) => API.get(`/products?categoryId=${categoryId}`);

// --- Categories ---
export const fetchCategories = () => API.get('/categories');


// --- User Profile ---
// Hàm gọi API để lấy thông tin cá nhân của người dùng đang đăng nhập
export const fetchUserProfile = () => API.get('/users/profile');

// Hàm gọi API để lấy lịch sử đơn hàng của người dùng đang đăng nhập
export const fetchMyOrders = () => API.get('/users/my-orders');
export const createOrder = (orderData) => API.post('/orders', orderData);
// Hủy một đơn hàng
export const cancelOrder = (orderId) => API.put(`/orders/${orderId}/cancel`);
export const updateOrderStatus = (orderId, status) => API.put(`/orders/${orderId}/status`, { status });

export default API;