import React from 'react';
import { Routes, Route } from 'react-router-dom';

// --- Layout Components ---
import UserLayout from './components/UserLayout';
import AdminLayout from './pages/admin/AdminLayout';

// --- Route Guard Components ---
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// --- Page Components ---
// User Pages
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // <-- THAY ĐỔI 1: THÊM IMPORT CHO TRANG ĐĂNG KÝ
import CartPage from './pages/CartPage'; // Giả sử bạn cũng có trang này


// Admin Pages
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProductManagementPage from './pages/admin/ProductManagementPage';


function App() {
  return (
    <Routes>
      {/* ================================================================== */}
      {/* ==             LAYOUT & ROUTES CHO NGƯỜI DÙNG                   == */}
      {/* ================================================================== */}
      <Route path="/" element={<UserLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        {/* Các trang người dùng khác như /checkout sẽ được thêm ở đây */}
      </Route>

      {/* ================================================================== */}
      {/* ==              LAYOUT & ROUTES CHO ADMIN                       == */}
      {/* ================================================================== */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="products" element={<ProductManagementPage />} />
        {/* Các trang admin khác như /admin/orders, /admin/users sẽ được thêm ở đây */}
      </Route>

      {/* ================================================================== */}
      {/* ==        CÁC TRANG ĐỘC LẬP (Không thuộc layout nào)           == */}
      {/* ================================================================== */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* 👇 -- PHẦN SỬA CHỮA NẰM Ở ĐÂY -- 👇 */}
      <Route path="/register" element={<RegisterPage />} /> {/* <-- THAY ĐỔI 2: SỬ DỤNG COMPONENT RegisterPage THAY VÌ DIV */}
      {/* 👆 -- KẾT THÚC PHẦN SỬA CHỮA -- 👆 */}
      
      {/* ================================================================== */}
      {/* ==                   TRANG BẮT LỖI 404 NOT FOUND                == */}
      {/* ================================================================== */}
      <Route
        path="*"
        element={
          <div className='flex min-h-screen flex-col items-center justify-center bg-gray-100'>
            <h1 className='text-8xl font-bold text-blue-600'>404</h1>
            <p className='mt-4 text-2xl font-medium text-gray-700'>Trang không tồn tại</p>
            <p className='mt-2 text-gray-500'>Rất tiếc, trang bạn đang tìm kiếm không thể được tìm thấy.</p>
          </div>
        }
      />
    </Routes>
  );
}

export default App;