"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAllProducts } from "@/hooks/product/useAllProducts";
import { Product } from "@/types/product.type";
import ProductCardFeatured from "../product/ProductCardFeatured";
import { 
  Factory, 
  ChevronRight,
  ChevronLeft,
  Award,
  ArrowRight,
  Package,
  Shield,
  Globe,
  Menu,
  X
} from "lucide-react";
import Link from "next/link";

// Skeleton loading component tối ưu cho responsive
const ProductCardSkeleton = () => (
  <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
    <div className="animate-pulse">
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200" />
      <div className="p-2 md:p-3 space-y-1.5 md:space-y-2">
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        <div className="h-2.5 bg-gray-200 rounded w-1/2"></div>
        <div className="flex items-center justify-between pt-1 md:pt-2">
          <div className="h-4 bg-gray-200 rounded w-12 md:w-16"></div>
          <div className="h-5 md:h-6 bg-gray-200 rounded w-5 md:w-6"></div>
        </div>
      </div>
    </div>
  </div>
);

// Optimized Product card for slider với responsive
const ProductSlideCard = ({ 
  product, 
  index 
}: { 
  product: Product; 
  index: number;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), index * 15);
    return () => clearTimeout(timer);
  }, [index]);

  if (!isLoaded) {
    return <ProductCardSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <ProductCardFeatured product={product} index={index} />
    </motion.div>
  );
};

