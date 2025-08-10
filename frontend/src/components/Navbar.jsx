import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const { cartItemCount } = useCart(); // <-- THÊM DÒNG NÀY

    const handleLogout = () => {
        logout();
        navigate('/'); // Chuyển về trang chủ sau khi logout
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-gray-800 tracking-wider">
                    NỘI THẤT VIỆT
                </Link>
                <div className="flex items-center space-x-5">
                    <Link to="/" className="text-gray-600 hover:text-blue-500">Trang Chủ</Link>
                    <Link to="/products" className="text-gray-600 hover:text-blue-500">Sản Phẩm</Link>

                    {isAuthenticated ? (
                        <>
                            <span className="text-gray-700">Chào, {user.fullName}!</span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                            >
                                Đăng Xuất
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                            Đăng Nhập
                        </Link>
                    )}

                    <Link to="/cart" className="relative text-gray-600 hover:text-blue-500">
                        {/* Icon giỏ hàng */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {cartItemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {cartItemCount}
                            </span>
                        )}
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;