import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import các Layout
import MainLayout from './components/MainLayout';
import AdminLayout from './pages/admin/AdminLayout';

// Import các Component bảo vệ
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Import các trang
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductsByCategoryPage from './pages/ProductsByCategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CollectionPage from './pages/CollectionPage';
import NewsPage from './pages/NewsPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';

// Import các trang Admin
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProductManagementPage from './pages/admin/ProductManagementPage';
// <-- CHÚ THÍCH: Import 3 trang placeholder vừa tạo -->
import OrderManagementPage from './pages/admin/OrderManagementPage';
import CategoryManagementPage from './pages/admin/CategoryManagementPage';
import UserManagementPage from './pages/admin/UserManagementPage';


function App() {
  return (
    <Routes>
      {/* --- ROUTE ĐĂNG NHẬP ADMIN (Nằm riêng, không dùng layout nào) --- */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* --- CÁC ROUTE CỦA ADMIN (Sử dụng AdminLayout) --- */}
      <Route 
        path="/admin" 
        element={ <AdminRoute> <AdminLayout /> </AdminRoute> }
      >
        <Route index element={<Navigate to="dashboard" replace />} /> 
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="products" element={<ProductManagementPage />} />
        
        {/* <-- CHÚ THÍCH: Thêm các route cho các trang quản lý mới ở đây --> */}
        <Route path="orders" element={<OrderManagementPage />} />
        <Route path="categories" element={<CategoryManagementPage />} />
        <Route path="users" element={<UserManagementPage />} />

      </Route>

      {/* --- CÁC ROUTE CỦA USER (Sử dụng MainLayout) --- */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="category/:categoryId" element={<ProductsByCategoryPage />} />
        <Route path="collections" element={<CollectionPage />} />
        <Route path="news" element={<NewsPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="profile" element={ <ProtectedRoute> <ProfilePage /> </ProtectedRoute> } />
      </Route>
      
    </Routes>
  );
}

export default App;