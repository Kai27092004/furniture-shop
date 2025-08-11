import React, { useState, useEffect } from 'react';
import { fetchProducts, deleteProduct, createProduct, updateProduct, fetchCategories } from '../../services/api';
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

    if (loading) return <p>Đang tải...</p>;

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Quản Lý Sản Phẩm</h1>
                <button onClick={handleOpenModalForCreate} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    + Thêm Sản Phẩm Mới
                </button>
            </div>
            
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full leading-normal">
                    {/* ... phần thead giữ nguyên ... */}
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                            <th className="py-3 px-5 text-left">ID</th>
                            <th className="py-3 px-5 text-left">Hình Ảnh</th>
                            <th className="py-3 px-5 text-left">Tên Sản Phẩm</th>
                            <th className="py-3 px-5 text-left">Giá</th>
                            <th className="py-3 px-5 text-left">Số Lượng</th>
                            <th className="py-3 px-5 text-center">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {products.map(product => (
                            <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-5">{product.id}</td>
                                <td className="py-3 px-5"><img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded"/></td>
                                <td className="py-3 px-5">{product.name}</td>
                                <td className="py-3 px-5">{new Intl.NumberFormat('vi-VN').format(product.price)} đ</td>
                                <td className="py-3 px-5">{product.stockQuantity}</td>
                                <td className="py-3 px-5 text-center">
                                    <button onClick={() => handleOpenModalForEdit(product)} className="text-yellow-500 hover:text-yellow-700 mr-4">Sửa</button>
                                    <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700">Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal để Thêm/Sửa sản phẩm */}
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