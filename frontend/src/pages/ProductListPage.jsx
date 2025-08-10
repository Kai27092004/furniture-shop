import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../services/api';
import ProductCard from '../components/ProductCard'; // Import component mới
// import ProductCard from '../components/ProductCard'; // Sẽ tạo sau

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getProducts = async () => {
            try {
                const response = await fetchProducts();
                setProducts(response.data);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        getProducts();
    }, []);

    if (loading) {
        return <p className="text-center text-gray-500">Đang tải sản phẩm...</p>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Tất Cả Sản Phẩm</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default ProductListPage;