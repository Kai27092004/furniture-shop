import React, { useState, useEffect } from 'react';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../../services/api';
import Modal from '../../components/common/Modal';

const CategoryManagementPage = () => {
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const response = await fetchCategories();
            setCategories(response.data);
        } catch (error) {
            console.error('Lỗi khi tải danh mục:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, formData);
            } else {
                await createCategory(formData);
            }
            loadCategories();
            handleCloseModal();
        } catch (error) {
            console.error('Lỗi khi lưu danh mục:', error);
            alert(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({ name: category.name, description: category.description });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
            try {
                await deleteCategory(id);
                loadCategories();
            } catch (error) {
                console.error('Lỗi khi xóa danh mục:', error);
                alert(error.response?.data?.message || 'Có lỗi xảy ra');
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        setFormData({ name: '', description: '' });
    };

    const filteredCategories = categories.filter(category => 
        category.name.toLowerCase().includes(search.toLowerCase()) ||
        category.description.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return <div className="text-center py-10">Đang tải...</div>;
    }

    return (
        <>
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6 bg-white shadow-sm border px-6 py-4 rounded-lg">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý Danh mục</h1>
                    <p className="text-gray-500 text-sm mt-1">Quản lý các danh mục sản phẩm template</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center">
                        <span className="text-gray-600">Tổng danh mục:</span>
                        <span className="ml-2 text-blue-600 font-semibold">{categories.length}</span>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Thêm mới
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Tìm kiếm danh mục theo tên hoặc slug..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map(category => (
                    <div key={category.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start mb-3">
                            <svg className="h-6 w-6 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg text-gray-800">{category.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-blue-600 font-medium">
                                Số sản phẩm: {category.productCount}
                            </span>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(category)}
                                    className="p-1 text-blue-600 hover:text-blue-800"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="p-1 text-red-600 hover:text-red-800"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên danh mục
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mô tả
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            rows="3"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            {editingCategory ? "Cập nhật" : "Thêm mới"}
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default CategoryManagementPage;