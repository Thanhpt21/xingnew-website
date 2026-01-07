// components/layout/layout/ProductBreadcrumb.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Brand } from "@/types/brand.type";
import { useRouter } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

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

  // Tạo breadcrumb items
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/", show: true },
    { label: "Sản phẩm", href: "/san-pham", show: true },
    { 
      label: selectedCategoryName, 
      href: null, 
      show: !!selectedCategoryName,
      maxWidth: "max-w-[120px]"
    },
    { 
      label: selectedBrand?.name, 
      href: null, 
      show: !!selectedBrand,
      maxWidth: "max-w-[100px]"
    },
    { 
      label: searchTerm ? `"${searchTerm}"` : null, 
      href: null, 
      show: !!searchTerm,
      maxWidth: "max-w-[140px]"
    },
    { 
      label: showFeatured ? "Nổi bật" : null, 
      href: null, 
      show: showFeatured 
    },
    { 
      label: showPromoted ? "Khuyến mãi" : null, 
      href: null, 
      show: showPromoted 
    },
    { 
      label: currentPage > 1 && totalPages > 1 ? `Trang ${currentPage}` : null, 
      href: null, 
      show: currentPage > 1 && totalPages > 1 
    },
    { 
      label: !searchTerm && !selectedCategoryName && !selectedBrand && !showFeatured && !showPromoted && currentPage === 1 ? "Tất cả sản phẩm" : null, 
      href: null, 
      show: !searchTerm && !selectedCategoryName && !selectedBrand && !showFeatured && !showPromoted && currentPage === 1
    },
  ].filter(item => item.show);

  const MobileBreadcrumb = () => (
    <div className="lg:hidden bg-white border-b border-gray-200">
      <div className="py-4">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
              )}
              {item.href ? (
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900 whitespace-nowrap ${
                    item.maxWidth || ""
                  } ${index === 0 ? '' : 'truncate'}`}
                >
                  {index === 0 && <Home className="w-3.5 h-3.5" />}
                  <span className={index === 0 ? 'hidden' : ''}>{item.label}</span>
                </Link>
              ) : (
                <span className={`text-sm text-gray-900 font-medium truncate ${item.maxWidth || ''} whitespace-nowrap`}>
                  {item.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Hiển thị trang hiện tại ở dưới (nếu có) */}
        {currentPage > 1 && (
          <div className="mt-1 text-xs text-gray-500 text-center">
            Trang {currentPage} / {totalPages}
          </div>
        )}
      </div>
    </div>
  );

  const DesktopBreadcrumb = () => (
    <div className="hidden lg:block bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-gray-700 hover:text-gray-900 hover:underline truncate max-w-[200px]"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium truncate max-w-[200px]">
                  {item.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <MobileBreadcrumb />
      <DesktopBreadcrumb />
      
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

export default ProductBreadcrumb;