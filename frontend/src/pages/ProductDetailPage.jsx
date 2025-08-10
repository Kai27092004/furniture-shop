import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../services/api';
import { useCart } from '../context/CartContext'; // Sẽ dùng ở phần 2

const ProductDetailPage = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams(); // Lấy ID từ URL
    const { addToCart } = useCart(); // Sẽ dùng ở phần 2

    useEffect(() => {
        const getProduct = async () => {
            try {
                setLoading(true);
                const response = await fetchProductById(id);
                setProduct(response.data);
            } catch (error) {
                console.error("Lỗi khi tải chi tiết sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        getProduct();
    }, [id]); // Chạy lại useEffect khi id thay đổi

    if (loading) {
        return <p className="text-center text-gray-500 mt-10">Đang tải...</p>;
    }

    if (!product) {
        return <p className="text-center text-red-500 mt-10">Không tìm thấy sản phẩm.</p>;
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="grid md:grid-cols-2 gap-10">
                {/* Phần hình ảnh */}
                <div>
                    <img src={product.imageUrl} alt={product.name} className="w-full h-auto object-cover rounded-lg" />
                </div>

                {/* Phần thông tin và mua hàng */}
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
                    <p className="text-gray-500 mb-4">SKU: {product.sku || 'N/A'}</p>
                    <p className="text-4xl font-bold text-blue-600 mb-6">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </p>

                    <div className="mb-6">
                        <h3 className="font-semibold text-lg mb-2">Thông tin chi tiết:</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                            <li><strong>Chất liệu:</strong> {product.material || 'Đang cập nhật'}</li>
                            <li><strong>Kích thước:</strong> {product.dimensions || 'Đang cập nhật'}</li>
                            <li><strong>Danh mục:</strong> {product.category?.name || 'Đang cập nhật'}</li>
                        </ul>
                    </div>

                    <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

                    <button
                        onClick={() => addToCart(product)}
                        className="..."
                    >
                        Thêm vào Giỏ Hàng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;