import React from 'react';
import Modal from './common/Modal';

const SimulatedQRModal = ({ isOpen, onClose, onComplete, totalAmount }) => {
    if (!isOpen) {
        return null;
    }

    // Định dạng tiền tệ
    const formattedAmount = new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND' 
    }).format(totalAmount);

    return (
        // Sử dụng Modal component chung
        <Modal isOpen={isOpen} onClose={onClose} title="Xác nhận Thanh toán">
            <div className="text-center p-4">
                
                {/* Nội dung đã được cập nhật giống PaymentPage.js */}
                <p className="text-xl text-black font-bold mb-2">
                    Tổng tiền hóa đơn cần thanh toán là: {formattedAmount}
                </p>
                
                <p className="text-gray-600 mb-4">
                    Vui lòng quét mã QR để hoàn tất thanh toán (giả lập) và nhấn nút xác nhận bên dưới.
                </p>

                <div className="flex justify-center my-6">
                    {/* Sử dụng QR code động từ API */}
                    <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=Thanh+toan+don+hang+SHOPNK+${totalAmount}`} 
                        alt="QR Code" 
                        className="rounded-lg border shadow-sm"
                    />
                </div>

                {/* Các nút bấm được giữ lại theo logic Modal */}
                <div className="flex justify-end space-x-4 mt-8 pt-4 border-t">
                     <button 
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold transition-colors"
                    >
                        Hủy
                    </button>
                    <button 
                        type="button"
                        onClick={onComplete}
                        className="px-6 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Tôi đã hoàn tất thanh toán
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default SimulatedQRModal;