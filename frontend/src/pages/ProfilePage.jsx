// File: frontend/src/pages/ProfilePage.jsx

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

            {/* Cột lịch sử đơn hàng */}
            <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4">Lịch Sử Đơn Hàng</h2>
                {orders.length > 0 ? (
                    <div className="space-y-6"> {/* <-- CHÚ THÍCH: Tăng khoảng cách giữa các đơn hàng */}
                        {orders.map(order => (
                            // <-- CHÚ THÍCH: Thêm border và padding để mỗi đơn hàng trông rõ ràng hơn
                            <div key={order.id} className="border border-gray-200 p-4 rounded-lg shadow-sm">
                                
                                {/* --- Phần thông tin chung của đơn hàng (Đã được làm đẹp hơn) --- */}
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="font-bold text-gray-800">Mã đơn: <span className="font-mono text-blue-600">#{order.id}</span></p>
                                        <p className="text-sm text-gray-500">Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                                        <p className="text-sm text-gray-500">Giao đến: {order.shippingAddress}</p>
                                    </div>
                                    <span className="font-semibold capitalize bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{order.status}</span>
                                </div>

                                {/* --- PHẦN THÊM MỚI BẮT ĐẦU TỪ ĐÂY: HIỂN THỊ CHI TIẾT SẢN PHẨM --- */}
                                <div className="border-t border-gray-200 my-3"></div>
                                <p className="font-semibold mb-2">Chi tiết sản phẩm:</p>
                                <ul className="space-y-3">
                                    {/* <-- CHÚ THÍCH: Lặp qua mảng `order.items` mà API đã trả về */}
                                    {order.items.map(item => (
                                        <li key={item.id} className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                {/* <-- CHÚ THÍCH: Dùng optional chaining `?.` để tránh lỗi nếu sản phẩm đã bị xóa */}
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
                                {/* --- KẾT THÚC PHẦN THÊM MỚI --- */}

                                <div className="border-t border-gray-200 my-3"></div>

                                <p className="text-right font-bold text-lg text-gray-800">
                                    Tổng cộng: <span className="text-red-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}</span>
                                </p>
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