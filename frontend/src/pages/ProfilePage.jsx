import React, { useState, useEffect } from 'react';
import { fetchUserProfile, fetchMyOrders } from '../services/api';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
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
        loadData();
    }, []);

    if (loading) {
        return <p className="text-center">Đang tải...</p>;
    }

    if (!profile) {
        return <p className="text-center text-red-500">Không thể tải thông tin cá nhân.</p>;
    }

    return (
        <div className="grid md:grid-cols-3 gap-8">
            {/* Cột thông tin cá nhân */}
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

            {/* Cột lịch sử đơn hàng */}
            <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4">Lịch Sử Đơn Hàng</h2>
                {orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <div key={order.id} className="border p-4 rounded-md">
                                <p><strong>Mã đơn:</strong> #{order.id}</p>
                                <p><strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                                <p><strong>Tổng tiền:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}</p>
                                <p><strong>Trạng thái:</strong> <span className="font-semibold">{order.status}</span></p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Bạn chưa có đơn hàng nào.</p>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;