// File: frontend/src/pages/ProfilePage.jsx

import React, { useState, useEffect } from 'react';
// <-- CHÚ THÍCH: Thêm hàm updateOrderStatus vào danh sách import
import { fetchUserProfile, fetchMyOrders, cancelOrder, updateOrderStatus } from '../services/api';
import SimulatedQRModal from '../components/SimulatedQRModal';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [currentOrderInfo, setCurrentOrderInfo] = useState(null);

    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return 'Chờ thanh toán';
            case 'processing':
                return 'Đã thanh toán';
            case 'shipped':
                return 'Đang vận chuyển';
            case 'delivered':
                return 'Đã giao hàng';
            case 'cancelled':
                return 'Đã hủy đơn';
            default:
                return status;
        }
    };

    const loadData = async () => {
        try {
            setLoading(true); 
            const profileRes = await fetchUserProfile();
            const ordersRes = await fetchMyOrders();
            setProfile(profileRes.data);
            setOrders(ordersRes.data);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu trang cá nhân:", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        loadData();
    }, []);
    
    const handleContinuePayment = (order) => {
        setCurrentOrderInfo({ id: order.id, amount: order.totalAmount });
        setIsQrModalOpen(true);
    };

    const handleCloseQrModal = () => {
        setIsQrModalOpen(false);
        setCurrentOrderInfo(null);
    };

    // --- PHẦN THAY ĐỔI LOGIC NẰM Ở ĐÂY ---
    // <-- CHÚ THÍCH: Hàm này đã được viết lại hoàn toàn để gọi API thật.
    const handlePaymentComplete = async () => {
        // Kiểm tra xem có thông tin đơn hàng đang chờ xử lý không
        if (!currentOrderInfo) return;

        try {
            // BƯỚC 1: Gọi API để cập nhật trạng thái đơn hàng thành 'processing'
            await updateOrderStatus(currentOrderInfo.id, 'processing');

            // BƯỚC 2: Đóng modal và thông báo thành công
            setIsQrModalOpen(false);
            alert('Xác nhận thanh toán thành công!');

            // BƯỚC 3: Tải lại dữ liệu để cập nhật danh sách đơn hàng trên giao diện
            loadData();
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi xác nhận thanh toán.";
            alert(`Lỗi: ${errorMessage}`);
            setIsQrModalOpen(false);
        }
    };
    // --- KẾT THÚC PHẦN THAY ĐỔI LOGIC ---

    const handleCancelOrder = async (orderId) => {
        if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
            try {
                const response = await cancelOrder(orderId);
                alert(response.data.message);
                loadData();
            } catch (error) {
                const errorMessage = error.response?.data?.message || "Đã có lỗi xảy ra.";
                alert(`Lỗi: ${errorMessage}`);
            }
        }
    };

    if (loading) {
        return <p className="text-center">Đang tải...</p>;
    }

    if (!profile) {
        return <p className="text-center text-red-500">Không thể tải thông tin cá nhân.</p>;
    }

    return (
        <>
            <div className="grid md:grid-cols-3 gap-8">
                {/* Cột thông tin cá nhân (Giữ nguyên, không thay đổi) */}
                <div className="md:col-span-1 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-2xl font-bold mb-4">Thông Tin Cá Nhân</h2>
                    <div className="space-y-3">
                        <p><strong>Họ và tên:</strong> {profile.fullName}</p>
                        <p><strong>Email:</strong> {profile.email}</p>
                        <p><strong>Số điện thoại:</strong> {profile.phone || 'Chưa cập nhật'}</p>
                        <p><strong>Địa chỉ:</strong> {profile.address || 'Chưa cập nhật'}</p>
                    </div>
                    <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                        Chỉnh sửa thông tin
                    </button>
                </div>

                {/* Cột lịch sử đơn hàng (Giữ nguyên, không thay đổi) */}
                <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-2xl font-bold mb-4">Lịch Sử Đơn Hàng</h2>
                    {orders.length > 0 ? (
                        <div className="space-y-6">
                            {orders.map(order => (
                                <div key={order.id} className="border border-gray-200 p-4 rounded-lg shadow-sm">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="font-bold text-gray-800">Mã đơn: <span className="font-mono text-blue-600">#{order.id}</span></p>
                                            <p className="text-sm text-gray-500">Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                                            <p className="text-sm text-gray-500">Giao đến: {order.shippingAddress}</p>
                                        </div>
                                        <span className={`font-semibold capitalize px-3 py-1 rounded-full text-sm ${
                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>{getStatusText(order.status)}</span>
                                    </div>
                                    <div className="border-t border-gray-200 my-3"></div>
                                    <p className="font-semibold mb-2">Chi tiết sản phẩm:</p>
                                    <ul className="space-y-3">
                                        {order.items.map(item => (
                                            <li key={item.id} className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <img src={item.product?.imageUrl} alt={item.product?.name} className="w-14 h-14 rounded object-cover mr-4"/>
                                                    <div>
                                                        <p className="font-medium text-gray-800">{item.product?.name || '[Sản phẩm không còn tồn tại]'}</p>
                                                        <p className="text-sm text-gray-500">Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</p>
                                                    </div>
                                                </div>
                                                <span className="text-gray-700 font-medium">Số lượng: {item.quantity}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="border-t border-gray-200 my-3"></div>
                                    <p className="text-right font-bold text-lg text-gray-800">
                                        Tổng cộng: <span className="text-red-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}</span>
                                    </p>
                                    {order.status === 'pending' && (
                                        <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
                                            <button 
                                                onClick={() => handleCancelOrder(order.id)}
                                                className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-200 transition-colors"
                                            >
                                                Hủy đơn hàng
                                            </button>
                                            <button 
                                                onClick={() => handleContinuePayment(order)}
                                                className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-600 transition-colors"
                                            >
                                                Tiếp tục thanh toán
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Bạn chưa có đơn hàng nào.</p>
                    )}
                </div>
            </div>
            
            <SimulatedQRModal
                isOpen={isQrModalOpen}
                onClose={handleCloseQrModal}
                onComplete={handlePaymentComplete}
                totalAmount={currentOrderInfo?.amount || 0}
            />
        </>
    );
};

export default ProfilePage;