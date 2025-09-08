// ========================================
// IMPORTS - NHẬP KHẨU CÁC THÀNH PHẦN
// ========================================

// React và React Router
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Context Providers - Các nhà cung cấp ngữ cảnh
import { ToastProvider } from './context/ToastContext';

// Utility Components - Các component tiện ích
import ScrollToTop from './components/ScrollToTop';

// Layout Components - Các component bố cục
import MainLayout from './components/MainLayout';
import AdminLayout from './pages/admin/AdminLayout';

// Route Protection Components - Các component bảo vệ route
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// ========================================
// USER PAGES - CÁC TRANG NGƯỜI DÙNG
// ========================================

// Main Pages - Trang chính
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductsByCategoryPage from './pages/ProductsByCategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CollectionPage from './pages/CollectionPage';
import NewsPage from './pages/NewsPage';
import ContactPage from './pages/ContactPage';

// Authentication Pages - Trang xác thực
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// User Account Pages - Trang tài khoản người dùng
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';

// Guide Pages - Trang hướng dẫn
import HowToBuyPage from './pages/guides/HowToBuyPage';
import DeliveryAreaPage from './pages/guides/DeliveryAreaPage';
import PaymentMethodPage from './pages/guides/PaymentMethodPage';
import ReturnPolicyPage from './pages/guides/ReturnPolicyPage';
import PrivacyPolicyPage from './pages/guides/PrivacyPolicyPage';

// ========================================
// ADMIN PAGES - CÁC TRANG QUẢN TRỊ
// ========================================

// Admin Authentication - Xác thực admin
import AdminLoginPage from './pages/admin/AdminLoginPage';

// Admin Management Pages - Trang quản lý admin
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProductManagementPage from './pages/admin/ProductManagementPage';
import OrderManagementPage from './pages/admin/OrderManagementPage';
import CategoryManagementPage from './pages/admin/CategoryManagementPage';
import UserManagementPage from './pages/admin/UserManagementPage';


// ========================================
// MAIN APP COMPONENT - COMPONENT CHÍNH
// ========================================

/**
 * App Component - Component chính của ứng dụng
 * Quản lý routing và layout cho toàn bộ ứng dụng
 * Bao gồm các route cho người dùng và admin
 */
function App() {
  return (
    <ToastProvider>
      {/* Component tự động scroll lên đầu trang khi chuyển route */}
      <ScrollToTop />
      
      <Routes>
        {/* ======================================== */}
        {/* ADMIN ROUTES - CÁC ROUTE QUẢN TRỊ */}
        {/* ======================================== */}
        
        {/* Route đăng nhập admin - không sử dụng layout */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Các route admin - sử dụng AdminLayout và bảo vệ bằng AdminRoute */}
        <Route 
          path="/admin" 
          element={<AdminRoute><AdminLayout /></AdminRoute>}
        >
          {/* Redirect mặc định từ /admin đến /admin/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} /> 
          
          {/* Dashboard admin */}
          <Route path="dashboard" element={<AdminDashboardPage />} />
          
          {/* Quản lý sản phẩm */}
          <Route path="products" element={<ProductManagementPage />} />
          
          {/* Quản lý đơn hàng */}
          <Route path="orders" element={<OrderManagementPage />} />
          
          {/* Quản lý danh mục */}
          <Route path="categories" element={<CategoryManagementPage />} />
          
          {/* Quản lý người dùng */}
          <Route path="users" element={<UserManagementPage />} />
        </Route>

        {/* ======================================== */}
        {/* USER ROUTES - CÁC ROUTE NGƯỜI DÙNG */}
        {/* ======================================== */}
        
        {/* Các route người dùng - sử dụng MainLayout */}
        <Route path="/" element={<MainLayout />}>
          
          {/* ======================================== */}
          {/* MAIN PAGES - CÁC TRANG CHÍNH */}
          {/* ======================================== */}
          
          {/* Trang chủ */}
          <Route index element={<HomePage />} />
          
          {/* Danh sách sản phẩm */}
          <Route path="products" element={<ProductListPage />} />
          
          {/* Chi tiết sản phẩm */}
          <Route path="products/:id" element={<ProductDetailPage />} />
          
          {/* Sản phẩm theo danh mục */}
          <Route path="category/:categoryId" element={<ProductsByCategoryPage />} />
          
          {/* Trang bộ sưu tập */}
          <Route path="collections" element={<CollectionPage />} />
          
          {/* Trang tin tức */}
          <Route path="news" element={<NewsPage />} />
          
          {/* Trang liên hệ */}
          <Route path="contact" element={<ContactPage />} />
          
          {/* ======================================== */}
          {/* AUTHENTICATION - XÁC THỰC */}
          {/* ======================================== */}
          
          {/* Trang đăng nhập */}
          <Route path="login" element={<LoginPage />} />
          
          {/* Trang đăng ký */}
          <Route path="register" element={<RegisterPage />} />
          
          {/* ======================================== */}
          {/* USER ACCOUNT - TÀI KHOẢN NGƯỜI DÙNG */}
          {/* ======================================== */}
          
          {/* Giỏ hàng */}
          <Route path="cart" element={<CartPage />} />
          
          {/* Trang cá nhân - cần đăng nhập */}
          <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          
          {/* Trang thanh toán - cần đăng nhập */}
          <Route 
            path="payment/:orderId" 
            element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} 
          />
          
          {/* Trang thanh toán thành công - cần đăng nhập */}
          <Route path="order-success" element={<ProtectedRoute><PaymentSuccessPage /></ProtectedRoute>} />

          {/* ======================================== */}
          {/* GUIDE PAGES - CÁC TRANG HƯỚNG DẪN */}
          {/* ======================================== */}
          
          {/* Hướng dẫn mua hàng */}
          <Route path="huong-dan-mua-hang" element={<HowToBuyPage />} />
          
          {/* Khu vực giao hàng */}
          <Route path="khu-vuc-giao-hang" element={<DeliveryAreaPage />} />
          
          {/* Phương thức thanh toán */}
          <Route path="phuong-thuc-thanh-toan" element={<PaymentMethodPage />} />
          
          {/* Chính sách trả hàng */}
          <Route path="chinh-sach-tra-hang" element={<ReturnPolicyPage />} />
          
          {/* Chính sách bảo mật */}
          <Route path="chinh-sach-bao-mat" element={<PrivacyPolicyPage />} />
        </Route>
      </Routes>
    </ToastProvider>
  );
}

export default App;