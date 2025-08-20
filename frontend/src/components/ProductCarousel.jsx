import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductCarousel = ({ products, navigateTo }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const featuredProducts = products.filter(product => product.hot).slice(0, 5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [featuredProducts.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-80 md:h-96 bg-gray-100 overflow-hidden rounded-lg">
      {/* Slides */}
      <div className="relative w-full h-full">
        {featuredProducts.map((product, index) => (
          <div
            key={product.id}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentSlide ? 'translate-x-0' : 
              index < currentSlide ? '-translate-x-full' : 'translate-x-full'
            }`}
          >
            <div className="relative w-full h-full">
              <img
                src={product.images[0] || '/img/placeholder.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>
              
              {/* Content Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <span className="inline-block bg-hot-orange text-white text-xs font-bold px-2 py-1 rounded mb-2">
                    HOT
                  </span>
                  <h2 className="text-2xl md:text-4xl font-bold mb-2">{product.name}</h2>
                  <p className="text-lg md:text-xl mb-4">${product.price.toFixed(2)}</p>
                  <button
                    onClick={() => navigateTo('product-detail', product.id)}
                    className="bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200 shadow-md"
      >
        <ChevronLeft className="h-6 w-6 text-gray-800" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200 shadow-md"
      >
        <ChevronRight className="h-6 w-6 text-gray-800" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {featuredProducts.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide 
                ? 'bg-white' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;