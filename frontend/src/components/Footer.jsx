import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto px-6 py-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Cột 1: Giới thiệu */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">NỘI THẤT VIỆT</h3>
                        <p className="text-gray-400">
                            Mang đến những sản phẩm nội thất chất lượng, tinh tế và bền vững cho không gian sống của bạn.
                        </p>
                    </div>

                    {/* Cột 2: Liên kết nhanh */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Liên Kết Nhanh</h3>
                        <ul className="space-y-2">
                            <li><Link to="/products" className="text-gray-400 hover:text-white">Sản Phẩm</Link></li>
                            <li><Link to="/collections" className="text-gray-400 hover:text-white">Bộ Sưu Tập</Link></li>
                            <li><Link to="/news" className="text-gray-400 hover:text-white">Tin Tức</Link></li>
                            <li><Link to="/contact" className="text-gray-400 hover:text-white">Liên Hệ</Link></li>
                        </ul>
                    </div>

                    {/* Cột 3: Hỗ trợ khách hàng */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Hỗ Trợ</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white">Câu Hỏi Thường Gặp</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Chính Sách Bảo Hành</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Hướng Dẫn Vận Chuyển</a></li>
                        </ul>
                    </div>

                    {/* Cột 4: Thông tin liên hệ */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Kết Nối Với Chúng Tôi</h3>
                        <p className="text-gray-400 mb-2">123 Đường ABC, Quận 1, TP.HCM</p>
                        <p className="text-gray-400 mb-4">Email: lienhe@noithatviet.com</p>
                        {/* Bạn có thể thêm các icon mạng xã hội ở đây */}
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Nội Thất Việt. Đã đăng ký bản quyền.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;