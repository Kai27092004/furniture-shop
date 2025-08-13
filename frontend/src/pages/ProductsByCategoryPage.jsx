// File: frontend/src/pages/ProductsByCategoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductsByCategory } from '../services/api';
import ProductCard from '../components/ProductCard';

const ProductsByCategoryPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { categoryId } = useParams(); // Lấy categoryId từ URL

    useEffect(() => {
        const getProducts = async () => {
            try {
                setLoading(true);
                const response = await fetchProductsByCategory(categoryId);
                setProducts(response.data);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm theo danh mục:", error);
            } finally {
                setLoading(false);
            }
        };
        getProducts();
    }, [categoryId]); // Chạy lại mỗi khi categoryId trên URL thay đổi

    if (loading) return <p className="text-center">Đang tải sản phẩm...</p>;

    return (
        <div>
            {/* Lấy tên danh mục từ sản phẩm đầu tiên để làm tiêu đề */}
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Danh Mục: {products.length > 0 ? products[0].category.name : ''}
            </h1>
            {products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <p>Không có sản phẩm nào trong danh mục này.</p>
            )}
        </div>
    );
};

export default ProductsByCategoryPage;