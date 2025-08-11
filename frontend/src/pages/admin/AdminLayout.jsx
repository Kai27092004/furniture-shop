import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const AdminLayout = () => {
    const activeLinkClass = "bg-blue-600 text-white";
    const inactiveLinkClass = "text-gray-200 hover:bg-blue-500 hover:text-white";

    return (
        <div className="flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
                <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
                <nav>
                    <ul>
                        <li>
                            <NavLink to="/admin/dashboard" className={({isActive}) => `block py-2.5 px-4 rounded transition duration-200 ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                                Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/products" className={({isActive}) => `block py-2.5 px-4 rounded transition duration-200 ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                                Quản lý Sản phẩm
                            </NavLink>
                        </li>
                        {/* Thêm các link quản lý khác ở đây */}
                    </ul>
                </nav>
            </aside>
            
            {/* Main Content */}
            <main className="flex-1 p-10">
                {/* Outlet sẽ render component con tương ứng với route */}
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;