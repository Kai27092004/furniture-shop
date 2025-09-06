import React, { useState, useEffect } from 'react';
import { fetchProducts, deleteProduct, createProduct, updateProduct, fetchCategories, BACKEND_URL } from '../../services/api';
import Modal from '../../components/common/Modal';
import ProductForm from '../../components/admin/ProductForm';
import { useToast } from '../../context/ToastContext';

const ProductManagementPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State cho tìm kiếm và lọc
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    
    // State cho Modal và Form
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null); // null: thêm mới, object: sửa
    
    // State cho Modal xác nhận xóa
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    
    // State cho Modal chi tiết sản phẩm
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    
    // Toast hook
    const { show } = useToast();

    useEffect(() => {
        loadInitialData();
    }, []);

    // Effect để lọc sản phẩm khi searchTerm hoặc selectedCategory thay đổi
    useEffect(() => {
        filterProducts();
    }, [products, searchTerm, selectedCategory]);

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

    // Hàm lọc sản phẩm theo tên và danh mục
    const filterProducts = () => {
        let filtered = [...products];

        // Lọc theo tên sản phẩm
        if (searchTerm.trim()) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Lọc theo danh mục
        if (selectedCategory) {
            filtered = filtered.filter(product =>
                product.categoryId === parseInt(selectedCategory)
            );
        }

        setFilteredProducts(filtered);
    };

    // Hàm xử lý thay đổi tìm kiếm
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Hàm xử lý thay đổi danh mục
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
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
    
    const openDeleteConfirm = (product) => {
        setProductToDelete(product);
        setConfirmDeleteOpen(true);
    };

    const closeDeleteConfirm = () => {
        setConfirmDeleteOpen(false);
        setProductToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!productToDelete) return;
        
        try {
            await deleteProduct(productToDelete.id);
            show('Xóa sản phẩm thành công!', { type: 'success' });
            loadInitialData();
            closeDeleteConfirm();
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
            show('Xóa sản phẩm thất bại.', { type: 'error' });
        }
    };
    
    const handleFormSubmit = async (formData) => {
        try {
            if (editingProduct) {
                // Chế độ sửa
                await updateProduct(editingProduct.id, formData);
                show('Cập nhật sản phẩm thành công!', { type: 'success' });
            } else {
                // Chế độ thêm mới
                await createProduct(formData);
                show('Thêm sản phẩm mới thành công!', { type: 'success' });
            }
            handleCloseModal();
            loadInitialData(); // Tải lại dữ liệu
        } catch (error) {
            console.error('Lỗi khi lưu sản phẩm:', error);
            show('Lưu sản phẩm thất bại.', { type: 'error' });
        }
    };

    const openProductDetail = (product) => {
        setSelectedProduct(product);
        setDetailModalOpen(true);
    };

    const closeProductDetail = () => {
        setDetailModalOpen(false);
        setSelectedProduct(null);
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
                            <span className="mr-2">Hiển thị:</span>
                            <span className="text-blue-600 font-medium">{filteredProducts.length}</span>
                            <span className="mx-1">/</span>
                            <span className="text-gray-500">{products.length}</span>
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
                            value={searchTerm}
                            onChange={handleSearchChange}
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
                    <select 
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    >
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
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map(product => (
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
                                                    onClick={() => openProductDetail(product)}
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
                                                    onClick={() => openDeleteConfirm(product)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-8 px-4 text-center text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <p className="text-lg font-medium mb-1">Không tìm thấy sản phẩm</p>
                                            <p className="text-sm">
                                                {searchTerm || selectedCategory 
                                                    ? "Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc danh mục" 
                                                    : "Chưa có sản phẩm nào trong hệ thống"
                                                }
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
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

            {/* Modal xác nhận xóa sản phẩm */}
            <Modal 
                isOpen={confirmDeleteOpen} 
                onClose={closeDeleteConfirm} 
                title="Xác nhận xóa sản phẩm"
                maxWidth="max-w-md"
            >
                <div className="space-y-4">
                    <p className="text-gray-900">
                        Bạn có chắc chắn muốn xóa sản phẩm <span className="font-semibold">"{productToDelete?.name}"</span>?
                    </p>
                    <p className="text-sm text-gray-600">Hành động này không thể hoàn tác.</p>
                    <div className="flex items-center justify-end gap-3">
                        <button 
                            onClick={closeDeleteConfirm} 
                            className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            HỦY
                        </button>
                        <button 
                            onClick={handleConfirmDelete} 
                            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
                        >
                            XÁC NHẬN
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal chi tiết sản phẩm */}
            <Modal 
                isOpen={detailModalOpen} 
                onClose={closeProductDetail} 
                title="Chi tiết sản phẩm"
                maxWidth="max-w-4xl"
            >
                {selectedProduct && (
                    <div className="flex gap-6">
                        {/* Phần bên trái - Hình ảnh sản phẩm */}
                        <div className="flex-1 bg-gray-100 rounded-lg p-4">
                            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                                <img 
                                    src={`${BACKEND_URL}${selectedProduct.imageUrl}`} 
                                    alt={selectedProduct.name}
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        </div>
                        
                        {/* Phần bên phải - Thông tin sản phẩm */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {selectedProduct.name}
                                </h2>
                                <p className="text-sm text-blue-600 font-medium">
                                    ID: {selectedProduct.id}
                                </p>
                            </div>
                            
                            <div className="space-y-3">
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Danh mục:</span>
                                    <p className="text-lg font-bold text-gray-900">
                                        {categories.find(cat => cat.id === selectedProduct.categoryId)?.name || 'Chưa phân loại'}
                                    </p>
                                </div>
                                
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Mô tả:</span>
                                    <p className="text-lg font-bold text-gray-900">
                                        {selectedProduct.description || 'Chưa có mô tả'}
                                    </p>
                                </div>
                                
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Giá bán:</span>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {new Intl.NumberFormat('vi-VN').format(selectedProduct.price)} đ
                                    </p>
                                </div>
                                
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Số lượng tồn kho:</span>
                                    <p className="text-lg font-bold text-gray-900">
                                        {selectedProduct.stockQuantity} sản phẩm
                                    </p>
                                </div>
                                
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Ngày tạo:</span>
                                    <p className="text-sm text-gray-600">
                                        {new Date(selectedProduct.createdAt).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                                
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Cập nhật lần cuối:</span>
                                    <p className="text-sm text-gray-600">
                                        {new Date(selectedProduct.updatedAt).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ProductManagementPage;