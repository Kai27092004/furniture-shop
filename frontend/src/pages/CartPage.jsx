// File: frontend/src/pages/CartPage.jsx

// <-- CHÚ THÍCH: Import thêm hàm updateOrderStatus từ API service.
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createOrder, updateOrderStatus } from '../services/api'; // <--- THÊM updateOrderStatus
import SimulatedQRModal from '../components/SimulatedQRModal';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [shippingAddress, setShippingAddress] = useState('');
    const [error, setError] = useState('');
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);

    const handleProceedToCheckout = (e) => {
        e.preventDefault();
        setError('');
        if (!isAuthenticated) {
            alert('Vui lòng đăng nhập để có thể đặt hàng.');
            navigate('/login');
            return;
        }
        if (!shippingAddress.trim()) {
            setError('Vui lòng nhập địa chỉ giao hàng.');
            return;
        }
        setIsQrModalOpen(true);
    };

    // --- PHẦN THAY ĐỔI LOGIC NẰM Ở ĐÂY ---
    // <-- CHÚ THÍCH: Hàm này được gọi khi người dùng nhấn "Hoàn tất" trong Modal giả lập.
    const handlePaymentComplete = async () => {
        try {
            // BƯỚC 1: Gọi API để tạo đơn hàng. Đơn hàng sẽ có status mặc định là 'pending'.
            const response = await createOrder({
                cartItems: cartItems,
                shippingAddress: shippingAddress,
            });
            
            const newOrder = response.data; // Lấy dữ liệu đơn hàng mới (bao gồm orderId)

            // BƯỚC 2: Ngay sau khi tạo thành công, gọi API thứ hai để cập nhật trạng thái.
            // <-- THAY ĐỔI: Thêm bước gọi API updateOrderStatus.
            // Chúng ta cập nhật trạng thái thành "processing", coi như "đã thanh toán".
            if (newOrder && newOrder.orderId) {
                await updateOrderStatus(newOrder.orderId, 'processing');
            }
            
            // BƯỚC 3: Hoàn tất quy trình và thông báo cho người dùng.
            setIsQrModalOpen(false); // Đóng modal
            alert('Đặt hàng và thanh toán thành công!');
            clearCart(); // Xóa giỏ hàng
            navigate('/profile'); // Chuyển đến trang cá nhân

        } catch (err) {
            // Xử lý nếu có lỗi ở bất kỳ bước nào.
            const errorMessage = err.response?.data?.message || 'Đã có lỗi xảy ra khi đặt hàng.';
            setError(errorMessage);
            alert(`Đặt hàng thất bại: ${errorMessage}`);
            setIsQrModalOpen(false); // Đóng modal nếu có lỗi
        }
    };
    // --- KẾT THÚC PHẦN THAY ĐỔI LOGIC ---


    if (cartItems.length === 0) {
        // Phần này giữ nguyên, không thay đổi.
        return (
            <div className="text-center py-20">
                <h1 className="text-3xl font-bold text-gray-700">Giỏ hàng của bạn đang trống</h1>
                <Link to="/products" className="mt-4 inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
                    Tiếp tục mua sắm
                </Link>
            </div>
        );
    }

    return (
        <>
            <form onSubmit={handleProceedToCheckout} className="bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Giỏ Hàng Của Bạn</h1>
                {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{error}</p>}
                
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

            <SimulatedQRModal
                isOpen={isQrModalOpen}
                onClose={() => setIsQrModalOpen(false)}
                onComplete={handlePaymentComplete}
                totalAmount={cartTotal}
            />
        </>
    );
};

export default CartPage;