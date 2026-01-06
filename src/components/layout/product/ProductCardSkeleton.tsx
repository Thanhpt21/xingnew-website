// components/layout/product/ProductCardSkeleton.tsx
import React from "react";

const ProductCardSkeleton = () => (
  <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-100 shadow-sm">
    <div className="p-4">
      <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl mb-4 animate-pulse"></div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 animate-pulse"></div>
          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></div>
        </div>
        <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2 animate-pulse"></div>
        <div className="flex items-center justify-between pt-2">
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16 animate-pulse"></div>
          <div className="h-9 w-9 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
);

export default ProductCardSkeleton;