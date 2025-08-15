import React from 'react';
import { Navigate, useLocation } from 'react-router-dom'; // <-- Thêm useLocation
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useAuth(); // <-- Thêm loading
    const location = useLocation(); // <-- Thêm dòng này

    if (loading) {
        return null; // Hoặc <p>Loading...</p>
    }

    if (!isAuthenticated) {
        // Chuyển về trang đăng nhập của Admin
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    if (user.role !== 'admin') {
        return <Navigate to="/" replace />; // Nếu không phải admin, đá về trang chủ
    }

    return children;
};

export default AdminRoute;