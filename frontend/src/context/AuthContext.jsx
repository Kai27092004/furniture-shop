import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginService } from '../services/api'; // Import hàm login từ service

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Kiểm tra xem có thông tin user trong localStorage không khi ứng dụng khởi động
    useEffect(() => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser) {
                setUser(storedUser);
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
        } finally {
            setLoading(false); // Kết thúc loading
        }
    }, []);

    const login = async (email, password) => {
        try {
            const response = await loginService({ email, password });
            const userData = response.data;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return userData;
        } catch (error) {
            console.error("Login failed", error);
            // Ném lỗi ra để component có thể bắt và xử lý
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const value = { user, login, logout, isAuthenticated: !!user, loading };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};