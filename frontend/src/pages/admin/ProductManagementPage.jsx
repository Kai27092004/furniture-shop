import React, { useState, useEffect } from 'react';
import { fetchProducts, deleteProduct, createProduct, updateProduct, fetchCategories, BACKEND_URL } from '../../services/api';
import Modal from '../../components/common/Modal';
import ProductForm from '../../components/admin/ProductForm';

const ProductManagementPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State cho Modal và Form
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null); // null: thêm mới, object: sửa

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            const [productsRes, categoriesRes] = await Promise.all([
                fetchProducts(),
                fetchCategories()
            ]);
            setProducts(productsRes.data);
            setCategories(categoriesRes.data);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleOpenModalForCreate = () => {
        setEditingProduct(null); // Đảm bảo form trống để thêm mới
        setIsModalOpen(true);
    };

    const handleOpenModalForEdit = (product) => {
        setEditingProduct(product); // Đặt sản phẩm cần sửa
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };
    
    const handleDelete = async (productId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
            try {
                await deleteProduct(productId);
                alert('Xóa sản phẩm thành công!');
                loadInitialData();
            } catch (error) {
                console.error('Lỗi khi xóa sản phẩm:', error);
                alert('Xóa sản phẩm thất bại.');
            }
        }
    };
    
    const handleFormSubmit = async (formData) => {
        try {
            if (editingProduct) {
                // Chế độ sửa
                await updateProduct(editingProduct.id, formData);
                alert('Cập nhật sản phẩm thành công!');
            } else {
                // Chế độ thêm mới
                await createProduct(formData);
                alert('Thêm sản phẩm mới thành công!');
            }
            handleCloseModal();
            loadInitialData(); // Tải lại dữ liệu
        } catch (error) {
            console.error('Lỗi khi lưu sản phẩm:', error);
            alert('Lưu sản phẩm thất bại.');
        }
    };

    const handleViewProduct = (productId) => {
        // Chức năng xem chi tiết sản phẩm (chưa triển khai)
        alert(`Xem chi tiết sản phẩm ID: ${productId}`);
    };

    if (loading) return <p>Đang tải...</p>;

    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-xl font-medium">Quản lý Sản phẩm</h1>
                        <p className="text-gray-500 text-sm">Thêm, sửa, xóa và quản lý các sản phẩm</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center">
                            <span className="mr-2">Tổng sản phẩm:</span>
                            <span className="text-blue-600 font-medium">{products.length}</span>
                        </div>
                        <button 
                            onClick={handleOpenModalForCreate} 
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            + Thêm sản phẩm
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <div className="relative flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên sản phẩm..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                        <svg 
                            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
                        <option value="">Tất cả danh mục</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="bg-white rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="text-left text-sm font-medium text-gray-500">
                                <th className="py-3 px-4">ID</th>
                                <th className="py-3 px-4">Hình Ảnh</th>
                                <th className="py-3 px-4">Tên Sản Phẩm</th>
                                <th className="py-3 px-4">Giá</th>
                                <th className="py-3 px-4">Số Lượng</th>
                                <th className="py-3 px-4 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {products.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4">{product.id}</td>
                                    <td className="py-3 px-4">
                                        <img 
                                            src={`${BACKEND_URL}${product.imageUrl}`} 
                                            alt={product.name} 
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                    </td>
                                    <td className="py-3 px-4">{product.name}</td>
                                    <td className="py-3 px-4">{new Intl.NumberFormat('vi-VN').format(product.price)} đ</td>
                                    <td className="py-3 px-4">{product.stockQuantity}</td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex justify-center space-x-2">
                                            <button
                                                onClick={() => handleViewProduct(product.id)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleOpenModalForEdit(product)}
                                                className="text-green-600 hover:text-green-800"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                title={editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
            >
                <ProductForm 
                    initialProduct={editingProduct}
                    categories={categories}
                    onSubmit={handleFormSubmit}
                    onClose={handleCloseModal}
                />
            </Modal>
        </div>
    );
};

export default ProductManagementPage;