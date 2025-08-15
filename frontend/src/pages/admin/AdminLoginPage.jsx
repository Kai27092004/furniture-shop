import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/admin/dashboard";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const userData = await login(email, password);
            // Quan trọng: Kiểm tra role sau khi đăng nhập
            if (userData.role !== 'admin') {
                setError('Tài khoản của bạn không có quyền quản trị.');
                // Đăng xuất ngay lập tức nếu không phải admin
                logout(); 
                return;
            }
            navigate(from, { replace: true });
        } catch (err) {
            setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center text-gray-800">Admin Login</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <p className="bg-red-100 text-red-700 p-3 rounded text-center">{error}</p>}
                    <div>
                        <label /* ... */ >Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-3 border rounded-md"/>
                    </div>
                    <div>
                        <label /* ... */ >Mật khẩu</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-3 border rounded-md"/>
                    </div>
                    <button type="submit" className="w-full py-3 px-4 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700">
                        Đăng Nhập
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;