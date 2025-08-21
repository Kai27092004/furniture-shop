import React, { useState, useEffect } from 'react';
import { ChevronDown, Grid3X3, List, Filter } from 'lucide-react';
import { fetchProducts, fetchCategories } from '../services/api'; // Thêm fetchCategories
import ProductCard from '../components/ProductCard';
import ProductCarousel from '../components/ProductCarousel'; // Import ProductCarousel

const ProductListPage = () => {
    // --- State gốc từ ProductListPage ---
    const [products, setProducts] = useState([]); // Giữ danh sách sản phẩm gốc từ API
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- State từ ProductPage để điều khiển UI và logic ---
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(16);
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('latest');
    const [filters, setFilters] = useState({
        category: '',
        priceRange: '',
    });
    const [showFilters, setShowFilters] = useState(false);
    
    // State mới để chứa danh sách categories từ API
    const [categories, setCategories] = useState([]);

    // --- Effect để fetch dữ liệu sản phẩm và danh mục từ API ---
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                // Gọi đồng thời cả hai API
                const [productsResponse, categoriesResponse] = await Promise.all([
                    fetchProducts(),
                    fetchCategories()
                ]);
                
                setProducts(productsResponse.data);
                setFilteredProducts(productsResponse.data); // Khởi tạo danh sách đã lọc
                setCategories(categoriesResponse.data);

            } catch (err) {
                console.error("Lỗi khi tải dữ liệu:", err);
                setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // --- Effect để lọc và sắp xếp sản phẩm ---
    useEffect(() => {
        let tempProducts = [...products];

        // Lọc theo danh mục
        if (filters.category) {
            tempProducts = tempProducts.filter(product =>
                product.Category?.name === filters.category
            );
        }

        // Lọc theo khoảng giá
        if (filters.priceRange) {
            const [min, max] = filters.priceRange.split('-').map(Number);
            tempProducts = tempProducts.filter(product =>
                product.price >= min && (max ? product.price <= max : true)
            );
        }

        // Sắp xếp
        switch (sortBy) {
            case 'price-low':
                tempProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                tempProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                tempProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default: // Mới nhất (latest)
                tempProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        setFilteredProducts(tempProducts);
        setCurrentPage(1); // Reset lại trang khi có thay đổi bộ lọc
    }, [filters, sortBy, products]);

    // --- Effect để xử lý phân trang và "Tải thêm" ---
    useEffect(() => {
        const startIndex = 0;
        const endIndex = currentPage * productsPerPage;
        setDisplayedProducts(filteredProducts.slice(startIndex, endIndex));
    }, [filteredProducts, currentPage, productsPerPage]);

    // --- Các hàm xử lý sự kiện ---
    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const loadMore = () => {
        setCurrentPage(prev => prev + 1);
    };
    
    const resetFilters = () => {
        setFilters({ category: '', priceRange: '' });
        setSortBy('latest');
    };
    
    const navigateTo = (page, id) => {
        // This is a placeholder function. In a real application, you would use
        // a routing library like react-router-dom to navigate to the correct page.
        console.log(`Navigating to ${page} with id ${id}`);
    };

    const hasMoreProducts = displayedProducts.length < filteredProducts.length;

    if (loading) {
        return <p className="text-center text-gray-500 mt-10">Đang tải sản phẩm...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500 mt-10">{error}</p>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb - Giả định bạn có hàm navigateTo từ App.jsx */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="text-sm">
                        <span className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer" onClick={() => navigateTo('home')}>
                            Trang chủ
                        </span>
                        <span className="mx-2 text-gray-400">/</span>
                        <span className="font-semibold text-gray-900">Sản phẩm</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Product Carousel */}
                <div className="mb-8">
                    <ProductCarousel products={products} navigateTo={navigateTo} />
                </div>
                {/* Thanh Filter và Sắp xếp */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                                Hiển thị {displayedProducts.length} / {filteredProducts.length} sản phẩm
                            </span>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                                >
                                    <Grid3X3 className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                                >
                                    <List className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="lg:hidden flex items-center px-3 py-2 text-sm border rounded-md hover:bg-gray-50"
                            >
                                <Filter className="h-4 w-4 mr-2" />
                                Bộ lọc
                            </button>

                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none bg-white border rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2"
                                >
                                    <option value="latest">Mới nhất</option>
                                    <option value="price-low">Giá thấp - cao</option>
                                    <option value="price-high">Giá cao - thấp</option>
                                    <option value="name">Tên A-Z</option>
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Bộ lọc cho Desktop */}
                            <div className="hidden lg:flex items-center space-x-4">
                                <div className="relative">
                                    <select
                                        value={filters.category}
                                        onChange={(e) => handleFilterChange('category', e.target.value)}
                                        className="appearance-none bg-white border rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 min-w-32"
                                    >
                                        <option value="">Tất cả danh mục</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.name}>{category.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>
                                <div className="relative">
                                    <select
                                        value={filters.priceRange}
                                        onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                                        className="appearance-none bg-white border rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 min-w-32"
                                    >
                                        <option value="">Tất cả giá</option>
                                        <option value="0-5000000">Dưới 5,000,000đ</option>
                                        <option value="5000000-10000000">5,000,000đ - 10,000,000đ</option>
                                        <option value="10000000-20000000">10,000,000đ - 20,000,000đ</option>
                                        <option value="20000000">Trên 20,000,000đ</option>
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bộ lọc cho Mobile */}
                    {showFilters && (
                        <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Danh mục</label>
                                <select
                                    value={filters.category}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    className="w-full border rounded-md px-3 py-2 text-sm"
                                >
                                    <option value="">Tất cả</option>
                                    {categories.map(category => (
                                      <option key={category.id} value={category.name}>{category.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Giá</label>
                                <select
                                     value={filters.priceRange}
                                     onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                                     className="w-full border rounded-md px-3 py-2 text-sm"
                                >
                                    <option value="">Tất cả</option>
                                    <option value="0-5000000">Dưới 5,000,000đ</option>
                                    <option value="5000000-10000000">5,000,000đ - 10,000,000đ</option>
                                    <option value="10000000-20000000">10,000,000đ - 20,000,000đ</option>
                                    <option value="20000000">Trên 20,000,000đ</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Lưới sản phẩm */}
                {displayedProducts.length > 0 ? (
                    <>
                        <div className={`grid gap-6 mb-8 ${
                            viewMode === 'grid'
                                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                                : 'grid-cols-1'
                        }`}>
                            {displayedProducts.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>

                        {hasMoreProducts && (
                            <div className="text-center">
                                <button
                                    onClick={loadMore}
                                    className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                                >
                                    Tải thêm sản phẩm
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg mb-4">Không tìm thấy sản phẩm nào phù hợp</p>
                        <button
                          onClick={resetFilters}
                          className="text-orange-500 hover:text-orange-600 font-medium"
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductListPage;