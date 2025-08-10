import axios from 'axios';

// Tạo một instance của axios với cấu hình mặc định
const API = axios.create({
    baseURL: 'http://localhost:8080/api', // Địa chỉ gốc của backend
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

export default API;