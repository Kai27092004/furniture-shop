import React, { useEffect, useMemo, useState } from 'react';
import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
    adminFetchAllOrders,
    adminFetchOrderDetails,
    adminUpdateOrderStatus,
    adminDeleteOrder
} from '../../services/api';
import Modal from '../../components/common/Modal';

const OrderManagementPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [updatingStatusId, setUpdatingStatusId] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(10);
    
    // Export loading
    const [exporting, setExporting] = useState(false);
    // Sort by date
    const [sortDate, setSortDate] = useState('desc');

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError('');
            const res = await adminFetchAllOrders();
            setOrders(res.data);
            setCurrentPage(1); // Reset về trang đầu khi load lại
        } catch (e) {
            setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại.');
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = useMemo(() => {
        const term = search.trim().toLowerCase();
        return orders.filter(o => {
            const matchTerm = term
                ? (
                    String(o.id).includes(term) ||
                    (o.user?.fullName || '').toLowerCase().includes(term) ||
                    (o.user?.email || '').toLowerCase().includes(term)
                  )
                : true;
            const matchStatus = statusFilter ? o.status === statusFilter : true;
            return matchTerm && matchStatus;
        });
    }, [orders, search, statusFilter]);

    const sortedOrders = useMemo(() => {
        const list = [...filteredOrders];
        list.sort((a, b) => {
            const da = new Date(a.createdAt).getTime();
            const db = new Date(b.createdAt).getTime();
            return sortDate === 'desc' ? db - da : da - db;
        });
        return list;
    }, [filteredOrders, sortDate]);

    // Pagination logic
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);

    const openDetails = async (orderId) => {
        try {
            setSelectedOrderId(orderId);
            setDetailsOpen(true);
            const res = await adminFetchOrderDetails(orderId);
            setSelectedOrder(res.data);
        } catch (e) {
            console.error(e);
            setSelectedOrder(null);
            alert('Không thể tải chi tiết đơn hàng.');
        }
    };

    const closeDetails = () => {
        setDetailsOpen(false);
        setSelectedOrder(null);
        setSelectedOrderId(null);
    };

    const openDeleteConfirm = (order) => {
        setOrderToDelete(order);
        setConfirmOpen(true);
    };

    const closeDeleteConfirm = () => {
        setConfirmOpen(false);
        setOrderToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!orderToDelete) return;
        try {
            await adminDeleteOrder(orderToDelete.id);
            await loadOrders();
            closeDeleteConfirm();
        } catch (e) {
            console.error(e);
            closeDeleteConfirm();
        }
    };

    const handleChangeStatus = async (orderId, newStatus, oldStatus) => {
        if (newStatus === oldStatus) return;
        
        if (!window.confirm(`Bạn có chắc chắn muốn thay đổi trạng thái đơn hàng #${orderId} từ "${getStatusLabel(oldStatus)}" thành "${getStatusLabel(newStatus)}"?`)) {
            return;
        }

        try {
            setUpdatingStatusId(orderId);
            await adminUpdateOrderStatus(orderId, newStatus);
            
            // Refresh data
            await loadOrders();
            
            // Update selected order if it's open
            if (selectedOrderId === orderId) {
                const detail = await adminFetchOrderDetails(orderId);
                setSelectedOrder(detail.data);
            }
            
            // Show success message
            alert(`Cập nhật trạng thái đơn hàng #${orderId} thành công!`);
        } catch (e) {
            console.error(e);
            alert('Cập nhật trạng thái thất bại. Vui lòng thử lại.');
        } finally {
            setUpdatingStatusId(null);
        }
    };

    const getStatusLabel = (status) => {
        const statusMap = {
            'pending': 'Chờ thanh toán',
            'processing': 'Đang xử lý',
            'shipped': 'Đã gửi',
            'delivered': 'Đã thanh toán',
            'cancelled': 'Đã hủy'
        };
        return statusMap[status] || status;
    };

    const getStatusBadgeClass = (status) => {
        const badgeClasses = {
            'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'processing': 'bg-blue-100 text-blue-800 border-blue-200',
            'shipped': 'bg-purple-100 text-purple-800 border-purple-200',
            'delivered': 'bg-green-100 text-green-800 border-green-200',
            'cancelled': 'bg-red-100 text-red-800 border-red-200'
        };
        return badgeClasses[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const exportOrders = async () => {
        try {
            setExporting(true);
            
            // Create CSV content
            const headers = ['ID', 'Khách hàng', 'Email', 'Tổng tiền', 'Trạng thái', 'Ngày tạo', 'Địa chỉ giao hàng'];
            const csvContent = [
                headers.join(','),
                ...filteredOrders.map(order => [
                    order.id,
                    `"${order.user?.fullName || ''}"`,
                    `"${order.user?.email || ''}"`,
                    order.totalAmount,
                    getStatusLabel(order.status),
                    new Date(order.createdAt).toLocaleDateString('vi-VN'),
                    `"${order.shippingAddress || ''}"`
                ].join(','))
            ].join('\n');

            // Download CSV file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `don-hang-${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            alert('Xuất dữ liệu thành công!');
        } catch (error) {
            console.error('Lỗi khi xuất dữ liệu:', error);
            alert('Xuất dữ liệu thất bại. Vui lòng thử lại.');
        } finally {
            setExporting(false);
        }
    };

    const statusOptions = [
        { value: '', label: 'Tất cả trạng thái' },
        { value: 'pending', label: 'Chờ xử lý' },
        { value: 'processing', label: 'Đang xử lý' },
        { value: 'shipped', label: 'Đã gửi' },
        { value: 'delivered', label: 'Đã giao' },
        { value: 'cancelled', label: 'Đã hủy' },
    ];

    // Statistics
    const stats = useMemo(() => {
        const total = filteredOrders.length;
        const totalAmount = filteredOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
        const statusCounts = filteredOrders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {});

        return {
            total,
            totalAmount,
            statusCounts
        };
    }, [filteredOrders]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <div className="text-red-600 text-lg mb-4">{error}</div>
                <button 
                    onClick={loadOrders}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            {/* Header */}
            <div className="bg-white p-4 rounded-lg shadow border mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Quản Lý Đơn hàng</h1>
                <p className="text-sm text-gray-500">Quản lý tất cả đơn hàng của khách hàng</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow border">
                    <div className="text-sm text-gray-600">Tổng đơn hàng</div>
                    <div className="text-2xl font-bold text-indigo-600">{stats.total}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border">
                    <div className="text-sm text-gray-600">Tổng giá trị</div>
                    <div className="text-2xl font-bold text-green-600">
                        {new Intl.NumberFormat('vi-VN').format(stats.totalAmount)} đ
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border">
                    <div className="text-sm text-gray-600">Chờ xử lý</div>
                    <div className="text-2xl font-bold text-yellow-600">
                        {stats.statusCounts.pending || 0}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border">
                    <div className="text-sm text-gray-600">Đã giao</div>
                    <div className="text-2xl font-bold text-green-600">
                        {stats.statusCounts.delivered || 0}
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-lg shadow border mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tìm kiếm
                        </label>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tìm theo ID, tên hoặc email khách hàng..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="lg:w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Trạng thái
                        </label>
                        <select
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            {statusOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Khách hàng
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tổng tiền
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ngày tạo
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        {filteredOrders.length === 0 ? 'Không có đơn hàng nào' : 'Không tìm thấy đơn hàng phù hợp'}
                                    </td>
                                </tr>
                            ) : (
                                currentOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{order.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {order.user?.fullName || 'Không xác định'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {order.user?.email || 'Không có email'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className="font-semibold">
                                                {new Intl.NumberFormat('vi-VN').format(order.totalAmount)} đ
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(order.status)}`}>
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                            <br />
                                            <span className="text-xs">
                                                {new Date(order.createdAt).toLocaleTimeString('vi-VN')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                            <div className="flex items-center gap-3 justify-center">
                                                <button
                                                    onClick={() => openDetails(order.id)}
                                                    title="Xem chi tiết"
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    <EyeIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => openDetails(order.id)}
                                                    title="Chỉnh sửa"
                                                    className="text-green-600 hover:text-green-800"
                                                >
                                                    <PencilSquareIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteConfirm(order)} 
                                                    title="Xóa"
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-center border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-center sm:hidden">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Trước
                            </button>
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Sau
                            </button>
                        </div>
                        <div className="hidden sm:flex w-full sm:items-center sm:justify-center">
                            <div>
                                <nav className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="w-8 h-8 rounded-full border flex items-center justify-center text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        ‹
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-8 h-8 rounded-full border text-sm ${page === currentPage ? 'bg-indigo-600 border-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="w-8 h-8 rounded-full border flex items-center justify-center text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        ›
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Order Details Modal (compact) */}
            <Modal isOpen={detailsOpen} onClose={closeDetails} title={`Chi tiết đơn hàng #${selectedOrderId || ''}`} maxWidth="max-w-xl">
                {!selectedOrder ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        <span className="ml-3 text-gray-600">Đang tải chi tiết...</span>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Header summary */}
                        <div className="flex items-start justify-between">
                            <div className="space-y-1 text-sm">
                                <div className="text-gray-900 font-medium">{selectedOrder.user?.fullName || 'Không xác định'}</div>
                                <div className="text-gray-500">{selectedOrder.user?.email}</div>
                                <div className="text-gray-500">{selectedOrder.user?.phone}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-gray-500">Tổng tiền</div>
                                <div className="text-2xl font-bold text-indigo-600">{new Intl.NumberFormat('vi-VN').format(selectedOrder.totalAmount)} đ</div>
                                <div className="mt-2">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(selectedOrder.status)}`}>
                                        {getStatusLabel(selectedOrder.status)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="text-sm text-gray-700">
                            <div className="text-gray-500 mb-1">Địa chỉ giao hàng</div>
                            <p className="whitespace-pre-line">{selectedOrder.shippingAddress || 'Không có địa chỉ'}</p>
                        </div>

                        {/* Items */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="text-xs text-gray-500 uppercase">
                                        <th className="px-2 py-2 text-left">Sản phẩm</th>
                                        <th className="px-2 py-2 text-center">SL</th>
                                        <th className="px-2 py-2 text-right">Giá</th>
                                        <th className="px-2 py-2 text-right">Tạm tính</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.items?.map(item => (
                                        <tr key={item.id} className="text-sm border-t">
                                            <td className="px-2 py-2">
                                                <div className="flex items-center gap-2">
                                                    {item.product?.imageUrl && (
                                                        <img src={item.product.imageUrl} alt={item.product?.name} className="w-10 h-10 rounded object-cover" />
                                                    )}
                                                    <div>
                                                        <div className="font-medium">{item.product?.name || `Sản phẩm #${item.productId}`}</div>
                                                        <div className="text-xs text-gray-500">Mã: {item.productId}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-2 py-2 text-center">{item.quantity}</td>
                                            <td className="px-2 py-2 text-right">{new Intl.NumberFormat('vi-VN').format(item.price)} đ</td>
                                            <td className="px-2 py-2 text-right font-medium">{new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)} đ</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-600">Cập nhật trạng thái:</span>
                                <select
                                    className="border border-gray-300 rounded px-2 py-1"
                                    value={selectedOrder.status}
                                    onChange={(e) => handleChangeStatus(selectedOrder.id, e.target.value, selectedOrder.status)}
                                    disabled={updatingStatusId === selectedOrder.id}
                                >
                                    {statusOptions.filter(s => s.value !== '').map(s => (
                                        <option key={s.value} value={s.value}>{s.label}</option>
                                    ))}
                                </select>
                                {updatingStatusId === selectedOrder.id && (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Confirm Delete Modal (compact, centered) */}
            <Modal isOpen={confirmOpen} onClose={closeDeleteConfirm} title={`Xác nhận xóa đơn hàng`} maxWidth="max-w-md">
                <div className="space-y-4">
                    <p className="text-gray-900">Bạn có chắc chắn muốn xóa đơn hàng <span className="font-semibold">#{orderToDelete?.id}</span>?</p>
                    <p className="text-sm text-gray-600">Hành động này không thể hoàn tác.</p>
                    <div className="flex items-center justify-end gap-3">
                        <button onClick={closeDeleteConfirm} className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50">HỦY</button>
                        <button onClick={handleConfirmDelete} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">XÁC NHẬN</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default OrderManagementPage;