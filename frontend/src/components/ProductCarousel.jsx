import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BACKEND_URL } from '../services/api'; // Giữ lại import cho URL backend

const ProductCarousel = ({ products, navigateTo }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  // Chỉ lấy 5 sản phẩm đầu tiên để hiển thị như logic cũ
  const featuredProducts = products.slice(0, 5);

  // Xử lý responsive để thay đổi số lượng item trên mỗi view
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setItemsPerView(1); // Mobile
      } else if (width < 1024) {
        setItemsPerView(2); // Tablet
      } else {
        setItemsPerView(3); // Desktop
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Logic tự động trượt slide
  useEffect(() => {
    if (featuredProducts.length > itemsPerView) {
      const timer = setInterval(() => {
        nextSlide();
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [currentIndex, itemsPerView, featuredProducts.length]);

  const nextSlide = () => {
    const maxIndex = featuredProducts.length - itemsPerView;
    setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1);
  };

  const prevSlide = () => {
    const maxIndex = featuredProducts.length - itemsPerView;
    setCurrentIndex(prev => prev <= 0 ? maxIndex : prev - 1);
  };

  // Kiểm tra xem có thể trượt tới hoặc lùi không
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < featuredProducts.length - itemsPerView;
    
  // Trả về null nếu không có sản phẩm
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full overflow-hidden">
      {/* Container chính của Carousel */}
      <div className="relative">
        {/* Track chứa các slide */}
        <div 
          className="flex transition-transform duration-500 ease-in-out gap-4 md:gap-6"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
          }}
        >
          {featuredProducts.map((product) => (
            <div 
              key={product.id}
              className="flex-shrink-0 relative group cursor-pointer"
              style={{ width: `${100 / itemsPerView}%` }}
              // Thay đổi navigateTo để điều hướng đến trang chi tiết sản phẩm
              onClick={() => navigateTo && navigateTo('product-detail', product.id)}
            >
              {/* Container hình ảnh */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-lg bg-gray-100">
                <img
                  src={`${BACKEND_URL}${product.imageUrl || '/img/placeholder.jpg'}`}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback sang ảnh placeholder nếu ảnh gốc bị lỗi
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjEzNSIgcj0iMTUiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTE3MCAyMDBMMTQwIDE3MEgxNjBMMTcwIDIwMFpNMjMwIDIwMEwyMDAgMTcwSDI2MEwyMzAgMjAwWiIgZmlsbD0iI0QxRDVEQiIvPgo8L3N2Zz4=';
                  }}
                />
                
                {/* Lớp phủ gradient khi hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Lớp phủ văn bản khi hover */}
                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <h3 className="font-bold text-sm md:text-base lg:text-lg mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-200 line-clamp-1">
                    Xem chi tiết
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Nút điều hướng */}
        {canGoPrev && (
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-2 md:p-3 shadow-lg transition-all duration-200 hover:scale-110 z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-gray-800" />
          </button>
        )}

        {canGoNext && (
          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-2 md:p-3 shadow-lg transition-all duration-200 hover:scale-110 z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-gray-800" />
          </button>
        )}
      </div>

      {/* Chỉ báo bằng dấu chấm */}
      <div className="flex justify-center mt-4 md:mt-6 space-x-2">
        {/* Điều chỉnh length của mảng để khớp với số lượng slide thực tế */}
        {Array.from({ length: featuredProducts.length - itemsPerView + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-200 ${
              index === currentIndex 
                ? 'bg-orange-500 scale-125' // Có thể đổi màu cho phù hợp
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;