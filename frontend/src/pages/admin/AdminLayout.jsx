import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin/login'); // Quay về trang login của admin
    };

    const navLinkClass = ({isActive}) => `block py-2.5 px-4 rounded transition duration-200 ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-blue-500 hover:text-white'}`;

    return (
        <div className="flex">
            <aside className="w-64 bg-gray-800 text-gray-200 min-h-screen p-4 flex flex-col">
                <h2 className="text-2xl font-bold mb-6 text-white">Admin Panel</h2>
                <nav className="flex-grow">
                    <ul className="space-y-2">
                        <li><NavLink to="/admin/dashboard" className={navLinkClass}>Dashboard</NavLink></li>
                        <li><NavLink to="/admin/orders" className={navLinkClass}>Quản lý Đơn hàng</NavLink></li>
                        <li><NavLink to="/admin/products" className={navLinkClass}>Quản lý Sản phẩm</NavLink></li>
                        <li><NavLink to="/admin/categories" className={navLinkClass}>Quản lý Danh mục</NavLink></li>
                        <li><NavLink to="/admin/users" className={navLinkClass}>Quản lý Người dùng</NavLink></li>
                    </ul>
                </nav>
                <div className="mt-6">
                    <button onClick={handleLogout} className="w-full text-left block py-2.5 px-4 rounded transition duration-200 hover:bg-red-500 hover:text-white">
                        Đăng xuất
                    </button>
                </div>
            </aside>
            <main className="flex-1 p-10 bg-gray-100">
                <Outlet />
            </main>
        </div>
    );
};
export default AdminLayout;