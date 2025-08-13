// File: frontend/src/pages/CartPage.jsx

// <-- CHÚ THÍCH: Các import của bạn đã đúng, chúng ta chỉ cần thêm import cho Modal giả lập.
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/api';
// <-- THÊM MỚI: Import component Modal giả lập QR mà chúng ta đã tạo.
import SimulatedQRModal from '../components/SimulatedQRModal';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [shippingAddress, setShippingAddress] = useState('');
    const [error, setError] = useState('');

    // <-- THÊM MỚI: State để quản lý việc mở/đóng cửa sổ QR giả lập.
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);

    // <-- THAY ĐỔI: Tên hàm được đổi để rõ nghĩa hơn. Hàm này giờ chỉ có nhiệm vụ MỞ MODAL.
    const handleProceedToCheckout = (e) => {
        e.preventDefault();
        setError('');

        // Các bước kiểm tra đăng nhập và địa chỉ vẫn giữ nguyên
        if (!isAuthenticated) {
            alert('Vui lòng đăng nhập để có thể đặt hàng.');
            navigate('/login');
            return;
        }
        if (!shippingAddress.trim()) {
            setError('Vui lòng nhập địa chỉ giao hàng.');
            return;
        }

        // <-- THAY ĐỔI: Thay vì gọi API, hàm này sẽ mở cửa sổ Modal giả lập.
        setIsQrModalOpen(true);
    };

    // <-- THÊM MỚI: Hàm này chứa logic tạo đơn hàng. Nó sẽ được gọi khi người dùng nhấn "Hoàn tất" trong Modal.
    const handlePaymentComplete = async () => {
        try {
            // Gọi API để tạo đơn hàng trong database
            await createOrder({
                cartItems: cartItems,
                shippingAddress: shippingAddress,
            });
            
            setIsQrModalOpen(false); // Đóng modal sau khi thành công
            alert('Đặt hàng thành công!');
            clearCart(); // Xóa giỏ hàng
            navigate('/profile'); // Chuyển đến trang cá nhân

        } catch (err) {
            // Xử lý nếu server trả về lỗi
            const errorMessage = err.response?.data?.message || 'Đã có lỗi xảy ra khi đặt hàng.';
            setError(errorMessage);
            alert(`Đặt hàng thất bại: ${errorMessage}`);
            setIsQrModalOpen(false); // Đóng modal nếu có lỗi
        }
    };


    if (cartItems.length === 0) {
        // Phần này giữ nguyên, không thay đổi
        return (
            <div className="text-center py-20">
                <h1 className="text-3xl font-bold text-gray-700">Giỏ hàng của bạn đang trống</h1>
                <Link to="/products" className="mt-4 inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
                    Tiếp tục mua sắm
                </Link>
            </div>
        );
    }

    // <-- CHÚ THÍCH: Bọc toàn bộ return trong một React Fragment <>...</>
    return (
        <>
            {/* <-- THAY ĐỔI: Sự kiện onSubmit của form sẽ gọi hàm handleProceedToCheckout mới. */}
            <form onSubmit={handleProceedToCheckout} className="bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Giỏ Hàng Của Bạn</h1>
                {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{error}</p>}
                
                {/* Phần hiển thị danh sách sản phẩm và các ô input được giữ nguyên */}
                <div className="space-y-4">
                    {cartItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between border-b pb-4">
                            <div className="flex items-center space-x-4">
                                <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded object-cover"/>
                                <div>
                                    <h2 className="font-semibold text-lg">{item.name}</h2>
                                    <p className="text-gray-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <input 
                                    type="number" 
                                    value={item.quantity} 
                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                    className="w-16 text-center border rounded"
                                    min="1"
                                />
                                <button type="button" onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">Xóa</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8">
                    <label htmlFor="shippingAddress" className="block text-lg font-semibold mb-2 text-gray-800">Địa Chỉ Giao Hàng</label>
                    <textarea
                        id="shippingAddress"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 transition"
                        rows="3"
                        placeholder="Nhập số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                        required
                    ></textarea>
                </div>
                
                <div className="mt-8 flex justify-end items-center">
                    <div className="text-right">
                        <p className="text-xl font-bold text-gray-800">
                            Tổng cộng: <span className="text-blue-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cartTotal)}</span>
                        </p>
                        <button type="submit" className="mt-4 bg-green-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-600 transition-colors">
                            Xác Nhận Đặt Hàng
                        </button>
                    </div>
                </div>
            </form>

            {/* <-- THÊM MỚI: Render component Modal giả lập và truyền các props cần thiết cho nó. --> */}
            <SimulatedQRModal
                isOpen={isQrModalOpen}
                onClose={() => setIsQrModalOpen(false)} // Khi hủy, chỉ cần đóng modal.
                onComplete={handlePaymentComplete}      // Khi hoàn tất, gọi hàm để tạo đơn hàng.
                totalAmount={cartTotal}                 // Truyền tổng tiền vào modal để hiển thị.
            />
        </>
    );
};

export default CartPage;