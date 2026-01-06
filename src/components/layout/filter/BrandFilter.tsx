"use client";

import React from "react";
import { Brand } from "@/types/brand.type";

interface BrandFilterProps {
  selectedBrandId: number | null;
  onBrandSelect: (brandId: number | null) => void;
  isLoading: boolean;
  loadingBrandId: number | null;
  brands: Brand[];
}

const BrandFilter: React.FC<BrandFilterProps> = ({
  selectedBrandId,
  onBrandSelect,
  isLoading,
  loadingBrandId,
  brands,
}) => {
  return (
    <div>
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {brands.map((brand) => (
            <div
              key={brand.id}
              onClick={() => onBrandSelect(brand.id)}
              className={`
                flex items-center justify-between
                px-3 py-2 cursor-pointer
                transition-colors rounded
                ${selectedBrandId === brand.id 
                  ? 'bg-gray-100 font-medium' 
                  : 'hover:bg-gray-50'
                }
                ${loadingBrandId === brand.id ? 'opacity-70' : ''}
              `}
            >
              <span className="text-sm text-gray-700 truncate">
                {brand.name}
              </span>
              {loadingBrandId === brand.id && (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandFilter;