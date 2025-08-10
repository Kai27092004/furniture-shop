import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar'; // Sẽ tạo ở bước sau
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import LoginPage from './pages/LoginPage';
import ProductDetailPage from './pages/ProductDetailPage';

function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="container mx-auto p-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} /> {/* Route mới */}
          <Route path="/login" element={<LoginPage />} />
          {/* Thêm các routes khác ở đây */}
        </Routes>
      </main>
    </div>
  );
}

export default App;