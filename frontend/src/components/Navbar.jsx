import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { fetchCategories } from '../services/api';
import { FiShoppingCart, FiMenu, FiX, FiChevronDown, FiUser, FiLogIn } from 'react-icons/fi';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const { cartItemCount } = useCart();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileProductDropdownOpen, setIsMobileProductDropdownOpen] = useState(false);

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
        setIsMenuOpen(false); // Đóng menu mobile khi đăng xuất
        navigate('/');
    };

    // Hàm đóng menu khi chuyển trang trên mobile
    const handleMobileLinkClick = () => {
        setIsMenuOpen(false);
    };

    // Lớp CSS cho NavLink trên desktop
    const navLinkClass = ({ isActive }) =>
        `flex items-center px-3 py-2 rounded-md text-lg font-medium transition-colors duration-200 ${
            isActive
                ? 'text-[#A25F4B] bg-[#A25F4B]/10'
                : 'text-gray-700 hover:text-[#A25F4B] hover:bg-[#A25F4B]/5'
        }`;

    // Lớp CSS cho NavLink trên mobile
    const mobileNavLinkClass = ({ isActive }) =>
        `w-full text-left px-3 py-3 rounded-md text-lg font-medium transition-colors duration-200 block ${
          isActive
            ? 'text-[#A25F4B] bg-[#A25F4B]/10'
            : 'text-gray-700 hover:text-[#A25F4B] hover:bg-[#A25F4B]/5'
        }`;

    const mainNavLinks = [
        { path: '/', name: 'Trang Chủ' },
        { path: '/products', name: 'Sản Phẩm', hasDropdown: true },
        { path: '/news', name: 'Tin tức' },
        { path: '/contact', name: 'Liên hệ' }
    ];

    return (
        <nav className="sticky top-0 z-50 bg-gradient-to-b from-[#f9f8f4] to-[#f5f4f0] shadow-lg border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0" onClick={handleMobileLinkClick}>
                        <div className="group">
                            {/* THAY ĐỔI: Giảm độ nâng khi hover từ -translate-y-1 xuống -translate-y-0.5 */}
                            <div className="uppercase text-3xl font-bold tracking-wide cursor-pointer px-4 py-2 rounded-xl border-2 border-transparent hover:border-[#A25F4B]/20 hover:bg-white/60 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 ease-out hover:scale-105">
                                <span className="text-black group-hover:text-[#A25F4B] transition-colors duration-300">SHOP</span>
                                <span className="text-[#A25F4B] transition-colors duration-300">NK</span>
                            </div>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {mainNavLinks.map((item) => (
                                <div key={item.name} className="relative group">
                                    <NavLink to={item.path} className={navLinkClass} end={item.path === '/'}>
                                        {item.name}
                                        {item.hasDropdown && (
                                            <FiChevronDown className="ml-1 h-5 w-5 group-hover:rotate-180 transition-transform duration-200" />
                                        )}
                                    </NavLink>

                                    {item.hasDropdown && (
                                        <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
                                            <div className="py-1">
                                                <Link to="/products" className="block px-4 py-2 text-base text-gray-700 hover:bg-gray-100 hover:text-[#A25F4B] transition-colors duration-200">
                                                    Tất cả sản phẩm
                                                </Link>
                                                <div className="border-t border-gray-100 my-1"></div>
                                                {categories.map(category => (
                                                    <Link
                                                        key={category.id}
                                                        to={`/category/${category.id}`}
                                                        className="block px-4 py-2 text-base text-gray-700 hover:bg-gray-100 hover:text-[#A25F4B] transition-colors duration-200"
                                                    >
                                                        {category.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Menu - Desktop */}
                    <div className="hidden lg:flex items-center space-x-6">
                        {isAuthenticated ? (
                            <>
                                <NavLink to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-[#A25F4B] font-medium text-lg transition-colors duration-200 hover:bg-[#A25F4B]/5 px-3 py-2 rounded-md">
                                    <FiUser className="h-5 w-5" />
                                    <span>{user?.name || 'Hồ Sơ'}</span>
                                </NavLink>
                                <button onClick={handleLogout} className="flex items-center space-x-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-medium text-lg px-3 py-2 rounded-md transition-colors duration-200">
                                    <FiLogIn className="h-5 w-5" />
                                    <span>Đăng Xuất</span>
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="flex items-center space-x-2 text-gray-700 hover:text-[#A25F4B] font-medium text-lg transition-colors duration-200 hover:bg-[#A25F4B]/5 px-3 py-2 rounded-md">
                                <FiLogIn className="h-5 w-5" />
                                <span>Đăng Nhập</span>
                            </Link>
                        )}

                        <div className="relative ml-4">
                            <Link to="/cart" className="block p-2 text-gray-700 hover:text-[#A25F4B] hover:bg-[#A25F4B]/10 rounded-full transition-colors duration-200">
                                <FiShoppingCart className="h-7 w-7" />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
                                        {cartItemCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-700 hover:text-[#A25F4B] hover:bg-[#A25F4B]/10 rounded-md transition-colors duration-200">
                            {isMenuOpen ? <FiX className="h-7 w-7" /> : <FiMenu className="h-7 w-7" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`lg:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-sm border-t border-gray-200">
                    {mainNavLinks.map((item) => (
                        <div key={item.name} className="block">
                            {!item.hasDropdown ? (
                                <NavLink to={item.path} className={mobileNavLinkClass} onClick={handleMobileLinkClick} end={item.path === '/'}>
                                    {item.name}
                                </NavLink>
                            ) : (
                                <div>
                                    <button onClick={() => setIsMobileProductDropdownOpen(!isMobileProductDropdownOpen)} className={`${mobileNavLinkClass({isActive: false})} w-full`}>
                                        <div className="flex items-center justify-between">
                                            {item.name}
                                            <FiChevronDown className={`h-5 w-5 transition-transform duration-200 ${isMobileProductDropdownOpen ? 'rotate-180' : ''}`} />
                                        </div>
                                    </button>
                                    {isMobileProductDropdownOpen && (
                                        <div className="ml-4 mt-1 space-y-1">
                                            <Link to="/products" onClick={handleMobileLinkClick} className="block px-3 py-2 text-base text-gray-600 hover:text-[#A25F4B] hover:bg-[#A25F4B]/5 rounded">
                                                Tất cả sản phẩm
                                            </Link>
                                            {categories.map(category => (
                                                <Link key={category.id} to={`/category/${category.id}`} onClick={handleMobileLinkClick} className="block px-3 py-2 text-base text-gray-600 hover:text-[#A25F4B] hover:bg-[#A25F4B]/5 rounded">
                                                    {category.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    <hr className="my-3 border-gray-300" />

                    {isAuthenticated ? (
                        <>
                            <NavLink to="/profile" onClick={handleMobileLinkClick} className="w-full flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-[#A25F4B] hover:bg-[#A25F4B]/5 font-medium text-lg transition-colors duration-200 rounded-md">
                                <FiUser className="h-6 w-6" />
                                <span>{user?.name || 'Hồ Sơ'}</span>
                            </NavLink>
                             <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-[#A25F4B] hover:bg-[#A25F4B]/5 font-medium text-lg transition-colors duration-200 rounded-md">
                                <FiLogIn className="h-6 w-6" />
                                <span>Đăng Xuất</span>
                            </button>
                        </>
                    ) : (
                        <NavLink to="/login" onClick={handleMobileLinkClick} className="w-full flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-[#A25F4B] hover:bg-[#A25F4B]/5 font-medium text-lg transition-colors duration-200 rounded-md">
                            <FiLogIn className="h-6 w-6" />
                            <span>Đăng Nhập</span>
                        </NavLink>
                    )}

                    <NavLink to="/cart" onClick={handleMobileLinkClick} className="w-full flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-[#A25F4B] hover:bg-[#A25F4B]/5 font-medium text-lg transition-colors duration-200 rounded-md">
                        <div className="relative">
                            <FiShoppingCart className="h-6 w-6" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                                    {cartItemCount}
                                </span>
                            )}
                        </div>
                        <span>Giỏ hàng</span>
                    </NavLink>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;