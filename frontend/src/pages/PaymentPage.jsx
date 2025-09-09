// src/pages/PaymentPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMyOrders, updateOrderStatus } from '../services/api';
import { useCart } from '../context/CartContext';

const PaymentPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isConfirming, setIsConfirming] = useState(false);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderId) {
                setError('Không tìm thấy mã đơn hàng.');
                setLoading(false);
                return;
            }
            try {
                const response = await fetchMyOrders();
                const currentOrder = response.data.find(o => String(o.id) === String(orderId));
                
                if (currentOrder) {
                    if (currentOrder.status !== 'pending') {
                        setError('Đơn hàng này đã được xử lý hoặc đã bị hủy.');
                    } else {
                        setOrder(currentOrder);
                    }
                } else {
                    setError('Không tìm thấy đơn hàng hợp lệ.');
                }
            } catch (err) {
                setError('Không thể tải thông tin đơn hàng.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    const handleConfirmPayment = async () => {
        setIsConfirming(true);
        setError('');
        try {
            await updateOrderStatus(orderId, 'processing');
            clearCart();
            navigate('/order-success', { state: { orderId } });
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi xác nhận thanh toán.';
            setError(errorMessage);
            alert(`Lỗi: ${errorMessage}`);
        } finally {
            setIsConfirming(false);
        }
    };

    if (loading) {
        return <div className="text-center p-10 min-h-screen bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 flex items-start justify-center pt-20">Đang tải thông tin thanh toán...</div>;
    }

    if (error) {
        return <div className="text-center p-10 min-h-screen bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 flex items-start justify-center pt-20 text-red-500">{error}</div>;
    }

    if (!order) {
        return <div className="text-center p-10 min-h-screen bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 flex items-start justify-center pt-20">Không có thông tin đơn hàng.</div>;
    }
    
    const formattedAmount = new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND' 
    }).format(order.totalAmount);

    return (
        <div className="flex items-start justify-center min-h-screen bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 p-4 pb-20">
            <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-md text-center border">
                <h1 className="text-3xl font-bold text-gray-800">Xác nhận Thanh toán</h1>
                <p className="text-gray-600">
                    Mã đơn hàng: <span className="font-bold text-blue-600">#{order.id}</span>
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-700">Tổng tiền cần thanh toán:</p>
                    <p className="text-4xl font-bold text-[#A25F4B] my-2">
                        {formattedAmount}
                    </p>
                </div>

                <p className="text-gray-600">
                    Vui lòng quét mã QR bên dưới để hoàn tất.
                </p>

                <div className="flex justify-center my-4">
                    <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=Thanh+toan+don+hang+SHOPNK+${order.totalAmount}`} 
                        alt="Mã QR thanh toán"
                        className="rounded-lg border p-1"
                    />
                </div>
                
                
                {error && <p className="text-red-500 text-sm">{error}</p>}
                
                <button
                    onClick={handleConfirmPayment}
                    disabled={isConfirming}
                    className="w-full px-6 py-3 mt-4 rounded-lg bg-green-600 text-white font-semibold shadow-sm hover:bg-green-700 transition text-base disabled:bg-gray-400"
                >
                    {isConfirming ? 'Đang xác nhận...' : 'Tôi đã hoàn tất thanh toán'}
                </button>
            </div>
        </div>
    );
};

export default PaymentPage;