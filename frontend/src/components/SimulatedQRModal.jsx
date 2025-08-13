import React from 'react';
import Modal from './common/Modal'; // Tận dụng Modal component đã tạo trước đó

// CHÚ THÍCH: Đây là một ảnh mã QR mẫu, bạn có thể thay bằng bất kỳ ảnh nào bạn muốn.
const placeholderQrImage = 'https://i.imgur.com/g2y9z9G.png'; 

const SimulatedQRModal = ({ isOpen, onClose, onComplete, totalAmount }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Xác Nhận Thanh Toán (Giả Lập)">
            <div className="text-center p-4">
                <p className="mb-4 text-gray-700">
                    Đây là màn hình thanh toán giả lập. Vui lòng quét mã QR bên dưới (giả lập) hoặc nhấn "Hoàn tất" để xác nhận đơn hàng.
                </p>
                
                <div className="flex justify-center my-6">
                    <img 
                        src={placeholderQrImage} 
                        alt="Mã QR Giả Lập" 
                        className="w-64 h-64 border-4 border-gray-300 rounded-lg p-2"
                    />
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="font-semibold">Số tiền cần thanh toán:</p>
                    <p className="text-3xl font-bold text-blue-600 my-2">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
                    </p>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                     <button 
                        type="button"
                        onClick={onClose}
                        className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 font-semibold"
                    >
                        Hủy
                    </button>
                    <button 
                        type="button"
                        onClick={onComplete}
                        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 font-semibold"
                    >
                        Hoàn tất thanh toán
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default SimulatedQRModal;