export default function IndustrialProductSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Gọi useAllProducts
  const { data: allProducts, isLoading } = useAllProducts();

  // RESPONSIVE: Số lượng sản phẩm mỗi slide thay đổi theo breakpoint
  const getItemsPerSlide = () => {
    if (typeof window === 'undefined') return 10;
    
    const width = window.innerWidth;
    if (width < 640) return 4; // Mobile: 4 sản phẩm
    if (width < 768) return 6; // Small tablet: 6 sản phẩm
    if (width < 1024) return 8; // Tablet: 8 sản phẩm
    return 10; // Desktop: 10 sản phẩm
  };

  const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide());

  // Update items per slide on resize
  useEffect(() => {
    const handleResize = () => {
      setItemsPerSlide(getItemsPerSlide());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Memoized filtered products
  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];
    return Array.isArray(allProducts) 
      ? allProducts.filter(p => p.isPublished)
      : [];
  }, [allProducts]);

  // Tính toán số slides dựa trên itemsPerSlide
  const totalSlides = Math.ceil(filteredProducts.length / itemsPerSlide);

  // Lấy sản phẩm cho slide hiện tại
  const currentProducts = useMemo(() => {
    const startIdx = currentSlide * itemsPerSlide;
    const endIdx = startIdx + itemsPerSlide;
    return filteredProducts.slice(startIdx, endIdx);
  }, [currentSlide, filteredProducts, itemsPerSlide]);

  // Grid columns responsive
  const getGridColumns = () => {
    if (typeof window === 'undefined') return "grid-cols-2";
    
    const width = window.innerWidth;
    if (width < 480) return "grid-cols-2"; // Very small mobile
    if (width < 640) return "grid-cols-2"; // Mobile
    if (width < 768) return "grid-cols-3"; // Small tablet
    if (width < 1024) return "grid-cols-4"; // Tablet
    return "grid-cols-5"; // Desktop
  };

  const [gridColumns, setGridColumns] = useState(getGridColumns());

  // Update grid columns on resize
  useEffect(() => {
    const handleResize = () => {
      setGridColumns(getGridColumns());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-slide
  useEffect(() => {
    if (!isPaused && totalSlides > 1) {
      timerRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % totalSlides);
      }, 5000);
      
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [isPaused, totalSlides]);

  // Navigation handlers
  const goToNextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goToPrevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Preload next slide images
  useEffect(() => {
    if (totalSlides > 1) {
      const nextSlide = (currentSlide + 1) % totalSlides;
      const startIdx = nextSlide * itemsPerSlide;
      const endIdx = Math.min(startIdx + itemsPerSlide, filteredProducts.length);
      
      for (let i = startIdx; i < endIdx; i++) {
        if (filteredProducts[i]?.thumb) {
          const img = new Image();
          img.src = filteredProducts[i].thumb!;
        }
      }
    }
  }, [currentSlide, totalSlides, filteredProducts, itemsPerSlide]);

  // Loading state
  if (isLoading) {
    return (
      <section className="py-6 md:py-10 bg-gradient-to-b from-white to-gray-50/10">
        <div className="max-w-[1400px] mx-auto px-3 md:px-4">
          <div className="flex flex-col items-center mb-6 md:mb-8 text-center">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-r from-emerald-100 to-teal-100 flex items-center justify-center mb-2 border border-emerald-200">
              <Factory className="text-emerald-600 w-5 h-5 md:w-6 md:h-6" />
            </div>
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-1">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                ĐANG TẢI SẢN PHẨM
              </span>
            </h2>
            <div className="w-8 md:w-10 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
          </div>

          {/* Hiển thị skeleton theo responsive */}
          <div className={`grid ${gridColumns} gap-2 md:gap-3`}>
            {[...Array(itemsPerSlide)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!filteredProducts || filteredProducts.length === 0) {
    return (
      <section className="py-6 md:py-10 bg-gradient-to-b from-white to-gray-50/10">
        <div className="max-w-[1400px] mx-auto px-3 md:px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 md:py-10"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-emerald-100 to-teal-100 flex items-center justify-center border border-emerald-200">
              <Package className="text-emerald-600 w-6 h-6 md:w-8 md:h-8" />
            </div>
            <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-2">
              Chưa có sản phẩm để hiển thị
            </h3>
            <p className="text-gray-500 max-w-md mx-auto text-sm mb-4 px-4">
              Hiện chưa có sản phẩm công nghiệp nào.
            </p>
            <Link href="/san-pham">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all"
              >
                XEM SẢN PHẨM KHÁC
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-white to-gray-50/10">
      <div className="max-w-[1400px] mx-auto px-3 md:px-4">
        {/* Mobile menu toggle */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200"
          >
            {showMobileMenu ? (
              <X className="w-4 h-4 text-emerald-600" />
            ) : (
              <Menu className="w-4 h-4 text-emerald-600" />
            )}
            <span className="text-xs font-semibold text-emerald-700">
              DANH MỤC
            </span>
          </button>
          
          <div className="text-xs text-gray-600">
            <span className="font-medium text-emerald-600">{filteredProducts.length}</span>
            <span className="ml-1">sản phẩm</span>
          </div>
        </div>

        {/* Header với thông tin pagination */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center mb-6 md:mb-8 text-center"
        >
          <div className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-full mb-3 border border-emerald-200">
            <Award size={14} className="text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-700">
              SẢN PHẨM CÔNG NGHIỆP 
            </span>
          </div>
          
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            <span className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent">
              SẢN PHẨM
            </span>
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent ml-1 md:ml-2">
              NỔI BẬT
            </span>
          </h1>
          
          <div className="flex items-center gap-1.5 mb-3 md:mb-4">
            <div className="h-1 w-4 md:w-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
            <div className="h-1 w-2 md:w-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
            <div className="h-1 w-1 md:w-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
          </div>
          
          {/* Mobile category menu */}
          <AnimatePresence>
            {showMobileMenu && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full md:hidden mb-4"
              >
                <div className="flex flex-wrap gap-2 justify-center">
                  <Link href="/san-pham?categoryId=1" onClick={() => setShowMobileMenu(false)}>
                    <button className="px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 text-xs font-medium rounded-lg border border-emerald-200 hover:border-emerald-300 transition-all w-full">
                      DÂY ĐAI
                    </button>
                  </Link>
                  <Link href="/san-pham?categoryId=2" onClick={() => setShowMobileMenu(false)}>
                    <button className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-200 hover:border-blue-300 transition-all w-full">
                      DÂY COTTON
                    </button>
                  </Link>
                  <Link href="/san-pham" onClick={() => setShowMobileMenu(false)}>
                    <button className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-medium rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center justify-center gap-1 w-full">
                      <span>XEM TẤT CẢ</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop navigation buttons */}
          <div className="hidden md:flex flex-wrap gap-2 justify-center mb-4 md:mb-6">
            <Link href="/san-pham?categoryId=1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 text-xs font-medium rounded-lg border border-emerald-200 hover:border-emerald-300 hover:shadow-sm transition-all"
              >
                DÂY ĐAI
              </motion.button>
            </Link>
            <Link href="/san-pham?categoryId=2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-200 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                DÂY COTTON
              </motion.button>
            </Link>
            <Link href="/san-pham">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-medium rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center gap-1"
              >
                <span>XEM TẤT CẢ</span>
                <ArrowRight className="w-3 h-3" />
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Slider container */}
        <div
          ref={containerRef}
          className="relative group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Slider content - GRID responsive */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className={`grid ${gridColumns} gap-2 md:gap-3`}
              >
                {currentProducts.map((product, index) => (
                  <ProductSlideCard 
                    key={`${product.id}-${currentSlide}-${index}`} 
                    product={product} 
                    index={index}
                  />
                ))}
                
                {/* Fill empty slots if last slide has less than itemsPerSlide */}
                {currentProducts.length < itemsPerSlide &&
                  Array.from({ length: itemsPerSlide - currentProducts.length }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="opacity-0" />
                  ))
                }
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation buttons - hiện khi có nhiều hơn 1 slide */}
          {totalSlides > 1 && (
            <>
              {/* Mobile navigation - always visible */}
              <button
                onClick={goToPrevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 md:-translate-x-4 bg-white/90 backdrop-blur-sm border border-gray-300 text-gray-600 rounded-full p-1.5 md:p-2 hover:bg-white hover:text-emerald-600 hover:border-emerald-300 transition-all duration-200 shadow-sm md:opacity-0 md:group-hover:opacity-100"
                aria-label="Slide trước"
              >
                <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" />
              </button>
              
              <button
                onClick={goToNextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 md:translate-x-4 bg-white/90 backdrop-blur-sm border border-gray-300 text-gray-600 rounded-full p-1.5 md:p-2 hover:bg-white hover:text-emerald-600 hover:border-emerald-300 transition-all duration-200 shadow-sm md:opacity-0 md:group-hover:opacity-100"
                aria-label="Slide sau"
              >
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
              </button>
            </>
          )}
        </div>

       {/* Pagination controls */}
        <div className="mt-4 md:mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Product counter */}
          <div className="text-xs md:text-sm text-gray-600">
            <span className="font-medium text-emerald-600">
              {Math.min((currentSlide + 1) * itemsPerSlide, filteredProducts.length)}
            </span>
            <span className="mx-1">/</span>
            <span className="font-medium text-gray-800">{filteredProducts.length}</span>
            <span className="ml-1 md:ml-2">sản phẩm</span>
          </div>
          
          {/* Mobile pagination - chỉ hiện số trang */}
          {totalSlides > 1 && (
            <div className="flex items-center gap-2 sm:hidden">
              <button
                onClick={goToPrevSlide}
                disabled={currentSlide === 0}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  currentSlide === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                ←
              </button>
              
              <span className="text-sm font-medium text-gray-700">
                {currentSlide + 1}/{totalSlides}
              </span>
              
              <button
                onClick={goToNextSlide}
                disabled={currentSlide === totalSlides - 1}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  currentSlide === totalSlides - 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                →
              </button>
            </div>
          )}
          
          {/* Desktop pagination - hiện đầy đủ dots */}
          {totalSlides > 1 && (
            <div className="hidden sm:flex items-center gap-1 md:gap-2">
              <button
                onClick={goToPrevSlide}
                disabled={currentSlide === 0}
                className={`px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm font-medium transition-all ${
                  currentSlide === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-emerald-600'
                }`}
              >
                ←
              </button>
              
              <div className="flex items-center gap-1 md:gap-1.5">
                {Array.from({ length: Math.min(totalSlides, 5) }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    className={`w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full transition-all ${
                      currentSlide === idx
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Trang ${idx + 1}`}
                  />
                ))}
                {totalSlides > 5 && (
                  <span className="text-xs text-gray-500 mx-0.5 md:mx-1">...</span>
                )}
              </div>
              
              <button
                onClick={goToNextSlide}
                disabled={currentSlide === totalSlides - 1}
                className={`px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm font-medium transition-all ${
                  currentSlide === totalSlides - 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-emerald-600'
                }`}
              >
                →
              </button>
            </div>
          )}
        </div>

        {/* Industry certification banner - responsive */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-6 md:mt-8 p-3 md:p-4 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 rounded-lg border border-blue-200"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                <Shield size={14} className="text-white" />
              </div>
              <div className="text-left">
                <h4 className="text-xs md:text-sm font-bold text-gray-900">SẢN PHẨM ĐẠT CHUẨN QUỐC TẾ</h4>
                <p className="text-xs text-gray-600 hidden sm:block">REACH • ROHS • ISO • Xuất khẩu Châu Âu</p>
                <p className="text-xs text-gray-600 sm:hidden">REACH • ROHS • ISO</p>
              </div>
            </div>
            
            <button
              onClick={() => window.location.href = 'tel:0903776456'}
              className="px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs md:text-sm font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all flex items-center gap-1 md:gap-2 whitespace-nowrap w-full md:w-auto justify-center mt-2 md:mt-0"
            >
              <Globe className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm">TƯ VẤN: 0903776456</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}