import React from 'react';

const ContactPage = () => {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
                Liên Hệ Với Chúng Tôi
            </h1>
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <p className="text-lg text-gray-700 mb-4">
                    Chúng tôi luôn sẵn lòng lắng nghe bạn. Vui lòng liên hệ qua các thông tin dưới đây hoặc điền vào form liên hệ.
                </p>
                <div className="space-y-3 text-gray-800">
                    <p><strong>Địa chỉ:</strong> 123 Đường ABC, Quận 1, Thành phố Hồ Chí Minh</p>
                    <p><strong>Số điện thoại:</strong> (028) 3812 3456</p>
                    <p><strong>Email:</strong> lienhe@noithatviet.com</p>
                </div>
                <div className="mt-8">
                    {/* Sau này, bạn có thể thêm một form liên hệ thực sự ở đây */}
                    <p className="text-center font-semibold text-blue-600">Form liên hệ sẽ sớm được cập nhật!</p>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;