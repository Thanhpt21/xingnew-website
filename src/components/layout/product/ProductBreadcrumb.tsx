// components/layout/layout/ProductBreadcrumb.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Brand } from "@/types/brand.type";
import { useRouter } from "next/navigation";

interface ProductBreadcrumbProps {
  searchTerm?: string | null;
  selectedCategoryName?: string | null;
  selectedBrand?: Brand | null;
  showFeatured: boolean;
  showPromoted: boolean;
  currentPage: number;
  totalPages: number;
}

const ProductBreadcrumb: React.FC<ProductBreadcrumbProps> = ({
  searchTerm,
  selectedCategoryName,
  selectedBrand,
  showFeatured,
  showPromoted,
  currentPage,
  totalPages
}) => {
  const router = useRouter();

  const MobileBreadcrumb = () => (
    <div className="lg:hidden flex items-center justify-between bg-white px-3 py-2 border-b border-gray-200 mb-3">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-gray-700 hover:text-gray-900"
      >
        <span className="text-sm">← Quay lại</span>
      </button>
      <div className="text-xs text-gray-500">
        {currentPage > 1 && `Trang ${currentPage}`}
      </div>
    </div>
  );

  const DesktopBreadcrumb = () => (
    <div className="hidden lg:block bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Link
            href="/"
            className="text-gray-700 hover:text-gray-900"
          >
            Trang chủ
          </Link>
          
          <span className="mx-1">/</span>
          
          <Link
            href="/san-pham"
            className="text-gray-700 hover:text-gray-900"
          >
            Sản phẩm
          </Link>
          
          {selectedCategoryName && (
            <>
              <span className="mx-1">/</span>
              <span className="text-gray-700 truncate max-w-[150px]">
                {selectedCategoryName}
              </span>
            </>
          )}
          
          {selectedBrand && (
            <>
              <span className="mx-1">/</span>
              <span className="text-gray-700 truncate max-w-[120px]">
                {selectedBrand.name}
              </span>
            </>
          )}
          
          {searchTerm && (
            <>
              <span className="mx-1">/</span>
              <span className="text-gray-900 font-medium truncate max-w-[180px]">
                "{searchTerm}"
              </span>
            </>
          )}
          
          {showFeatured && (
            <>
              <span className="mx-1">/</span>
              <span className="text-gray-700 font-medium">Nổi bật</span>
            </>
          )}
          
          {showPromoted && (
            <>
              <span className="mx-1">/</span>
              <span className="text-gray-700 font-medium">Khuyến mãi</span>
            </>
          )}
          
          {currentPage > 1 && totalPages > 1 && (
            <>
              <span className="mx-1">/</span>
              <span className="text-gray-900 font-medium">
                Trang {currentPage}
              </span>
            </>
          )}
          
          {!searchTerm && !selectedCategoryName && !selectedBrand && !showFeatured && !showPromoted && currentPage === 1 && (
            <>
              <span className="mx-1">/</span>
              <span className="text-gray-900 font-medium">
                Tất cả sản phẩm
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <MobileBreadcrumb />
      <DesktopBreadcrumb />
    </>
  );
};

export default ProductBreadcrumb;