import React from 'react';
import { Routes, Route } from 'react-router-dom';

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
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProductManagementPage from './pages/admin/ProductManagementPage';


function App() {
  return (
    <Routes>
      {/* --- CÁC ROUTE SỬ DỤNG MAINLAYOUT (CHO NGƯỜI DÙNG) --- */}
      {/* CHÚ THÍCH: Tất cả các Route bên trong sẽ được bọc bởi MainLayout */}
      <Route path="/" element={<MainLayout />}>
        {/* Các trang công khai */}
        <Route index element={<HomePage />} /> {/* 'index' có nghĩa là đây là trang cho path="/" */}
        <Route path="products" element={<ProductListPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="category/:categoryId" element={<ProductsByCategoryPage />} />
        <Route path="collections" element={<CollectionPage />} />
        <Route path="news" element={<NewsPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="cart" element={<CartPage />} />

        {/* Các trang xác thực */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Các trang được bảo vệ */}
        <Route 
            path="profile" 
            element={ <ProtectedRoute> <ProfilePage /> </ProtectedRoute> } 
        />
      </Route>

      {/* --- CÁC ROUTE SỬ DỤNG ADMINLAYOUT (CHO ADMIN) --- */}
      {/* CHÚ THÍCH: Tất cả các Route bên trong sẽ được bọc bởi AdminLayout và được bảo vệ bởi AdminRoute */}
      <Route 
        path="/admin" 
        element={ <AdminRoute> <AdminLayout /> </AdminRoute> }
      >
        {/* React Router v6 sẽ tự hiểu "dashboard" là "/admin/dashboard" */}
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="products" element={<ProductManagementPage />} />
      </Route>
      
      {/* Bạn có thể thêm Route cho trang 404 Not Found ở đây */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}

export default App;