import React from 'react';
import { Navigate, useLocation } from 'react-router-dom'; // <-- Thêm useLocation
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth(); // <-- Thêm loading
    const location = useLocation(); // <-- Thêm dòng này để lấy vị trí hiện tại

    // Nếu đang kiểm tra auth, không render gì cả (hoặc hiện spinner)
    if (loading) {
        return null; // Hoặc <p>Loading...</p>
    }

    if (!isAuthenticated) {
        // Lưu lại trang người dùng định truy cập để chuyển hướng lại sau khi đăng nhập
        return <Navigate to="/login" state={{ from: location }} replace />; // <-- Thêm state
    }

    return children;
};

export default ProtectedRoute;