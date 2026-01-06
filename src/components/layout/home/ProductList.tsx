"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAllProducts } from "@/hooks/product/useAllProducts";
import { Product } from "@/types/product.type";
import ProductCardFeatured from "../product/ProductCardFeatured";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";

// Skeleton card
const ProductSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100">
    <div className="animate-pulse">
      <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-6 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  </div>
);

export default function FeaturedProductsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { data: allProducts, isLoading } = useAllProducts();

  // Responsive items per slide
  const getItemsPerSlide = () => {
    if (typeof window === "undefined") return 5;
    const width = window.innerWidth;
    if (width < 640) return 2;
    if (width < 1024) return 3;
    if (width < 1280) return 4;
    return 5;
  };

  const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide());

  useEffect(() => {
    const handleResize = () => setItemsPerSlide(getItemsPerSlide());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];
    return Array.isArray(allProducts) ? allProducts.filter(p => p.isPublished) : [];
  }, [allProducts]);

  const totalSlides = Math.ceil(filteredProducts.length / itemsPerSlide);

  const currentProducts = useMemo(() => {
    const start = currentSlide * itemsPerSlide;
    return filteredProducts.slice(start, start + itemsPerSlide);
  }, [currentSlide, filteredProducts, itemsPerSlide]);

  // Auto slide
  useEffect(() => {
    if (!isPaused && totalSlides > 1 && filteredProducts.length > itemsPerSlide) {
      timerRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % totalSlides);
      }, 6000);
      return () => clearInterval(timerRef.current!);
    }
  }, [isPaused, totalSlides, filteredProducts.length, itemsPerSlide]);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);

  // Loading state
  if (isLoading) {
    return (
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Sản phẩm
            </h2>
            <div className="mt-4 w-24 h-1 bg-gray-300 rounded-full mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: itemsPerSlide }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (filteredProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề hiện đại, tối giản */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Sản phẩm
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá bộ sưu tập giấy in nhiệt, băng keo và vật tư in ấn chất lượng cao
          </p>
          
          {/* Nút "Xem tất cả sản phẩm" nhỏ và nằm dưới dòng mô tả */}
          <div className="mt-4">
            <Link href="/san-pham">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 hover:text-gray-900 transition-all"
              >
                Xem tất cả sản phẩm
                <ArrowRight className="w-3 h-3" />
              </motion.button>
            </Link>
          </div>
          
          <div className="mt-6 w-32 h-1 bg-gray-300 rounded-full mx-auto" />
        </motion.div>

        {/* Slider */}
        <div
          className="relative group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-hidden rounded-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6`}
              >
                {currentProducts.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.6 }}
                    // LOẠI BỎ whileHover ở đây
                  >
                    <ProductCardFeatured product={product} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation arrows - chỉ hiện khi cần */}
          {totalSlides > 1 && filteredProducts.length > itemsPerSlide && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md border border-gray-200 rounded-full p-3 shadow-lg hover:shadow-xl hover:bg-white transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md border border-gray-200 rounded-full p-3 shadow-lg hover:shadow-xl hover:bg-white transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </>
          )}

          {/* Dots pagination */}
          {totalSlides > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentSlide ? "w-8 bg-gray-700" : "bg-gray-300 hover:bg-gray-500"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}