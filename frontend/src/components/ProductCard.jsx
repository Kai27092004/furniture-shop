import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // <-- THÊM MỚI: Import useNavigate
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';    // <-- THÊM MỚI: Import useAuth để kiểm tra đăng nhập

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    
    // --- PHẦN THÊM MỚI BẮT ĐẦU TỪ ĐÂY ---
    const { isAuthenticated } = useAuth(); // Lấy trạng thái đăng nhập
    const navigate = useNavigate(); // Hook để điều hướng trang

    // Hàm xử lý logic khi nhấn nút
    const handleAddToCart = () => {
        // Kiểm tra xem người dùng đã đăng nhập chưa
        if (isAuthenticated) {
            // Nếu đã đăng nhập, thực hiện thêm vào giỏ hàng
            addToCart(product);
            alert('Đã thêm sản phẩm vào giỏ hàng!'); // Có thể thay bằng một thông báo đẹp hơn
        } else {
            // Nếu chưa, thông báo và chuyển hướng đến trang đăng nhập
            alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.');
            navigate('/login');
        }
    };
    // --- KẾT THÚC PHẦN THÊM MỚI ---

    return (
        <div className="bg-white border rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <Link to={`/products/${product.id}`}>
                <img src={product.imageUrl} alt={product.name} className="w-full h-56 object-cover" />
            </Link>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                    <Link to={`/products/${product.id}`} className="hover:text-blue-600">{product.name}</Link>
                </h3>
                <p className="text-gray-500 text-sm mt-1">{product.category?.name || 'Chưa phân loại'}</p>
                <div className="flex justify-between items-center mt-4">
                    <p className="text-xl font-bold text-blue-600">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </p>
                    {/* <-- CHÚ THÍCH: Thay đổi onClick để gọi hàm handleAddToCart mới */}
                    <button 
                        onClick={handleAddToCart}
                        className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-black transition-colors text-sm font-semibold"
                    >
                        Thêm vào giỏ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;