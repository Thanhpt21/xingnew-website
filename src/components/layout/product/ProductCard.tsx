"use client";

import { Card, Tooltip, Image } from "antd";
import Link from "next/link";
import { getImageUrl } from "@/utils/getImageUrl";
import { Product } from "@/types/product.type";
import { formatVND } from "@/utils/helpers";
import { useMemo, useState } from "react";
import { Star, Heart, Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product: p, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const thumbUrl = useMemo(() => getImageUrl(p.thumb ?? null), [p.thumb]);

  // Calculate discounted price if promotion exists
  const { finalPrice, discountPercentage, hasDiscount } = useMemo(() => {
    const promo = p.promotionProducts?.[0];
    const basePrice = p.basePrice || 0;
    let finalPrice = basePrice;
    let discountPercentage = 0;
    let hasDiscount = false;

    if (promo && basePrice > 0) {
      if (promo.discountType === "PERCENT") {
        finalPrice = basePrice * (1 - promo.discountValue / 100);
        discountPercentage = promo.discountValue;
        hasDiscount = true;
      } else if (promo.discountType === "FIXED") {
        finalPrice = Math.max(0, basePrice - promo.discountValue);
        discountPercentage = Math.round((promo.discountValue / basePrice) * 100);
        hasDiscount = true;
      }
    }

    return { finalPrice, discountPercentage, hasDiscount };
  }, [p.promotionProducts, p.basePrice]);

  // Rating calculation
  const ratingInfo = useMemo(() => {
    const avgRating = p.totalReviews > 0 ? p.totalRatings / p.totalReviews : 0;
    const formattedRating = avgRating > 0 ? Math.round(avgRating * 10) / 10 : 0;
    return {
      avgRating: formattedRating,
      totalReviews: p.totalReviews,
      hasRating: p.totalReviews > 0
    };
  }, [p.totalReviews, p.totalRatings]);

  return (
    <div 
      className="group relative h-full"
      style={{ 
        animation: `fadeInUp 0.5s ease-out ${index * 30}ms both`,
      }}
    >
      {/* Card chính - không có transform khi hover */}
      <div className="relative h-full bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-300 flex flex-col">
        
        {/* Image Container */}
        <Link href={`/san-pham/${p.slug}`} className="block relative">
          <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 aspect-square overflow-hidden">
            
            {/* Loading skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
            )}
            
            {/* Image - chỉ zoom nhẹ khi hover */}
            <Image
              src={thumbUrl || "/images/no-image.png"}
              alt={p.name}
              preview={false}
              loading="lazy"
              width={280}
              height={280}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              placeholder={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
                </div>
              }
            />

            {/* Overlay nhẹ khi hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />

            {/* Badges - top-left */}
            <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
              {hasDiscount && discountPercentage > 0 && (
                <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white text-xs font-bold px-2 py-1 rounded">
                  -{discountPercentage}%
                </div>
              )}
              {p.promotionProducts?.[0]?.giftProductId && 
               (p.promotionProducts[0].giftQuantity ?? 0) > 0 && (
                <div className="bg-gradient-to-r from-slate-600 to-slate-500 text-white text-xs font-bold px-2 py-1 rounded">
                  🎁 Quà tặng
                </div>
              )}
            </div>

            {/* Quick Actions - top-right */}
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsWishlisted(!isWishlisted);
                }}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isWishlisted 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Heart size={16} className={isWishlisted ? 'fill-current' : ''} />
              </button>
              <Link href={`/san-pham/${p.slug}`}>
                <button
                  className="p-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full hover:bg-gray-200 transition-all duration-300"
                  title="Xem chi tiết sản phẩm"
                >
                  <Eye size={16} />
                </button>
              </Link>
            </div>
          </div>
        </Link>

        {/* Product Info */}
        <div className="flex flex-col flex-grow p-3">
          {/* Product Name */}
          <Link href={`/san-pham/${p.slug}`}>
            <Tooltip title={p.name} placement="top">
              <h3 className="font-medium text-gray-800 text-sm leading-snug line-clamp-2 min-h-[2.5rem] hover:text-gray-600 transition-colors duration-200 mb-2">
                {p.name}
              </h3>
            </Tooltip>
          </Link>

          {/* Rating */}
          <div className="mb-2">
            {ratingInfo.hasRating ? (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={`${
                        i < Math.floor(ratingInfo.avgRating)
                          ? 'fill-gray-500 text-gray-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600">
                  {ratingInfo.avgRating.toFixed(1)}
                </span>
                <span className="text-xs text-gray-400">
                  ({ratingInfo.totalReviews})
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className="text-gray-300" />
                ))}
                <span className="text-xs text-gray-400 ml-1">(0)</span>
              </div>
            )}
          </div>

          {/* Price Section */}
          <div className="mt-auto pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="text-gray-800 font-bold text-lg">
                    {p.basePrice ? formatVND(finalPrice) : "Liên hệ"}
                  </span>
                </div>
                {hasDiscount && p.basePrice && (
                  <span className="text-gray-400 line-through text-xs">
                    {formatVND(p.basePrice)}
                  </span>
                )}
              </div>
              
              {p.totalReviews > 10 && (
                <span className="text-xs text-gray-500">
                  Đã bán {p.totalReviews * 3}
                </span>
              )}
            </div>
            
            {/* Stock Information */}
            <div className="text-xs text-gray-600">
              {p.stock && p.stock > 0 ? (
                <span>Hàng còn: {p.stock}</span>
              ) : (
                <span className="text-red-500">Hết hàng</span>
              )}
            </div>
          </div>
        </div>

        {/* Freeship badge */}
        {hasDiscount && (
          <div className="mt-2 bg-gradient-to-r from-gray-700 to-gray-600 text-white text-xs font-medium py-1.5 text-center">
            ⚡ Freeship đơn từ 0đ
          </div>
        )}
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}