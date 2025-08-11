import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Kiểm tra mật khẩu có khớp không ở phía client
        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }

        try {
            // Gọi API đăng ký
            const response = await register({
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password
            });
            setSuccess(response.data.message + ' Bạn sẽ được chuyển đến trang đăng nhập sau 3 giây.');
            
            // Tự động chuyển đến trang đăng nhập sau 3 giây
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (err) {
            // Hiển thị lỗi từ server (ví dụ: email đã tồn tại)
            const errorMessage = err.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
            setError(errorMessage);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-2xl font-bold text-center mb-6">Tạo Tài Khoản Mới</h2>
                
                {/* Hiển thị thông báo lỗi hoặc thành công */}
                {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{error}</p>}
                {success && <p className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center">{success}</p>}

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">Họ và Tên</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" id="fullName" name="fullName" type="text" placeholder="Nguyễn Văn A" value={formData.fullName} onChange={handleChange} required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" id="email" name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Mật khẩu</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" id="password" name="password" type="password" placeholder="******************" value={formData.password} onChange={handleChange} required />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">Xác nhận Mật khẩu</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" id="confirmPassword" name="confirmPassword" type="password" placeholder="******************" value={formData.confirmPassword} onChange={handleChange} required />
                </div>
                <div className="flex items-center justify-between">
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="submit">
                        Đăng Ký
                    </button>
                </div>
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Đã có tài khoản?{' '}
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Đăng nhập tại đây
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;