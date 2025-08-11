// File: frontend/src/pages/CartPage.jsx

// <-- THÊM MỚI: Import thêm useState để quản lý state của form.
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom'; // <-- THÊM MỚI: Import useNavigate để chuyển trang.
import { useAuth } from '../context/AuthContext';    // <-- THÊM MỚI: Import useAuth để kiểm tra đăng nhập.
import { createOrder } from '../services/api';      // <-- THÊM MỚI: Import hàm API để tạo đơn hàng.

const CartPage = () => {
    // <-- CHÚ THÍCH: Lấy thêm hàm clearCart từ useCart.
    const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    
    // <-- PHẦN THÊM MỚI BẮT ĐẦU TỪ ĐÂY ---
    const { isAuthenticated } = useAuth(); // Lấy trạng thái đăng nhập của người dùng.
    const navigate = useNavigate(); // Hook để điều hướng trang.

    // State để lưu địa chỉ giao hàng người dùng nhập vào.
    const [shippingAddress, setShippingAddress] = useState('');
    // State để hiển thị thông báo lỗi nếu có.
    const [error, setError] = useState('');

    // Hàm xử lý logic chính khi người dùng nhấn nút thanh toán.
    const handleCheckout = async (e) => {
        e.preventDefault(); // Ngăn form reload lại trang.
        setError(''); // Xóa lỗi cũ trước khi thực hiện.

        // 1. Kiểm tra xem người dùng đã đăng nhập chưa.
        if (!isAuthenticated) {
            alert('Vui lòng đăng nhập để có thể đặt hàng.');
            navigate('/login'); // Nếu chưa, chuyển đến trang đăng nhập.
            return;
        }

        // 2. Kiểm tra xem người dùng đã nhập địa chỉ giao hàng chưa.
        if (!shippingAddress.trim()) {
            setError('Vui lòng nhập địa chỉ giao hàng.');
            return;
        }

        // 3. Gọi API để tạo đơn hàng.
        try {
            // Gửi thông tin giỏ hàng và địa chỉ lên server.
            await createOrder({
                cartItems: cartItems,
                shippingAddress: shippingAddress,
            });

            alert('Đặt hàng thành công!');
            clearCart(); // Xóa sạch sản phẩm trong giỏ hàng.
            navigate('/profile'); // Chuyển người dùng đến trang cá nhân để xem lịch sử đơn hàng.

        } catch (err) {
            // Xử lý nếu server trả về lỗi (ví dụ: hết hàng).
            const errorMessage = err.response?.data?.message || 'Đã có lỗi xảy ra khi đặt hàng.';
            setError(errorMessage);
            alert(`Đặt hàng thất bại: ${errorMessage}`);
        }
    };
    // --- KẾT THÚC PHẦN THÊM MỚI ---

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

    // <-- CHÚ THÍCH: Bọc toàn bộ phần hiển thị giỏ hàng trong một thẻ <form> và gắn hàm handleCheckout vào sự kiện onSubmit.
    return (
        <form onSubmit={handleCheckout} className="bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Giỏ Hàng Của Bạn</h1>

            {/* <-- THÊM MỚI: Vị trí để hiển thị thông báo lỗi. */}
            {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{error}</p>}

            {/* Phần hiển thị danh sách sản phẩm trong giỏ hàng giữ nguyên, không thay đổi */}
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

            {/* <-- THÊM MỚI: Khu vực nhập địa chỉ giao hàng. */}
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
                    {/* <-- CHÚ THÍCH: Thêm type="submit" vào nút để nó có thể kích hoạt sự kiện onSubmit của form. */}
                    <button type="submit" className="mt-4 bg-green-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-600 transition-colors">
                        Xác Nhận Đặt Hàng
                    </button>
                </div>
            </div>
        </form>
    );
};

export default CartPage;