import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Eye, Heart, ShoppingCart, Star } from 'lucide-react';

const ProductCard = ({ product }) => {
    // --- LOGIC GỐC TỪ PRODUCTCARD.JXS ---
    const { addToCart } = useCart(); //
    const { isAuthenticated } = useAuth(); //
    const navigate = useNavigate(); //

    // Hàm xử lý logic "Thêm vào giỏ" đã được giữ nguyên
    const handleAddToCart = () => { //
        if (isAuthenticated) { //
            addToCart(product); //
            // Bạn có thể thay thế alert bằng một thông báo tinh tế hơn (toast, snackbar)
            alert('Đã thêm sản phẩm vào giỏ hàng!'); //
        } else {
            alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.'); //
            navigate('/login'); //
        }
    };
    
    // --- CÁC STATE VÀ HÀM HỖ TRỢ GIAO DIỆN TỪ PRODUCTCARD.JS ---
    const [isHovered, setIsHovered] = useState(false); //
    const [isFavorited, setIsFavorited] = useState(false); // State cho nút yêu thích

    const formatPrice = (price) => { //
        return new Intl.NumberFormat('vi-VN', { //
            style: 'currency', //
            currency: 'VND' //
        }).format(price);
    };

    const discountPercent = product.originalPrice ?  //
        Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0; //

    // --- GIAO DIỆN MỚI KẾT HỢP LOGIC CŨ ---
    return (
        <div 
            className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 group relative overflow-hidden border"
            onMouseEnter={() => setIsHovered(true)} //
            onMouseLeave={() => setIsHovered(false)} //
        >
            {/* Product Image */}
            <div className="relative overflow-hidden">
                <Link to={`/products/${product.id}`}>
                    <img 
                        src={product.imageUrl} // <-- Sử dụng prop `imageUrl` từ logic cũ
                        alt={product.name}
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105" //
                    />
                </Link>
                
                {product.isHot && ( //
                    <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
                        HOT
                    </span>
                )}

                {discountPercent > 0 && (
                    <span className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 text-xs font-bold rounded">
                        -{discountPercent}%
                    </span>
                )}

                {/* Action Buttons - Hiện khi hover */}
                <div className={`absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center transition-all duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                }`}>
                    <div className="flex space-x-2">
                        <Link to={`/products/${product.id}`} className="bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200 group/btn">
                            <Eye className="h-5 w-5 text-gray-600 group-hover/btn:text-blue-600" />
                        </Link>
                        <button 
                            onClick={() => setIsFavorited(!isFavorited)}
                            className="bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200 group/btn"
                        >
                            <Heart className={`h-5 w-5 transition-colors duration-200 ${
                                isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-600 group-hover/btn:text-red-600'
                            }`} />
                        </button>
                        {/* Nút giỏ hàng gọi hàm handleAddToCart */}
                        <button onClick={handleAddToCart} className="bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200 group/btn">
                            <ShoppingCart className="h-5 w-5 text-gray-600 group-hover/btn:text-green-600" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
                <p className="text-gray-500 text-sm mb-1">{product.category?.name || 'Chưa phân loại'}</p>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 h-14 line-clamp-2">
                     <Link to={`/products/${product.id}`} className="hover:text-blue-600 transition-colors duration-200">
                        {product.name}
                     </Link>
                </h3>

                <div className="flex items-center mb-3">
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`h-4 w-4 ${
                                star <= product.rating //
                                    ? 'text-yellow-400 fill-yellow-400' //
                                    : 'text-gray-300' //
                                }`}
                            />
                        ))}
                    </div>
                    {product.ratingCount > 0 && <span className="text-xs text-gray-500 ml-2">({product.ratingCount} đánh giá)</span>}
                </div>

                <div className="flex items-baseline space-x-2">
                    <span className="text-xl font-bold text-blue-600">
                        {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}
                        </span>
                    )}
                </div>
            </div>

            {/* Quick Add to Cart - Hiện khi hover */}
            <div className={`absolute bottom-0 left-0 right-0 bg-gray-800 text-white text-center font-semibold transition-all duration-300 text-sm ${ //
                isHovered ? 'transform translate-y-0' : 'transform translate-y-full' //
            }`}>
                 {/* Nút "Thêm vào giỏ" cũng gọi hàm handleAddToCart */}
                <button onClick={handleAddToCart} className="w-full p-3 hover:bg-black transition-colors duration-200">
                    Thêm vào giỏ hàng
                </button>
            </div>
        </div>
    );
};

export default ProductCard;