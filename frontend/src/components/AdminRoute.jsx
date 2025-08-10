import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // Sau khi đăng nhập, kiểm tra xem có phải admin không
    if (user.role !== 'admin') {
        // Nếu không phải, đá về trang chủ
        return <Navigate to="/" />;
    }

    return children;
};

export default AdminRoute;