import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Sẽ dùng ở phần 2

const ProductCard = ({ product }) => {
    const { addToCart } = useCart(); // Sẽ dùng ở phần 2

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
                    <button
                        onClick={() => addToCart(product)}
                        className="..."
                    >
                        Thêm vào giỏ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;