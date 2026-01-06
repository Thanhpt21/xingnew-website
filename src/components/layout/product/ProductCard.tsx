"use client";

import { Card, Tooltip, Image } from "antd";
import Link from "next/link";
import { getImageUrl } from "@/utils/getImageUrl";
import { Product } from "@/types/product.type";
import { formatVND } from "@/utils/helpers";
import { useMemo, useState } from "react";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product: p, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

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

  return (
    <div 
      className="group relative"
      style={{ 
        animation: `fadeInUp 0.4s ease-out ${index * 30}ms both`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/san-pham/${p.slug}`} className="block h-full">
        <Card
          className="relative bg-white rounded-xl sm:rounded-2xl border border-gray-200 group-hover:border-blue-600 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full hover:-translate-y-0.5"
          bodyStyle={{ padding: "12px" }}
          hoverable={false}
        >
          {/* Image Container */}
          <div className="relative mb-3">
            {/* Discount badge (top-right corner) */}
            {hasDiscount && discountPercentage > 0 && (
              <div className="absolute top-0 right-0 z-10">
                <div className="flex items-center justify-center bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded min-w-[40px]">
                  -{discountPercentage}%
                </div>
              </div>
            )}

            {/* Image Container with fixed height and centered content */}
            <div className="relative h-[180px] flex items-center justify-center bg-gray-50 rounded-md">
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-md" />
              )}
              
              <Image
                src={thumbUrl || "/images/no-image.png"}
                alt={p.name}
                preview={false}
                loading="lazy"
                width={180}
                height={180}
                onLoad={() => setImageLoaded(true)}
                className={`
                  max-w-full
                  max-h-full
                  p-2
                  object-contain
                  transition-opacity duration-300
                  ${imageLoaded ? "opacity-100" : "opacity-0"}
                `}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-2">
            {/* Product Name */}
            <Tooltip title={p.name} placement="top">
              <h5 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 min-h-[3.5rem] transition-colors duration-300 group-hover:text-blue-700 cursor-pointer">
                {p.name}
              </h5>
            </Tooltip>

            {/* Price */}
            <div className="space-y-1">
              {p.basePrice ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base sm:text-lg whitespace-nowrap text-blue-700 group-hover:text-orange-600 transition-colors duration-300">
                      {formatVND(finalPrice)}
                    </span>
                                        
                    {hasDiscount && (
                      <span className="text-gray-400 line-through text-sm whitespace-nowrap">
                        {formatVND(p.basePrice)}
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
                </>
              ) : (
                <>
                  <p className="text-gray-500 font-medium text-sm">Liên hệ</p>
                  <div className="text-xs text-gray-600">
                    {p.stock && p.stock > 0 ? (
                      <span>Hàng còn: {p.stock}</span>
                    ) : (
                      <span className="text-red-500">Hết hàng</span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>
      </Link>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
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