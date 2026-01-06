// components/layout/layout/ProductFiltersBar.tsx
"use client";

import React from "react";
import { Brand } from "@/types/brand.type";

interface ActiveFilter {
  type: string;
  attributeId?: number;
  attributeName?: string;
  valueId?: number;
  valueName?: string;
  displayText: string;
  removeKey: string;
  [key: string]: any;
}

interface ProductFiltersBarProps {
  searchTerm?: string;
  selectedCategoryId: number | null;
  selectedBrandId: number | null;
  showFeatured: boolean;
  showPromoted: boolean;
  currentPage: number;
  selectedCategoryName?: string | null;
  selectedBrand?: Brand | null;
  activeFilterCount?: number; // THÊM: số lượng filters
  activeFilters?: ActiveFilter[]; // THÊM: danh sách active filters từ API
  onClearSearch: () => void;
  onClearCategory: () => void;
  onClearBrand: () => void;
  onClearFeatured: () => void;
  onClearPromoted: () => void;
  onClearPage: () => void;
  onRemoveAttributeFilter?: (filter: ActiveFilter) => void; // THÊM: xóa attribute filter
  onResetFilters: () => void;
  router: any;
}

const ProductFiltersBar: React.FC<ProductFiltersBarProps> = ({
  searchTerm,
  selectedCategoryId,
  selectedBrandId,
  showFeatured,
  showPromoted,
  currentPage,
  selectedCategoryName,
  selectedBrand,
  activeFilterCount = 0, // Giá trị mặc định
  activeFilters = [], // Giá trị mặc định
  onClearSearch,
  onClearCategory,
  onClearBrand,
  onClearFeatured,
  onClearPromoted,
  onClearPage,
  onRemoveAttributeFilter,
  onResetFilters,
  router
}) => {
  // Tính toán tổng số filters đang active
  const hasBasicFilters = !!searchTerm || !!selectedCategoryId || !!selectedBrandId || showFeatured || showPromoted || currentPage > 1;
  const hasActiveFilters = hasBasicFilters || activeFilters.length > 0;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="mb-6 border border-gray-200 p-3 bg-gray-50">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 font-medium text-gray-700">
          <span>Bộ lọc đang áp dụng:</span>
          {activeFilterCount > 0 && (
            <span className="bg-gray-800 text-white text-xs px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>

        {/* Basic filters */}
        {searchTerm && (
          <div className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded text-sm">
            <span className="text-gray-700">"{searchTerm}"</span>
            <button
              onClick={onClearSearch}
              className="text-gray-500 hover:text-gray-700 ml-1"
              aria-label="Xóa tìm kiếm"
            >
              ×
            </button>
          </div>
        )}
        
        {selectedCategoryName && (
          <div className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded text-sm">
            <span className="text-gray-700">{selectedCategoryName}</span>
            <button
              onClick={onClearCategory}
              className="text-gray-500 hover:text-gray-700 ml-1"
              aria-label="Xóa danh mục"
            >
              ×
            </button>
          </div>
        )}
        
        {selectedBrand && (
          <div className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded text-sm">
            <span className="text-gray-700">{selectedBrand.name}</span>
            <button
              onClick={onClearBrand}
              className="text-gray-500 hover:text-gray-700 ml-1"
              aria-label="Xóa thương hiệu"
            >
              ×
            </button>
          </div>
        )}
        
        {showFeatured && (
          <div className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded text-sm">
            <span className="text-gray-700">Nổi bật</span>
            <button
              onClick={onClearFeatured}
              className="text-gray-500 hover:text-gray-700 ml-1"
              aria-label="Xóa nổi bật"
            >
              ×
            </button>
          </div>
        )}
        
        {showPromoted && (
          <div className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded text-sm">
            <span className="text-gray-700">Khuyến mãi</span>
            <button
              onClick={onClearPromoted}
              className="text-gray-500 hover:text-gray-700 ml-1"
              aria-label="Xóa khuyến mãi"
            >
              ×
            </button>
          </div>
        )}

        {currentPage > 1 && (
          <div className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded text-sm">
            <span className="text-gray-700">Trang {currentPage}</span>
            <button
              onClick={onClearPage}
              className="text-gray-500 hover:text-gray-700 ml-1"
              aria-label="Về trang đầu"
            >
              ×
            </button>
          </div>
        )}

        {/* Attribute filters từ API */}
        {activeFilters.map((filter, index) => (
          <div 
            key={`${filter.type}-${filter.attributeId || ''}-${filter.valueId || ''}-${index}`}
            className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded text-sm"
          >
            <span className="text-blue-700">{filter.displayText}</span>
            {onRemoveAttributeFilter && (
              <button
                onClick={() => onRemoveAttributeFilter(filter)}
                className="text-blue-500 hover:text-blue-700 ml-1"
                aria-label={`Xóa ${filter.displayText}`}
              >
                ×
              </button>
            )}
          </div>
        ))}

        {/* Button xóa tất cả */}
        <button
          onClick={onResetFilters}
          className="text-sm text-gray-600 hover:text-gray-900 ml-auto px-2 py-1 hover:bg-gray-200 rounded"
        >
          Xóa tất cả
        </button>
      </div>

      {/* Hiển thị tóm tắt filters (optional) */}
      {(searchTerm || selectedCategoryName || selectedBrand || activeFilters.length > 0) && (
        <div className="mt-2 text-xs text-gray-500">
          {searchTerm && <span>Tìm kiếm: "{searchTerm}" • </span>}
          {selectedCategoryName && <span>Danh mục: {selectedCategoryName} • </span>}
          {selectedBrand && <span>Thương hiệu: {selectedBrand.name} • </span>}
          {activeFilters.length > 0 && (
            <span>
              Thuộc tính: {activeFilters.map(f => f.displayText).join(', ')}
              {searchTerm || selectedCategoryName || selectedBrand ? ' • ' : ''}
            </span>
          )}
          {showFeatured && <span>Nổi bật • </span>}
          {showPromoted && <span>Khuyến mãi • </span>}
          {currentPage > 1 && <span>Trang {currentPage}</span>}
        </div>
      )}
    </div>
  );
};

export default ProductFiltersBar;