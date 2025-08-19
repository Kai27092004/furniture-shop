import React, { useState, useEffect } from 'react';
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
            case 'pending': return 'Chờ thanh toán';
            case 'processing': return 'Đã thanh toán';
            case 'shipped': return 'Đang vận chuyển';
            case 'delivered': return 'Đã giao hàng';
            case 'cancelled': return 'Đã hủy đơn';
            default: return status;
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

    const handlePaymentComplete = async () => {
        if (!currentOrderInfo) return;
        try {
            await updateOrderStatus(currentOrderInfo.id, 'processing');
            setIsQrModalOpen(false);
            alert('Xác nhận thanh toán thành công!');
            loadData();
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi xác nhận thanh toán.";
            alert(`Lỗi: ${errorMessage}`);
            setIsQrModalOpen(false);
        }
    };

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

    if (loading) return <p className="text-center mt-10">Đang tải trang hồ sơ...</p>;
    if (!profile) return <p className="text-center mt-10 text-red-500">Không thể tải thông tin cá nhân.</p>;

    return (
        <>
            <div className="container mx-auto p-4 space-y-8">
                {/* Phần thông tin cá nhân (Giữ nguyên) */}
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                    <div className="flex flex-col items-center md:items-center md:flex-row gap-4 w-full md:w-auto">
                        <img
                            src={profile.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName)}&background=random`}
                            alt="avatar"
                            className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
                        />
                        <div className="md:ml-4 flex flex-col items-center md:items-start">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{profile.fullName}</h2>
                        </div>
                    </div>
                    <div className="flex flex-col items-start w-full md:w-auto md:items-end text-base mt-4 md:mt-0">
                        <p className="mb-1"><span className="font-semibold">Email:</span> {profile.email}</p>
                        <p className="mb-1"><span className="font-semibold">SĐT:</span> {profile.phone || 'Chưa cập nhật'}</p>
                        <p><span className="font-semibold">Địa chỉ:</span> {profile.address || 'Chưa cập nhật'}</p>
                    </div>
                </div>

                {/* --- PHẦN LỊCH SỬ ĐƠN HÀNG ĐÃ ĐƯỢC CẬP NHẬT GIAO DIỆN --- */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">Lịch Sử Đơn Hàng</h2>
                    {orders.length > 0 ? (
                        <div className="space-y-6">
                            {orders.map(order => {
                                const isPending = order.status === 'pending';
                                let statusColor = '';
                                if (order.status === 'processing' || order.status === 'delivered') {
                                    statusColor = 'bg-green-100 text-green-800';
                                } else if (order.status === 'cancelled') {
                                    statusColor = 'bg-red-100 text-red-800';
                                } else { // pending
                                    statusColor = 'bg-yellow-100 text-yellow-800';
                                }
                                
                                return (
                                    <div key={order.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                                            <h3 className="text-lg font-bold">Đơn hàng #{order.id}</h3>
                                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColor}`}>
                                                {getStatusText(order.status)}
                                            </span>
                                            <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString('vi-VN')}</span>
                                        </div>
                                        <div className="border-t pt-2 mt-2">
                                            {order.items.map(item => (
                                                <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                                                    <span>{item.product?.name || '[Sản phẩm không còn tồn tại]'} x {item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between font-bold text-lg mt-2 border-t pt-2">
                                            {isPending ? (
                                                <div className="flex gap-2 mr-4">
                                                    <button
                                                        className="px-3 py-1 text-sm rounded-full font-semibold bg-blue-500 text-white shadow hover:bg-blue-600 transition-colors"
                                                        onClick={() => handleContinuePayment(order)}
                                                    >
                                                        Tiếp tục thanh toán
                                                    </button>
                                                    <button
                                                        className="px-3 py-1 text-sm rounded-full font-semibold bg-red-500 text-white shadow hover:bg-red-600 transition-colors"
                                                        onClick={() => handleCancelOrder(order.id)}
                                                    >
                                                        Hủy đơn hàng
                                                    </button>
                                                </div>
                                            ) : <div />}
                                            <span>Tổng cộng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}</span>
                                        </div>
                                    </div>
                                );
                            })}
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