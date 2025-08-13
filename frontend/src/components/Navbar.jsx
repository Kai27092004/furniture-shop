// File: frontend/src/components/Navbar.jsx

import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { fetchCategories } from '../services/api';

const Navbar = () => {
    // ... các state và hook giữ nguyên ...
    const { isAuthenticated, user, logout } = useAuth();
    const { cartItemCount } = useCart();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await fetchCategories();
                setCategories(res.data);
            } catch (error) {
                console.error("Lỗi khi tải danh mục:", error);
            }
        };
        loadCategories();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };
    
    const navLinkClass = ({ isActive }) => 
        `text-gray-600 hover:text-blue-500 transition-colors ${isActive ? 'font-bold text-blue-500' : ''}`;

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-gray-800 tracking-wider">
                    NỘI THẤT VIỆT
                </Link>
                <div className="flex items-center space-x-5">
                    <NavLink to="/" className={navLinkClass}>Trang Chủ</NavLink>
                    
                    {/* --- PHẦN THAY ĐỔI VÀ THÊM MỚI BẮT ĐẦU TỪ ĐÂY --- */}
                    <div 
                        className="relative"
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                        {/* CHÚ THÍCH: 
                          - Bọc "Sản Phẩm" và icon trong cùng một NavLink.
                          - Thêm class "flex items-center gap-1" để chữ và icon nằm cạnh nhau và cách nhau một chút.
                        */}
                        <NavLink to="/products" className={`${navLinkClass({})} flex items-center gap-1`}>
                            Sản Phẩm
                            {/* CHÚ THÍCH: Đây là icon mũi tên (chevron).
                              - Dùng SVG để dễ dàng tạo kiểu bằng Tailwind CSS.
                              - Class 'rotate-180' sẽ được thêm vào khi isDropdownOpen là true, tạo hiệu ứng xoay.
                              - Class 'transition-transform' giúp hiệu ứng xoay mượt mà hơn.
                            */}
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </NavLink>
                        
                        {/* Menu dropdown, logic giữ nguyên */}
                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-md shadow-lg py-2 z-50">
                                <Link to="/products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Tất cả sản phẩm
                                </Link>
                                <div className="border-t border-gray-100 my-1"></div>
                                {categories.map(category => (
                                    <Link
                                        key={category.id}
                                        to={`/category/${category.id}`}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* --- KẾT THÚC PHẦN THAY ĐỔI VÀ THÊM MỚI --- */}

                    <NavLink to="/collections" className={navLinkClass}>Bộ sưu tập</NavLink>
                    <NavLink to="/news" className={navLinkClass}>Tin tức</NavLink>
                    <NavLink to="/contact" className={navLinkClass}>Liên hệ</NavLink>
                    
                    {/* Phần logic đăng nhập/hồ sơ giữ nguyên */}
                    {isAuthenticated ? (
                       <>
                            <NavLink to="/profile" className={navLinkClass}>Hồ Sơ</NavLink>
                            <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1.5 rounded text-sm hover:bg-red-600 transition-colors">
                                Đăng Xuất
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 transition-colors">
                            Đăng Nhập
                        </Link>
                    )}
                    
                    {/* Phần giỏ hàng giữ nguyên */}
                    <Link to="/cart" className="relative text-gray-600 hover:text-blue-500">
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