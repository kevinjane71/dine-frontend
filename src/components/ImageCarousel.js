'use client';

import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes, FaImage } from 'react-icons/fa';

const ImageCarousel = ({ 
  images = [], 
  itemName = '', 
  showControls = true, 
  showDots = true,
  autoPlay = false,
  autoPlayInterval = 3000,
  className = '',
  onImageClick = null,
  showFullscreen = true,
  maxHeight = '200px'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, images.length]);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  const handleImageClick = () => {
    if (onImageClick) {
      onImageClick(currentIndex);
    } else if (showFullscreen) {
      setIsFullscreen(true);
    }
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  if (!images || images.length === 0) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
        style={{ height: maxHeight }}
      >
        <div className="text-center text-gray-400">
          <FaImage size={32} className="mx-auto mb-2" />
          <p className="text-sm">No images</p>
        </div>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <>
      <div className={`relative overflow-hidden rounded-lg ${className}`} style={{ height: maxHeight }}>
        {/* Main Image */}
        <div 
          className="w-full h-full cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={handleImageClick}
        >
          <img
            src={currentImage.url}
            alt={`${itemName} - Image ${currentIndex + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Navigation Controls */}
        {showControls && images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200"
              aria-label="Previous image"
            >
              <FaChevronLeft size={16} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200"
              aria-label="Next image"
            >
              <FaChevronRight size={16} />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Dots Indicator */}
        {showDots && images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-white' 
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeFullscreen}
        >
          <div className="relative max-w-4xl max-h-full">
            {/* Close Button */}
            <button
              onClick={closeFullscreen}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200"
              aria-label="Close fullscreen"
            >
              <FaTimes size={20} />
            </button>

            {/* Fullscreen Image */}
            <img
              src={currentImage.url}
              alt={`${itemName} - Image ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Fullscreen Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200"
                  aria-label="Previous image"
                >
                  <FaChevronLeft size={20} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200"
                  aria-label="Next image"
                >
                  <FaChevronRight size={20} />
                </button>

                {/* Fullscreen Dots */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        goToImage(index);
                      }}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === currentIndex 
                          ? 'bg-white' 
                          : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageCarousel;
