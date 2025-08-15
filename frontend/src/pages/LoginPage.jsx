import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError('Đăng nhập thất bại. Vui lòng kiểm tra lại email hoặc mật khẩu.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f9f8f4] via-[#f5f4f0] to-[#f1f0ec] flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 20% 50%, #A25F4B 1px, transparent 1px), radial-gradient(circle at 80% 50%, #8B4A3A 1px, transparent 1px)`,
                    backgroundSize: '100px 100px'
                }}></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Main Form Container */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                    {/* Header with gradient */}
                    <div className="bg-gradient-to-r from-[#A25F4B] to-[#8B4A3A] px-8 py-8 text-center">
                        <h1 className="text-3xl font-bold text-white">Đăng nhập</h1>
                        {/* ĐÃ XÓA: Dấu gạch dưới */}
                    </div>

                    {/* Form Content */}
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && <p className="bg-red-100 text-red-700 p-3 rounded-xl mb-4 text-center text-sm">{error}</p>}

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Email của bạn</label>
                                <div className="relative">
                                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="email"
                                        placeholder="example@shopnk.com"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:border-[#A25F4B] focus:ring-2 focus:ring-[#A25F4B]/20 outline-none transition-all duration-200 placeholder-gray-400"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                                <div className="relative">
                                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Nhập mật khẩu của bạn"
                                        className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:border-[#A25F4B] focus:ring-2 focus:ring-[#A25F4B]/20 outline-none transition-all duration-200 placeholder-gray-400"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#A25F4B] transition-colors duration-200">
                                        {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-[#A25F4B] to-[#8B4A3A] text-white font-semibold py-3 px-4 rounded-xl hover:from-[#8B4A3A] hover:to-[#7A3F2F] focus:outline-none focus:ring-2 focus:ring-[#A25F4B]/50 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none">
                                {isLoading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Đang đăng nhập...</span>
                                    </div>
                                ) : (
                                    'Đăng nhập ngay'
                                )}
                            </button>

                            <div className="text-center">
                                <span className="text-gray-600">Chưa có tài khoản? </span>
                                <Link to="/register" className="text-[#A25F4B] hover:text-[#8B4A3A] font-semibold hover:underline transition-colors duration-200">
                                    Đăng ký miễn phí
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;