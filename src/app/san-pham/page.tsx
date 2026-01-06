"use client";

import { Product } from "@/types/product.type";
import { useProducts } from "@/hooks/product/useProducts";
import { useCategoryTree } from "@/hooks/category/useCategoryTree";
import { useBrands } from "@/hooks/brand/useBrands";
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Brand } from "@/types/brand.type";
import { useSearchParams, useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import {
  FilterOutlined,
  CloseOutlined,
  DownOutlined,
  UpOutlined,
  SearchOutlined,
} from "@ant-design/icons";

// Import components
import ProductCard from "@/components/layout/product/ProductCard";
import ProductCardFeatured from "@/components/layout/product/ProductCardFeatured";
import ProductCardPromoted from "@/components/layout/product/ProductCardPromoted";
import ProductCardSkeleton from "@/components/layout/product/ProductCardSkeleton";
import CategoryTreeFilter from "@/components/layout/filter/CategoryTreeFilter";
import BrandFilter from "@/components/layout/filter/BrandFilter";
import ProductBreadcrumb from "@/components/layout/product/ProductBreadcrumb";
import ProductFiltersBar from "@/components/layout/product/ProductFiltersBar";
import CategoryCard from "@/components/layout/category/CategoryCard";

// Main Component
export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [showLightLoading, setShowLightLoading] = useState(false);
  const [isGridRefreshing, setIsGridRefreshing] = useState(false);
  const [loadingFilterId, setLoadingFilterId] = useState<number | null>(null);
  const [loadingFilterType, setLoadingFilterType] = useState<'category' | 'brand' | null>(null);
  const [pendingPromoted, setPendingPromoted] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(true);
  const [showBrandFilter, setShowBrandFilter] = useState(true);

  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const filterLoadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // =======================
  // FIND CATEGORY & LEAF CHECK
  // =======================
  const findCategoryById = useCallback(
    (categories: any[], id: number): any | null => {
      for (const cat of categories) {
        if (cat.id === id) return cat;

        if (cat.children?.length) {
          const found = findCategoryById(cat.children, id);
          if (found) return found;
        }
      }
      return null;
    },
    []
  );

  // Hàm mới: lấy attribute filters từ URL
  const getAttributeFilters = useCallback(() => {
    const filters: Record<string, string | string[]> = {};
    
    // Lặp qua tất cả query params
    for (const [key, value] of searchParams.entries()) {
      if (key.startsWith('attr_')) {
        // Nếu đã có giá trị cho key này, chuyển thành array
        if (filters[key]) {
          if (Array.isArray(filters[key])) {
            (filters[key] as string[]).push(value);
          } else {
            filters[key] = [filters[key] as string, value];
          }
        } else {
          filters[key] = value;
        }
      }
    }
    
    return filters;
  }, [searchParams]);

  const getCurrentParams = useCallback(() => ({
    search: searchParams.get("search") || "",
    categoryId: searchParams.get("categoryId")
      ? Number(searchParams.get("categoryId"))
      : null,
    brandId: searchParams.get("brandId")
      ? Number(searchParams.get("brandId"))
      : null,
    hasPromotion: searchParams.get("hasPromotion") === "true",
    isFeatured: searchParams.get("isFeatured") === "true",
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    attributeFilters: getAttributeFilters(),
  }), [searchParams, getAttributeFilters]);

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    getCurrentParams().categoryId
  );
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(
    getCurrentParams().brandId
  );
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string | string[]>>(
    getCurrentParams().attributeFilters
  );
  const [sortBy, setSortBy] = useState<string>("createdAt_desc");
  const [showFeatured, setShowFeatured] = useState<boolean>(getCurrentParams().isFeatured);
  const [showPromoted, setShowPromoted] = useState<boolean>(getCurrentParams().hasPromotion);
  const [currentPage, setCurrentPage] = useState(getCurrentParams().page);
  const PRODUCTS_PER_PAGE = 12;

  const debouncedSearch = useDebounce(getCurrentParams().search, 300);

  // Sync state with URL
  useEffect(() => {
    const params = getCurrentParams();
    setSelectedCategoryId(params.categoryId);
    setSelectedBrandId(params.brandId);
    setSelectedAttributes(params.attributeFilters);
    setShowFeatured(params.isFeatured);
    setShowPromoted(params.hasPromotion);
    setCurrentPage(params.page);
  }, [searchParams, getCurrentParams]);

  // Get category tree for name
  const { data: categoryTree } = useCategoryTree();
  
  const currentCategory = useMemo(() => {
    if (!selectedCategoryId || !categoryTree) return null;
    return findCategoryById(categoryTree, selectedCategoryId);
  }, [selectedCategoryId, categoryTree, findCategoryById]);

  const isLeafCategory = useMemo(() => {
    if (!currentCategory) return false;
    return !currentCategory.children || currentCategory.children.length === 0;
  }, [currentCategory]);

  // Reset attributes khi chọn category cha
  useEffect(() => {
    if (!isLeafCategory) {
      setSelectedAttributes({});
    }
  }, [isLeafCategory]);

  const selectedCategoryName = useMemo(() => {
    return currentCategory?.name || null;
  }, [currentCategory]);

  // Lấy danh sách category con để hiển thị
  const childCategories = useMemo(() => {
    if (!currentCategory) return [];
    return currentCategory.children || [];
  }, [currentCategory]);

  // Helper: xây dựng query params cho API
  const buildQueryParams = useCallback(() => {
    const params: Record<string, any> = {};
    
    // Thêm các attribute filters vào query params
    Object.entries(selectedAttributes).forEach(([key, value]) => {
      params[key] = value;
    });
    
    return Object.keys(params).length > 0 ? params : undefined;
  }, [selectedAttributes]);

  // =======================
  // SAFE ATTRIBUTE QUERY PARAMS
  // =======================
  const safeQueryParams = useMemo(() => {
    if (!isLeafCategory) return undefined;
    return buildQueryParams();
  }, [isLeafCategory, buildQueryParams]);

  // Fetch products
  const shouldFetchProducts = useMemo(() => {
    return !selectedCategoryId || isLeafCategory;
  }, [selectedCategoryId, isLeafCategory]);

  const {
    data: productsResponse,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useProducts({
    page: currentPage,
    limit: PRODUCTS_PER_PAGE,
    search: debouncedSearch,
    brandId: selectedBrandId ?? undefined,
    categoryId: selectedCategoryId ?? undefined,
    sortBy: sortBy,
    isFeatured: showFeatured ? true : undefined,
    hasPromotion: showPromoted ? true : undefined,
    queryParams: safeQueryParams,
    enabled: shouldFetchProducts,
  });

  const products = (productsResponse?.data as Product[]) || [];
  const totalProducts = productsResponse?.total || 0;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const activeFilters = productsResponse?.activeFilters || [];

  // Fetch brands
  const { data: brandsResponse, isLoading: isBrandsLoading } = useBrands({
    limit: 50,
  });
  const allBrands = (brandsResponse?.data as Brand[]) || [];
  const visibleBrands = useMemo(() => allBrands.slice(0, 15), [allBrands]);

  const selectedBrand = useMemo(
    () => allBrands.find((b) => b.id === selectedBrandId),
    [allBrands, selectedBrandId]
  );

  // Helper: xây dựng URL với các params
  const buildUrlWithParams = useCallback((updates: {
    categoryId?: number | null;
    brandId?: number | null;
    attributes?: Record<string, string | string[]>;
    page?: number;
    search?: string;
  } = {}) => {
    const params = new URLSearchParams();
    
    const categoryIdToUse = updates.categoryId !== undefined ? updates.categoryId : selectedCategoryId;
    const brandIdToUse = updates.brandId !== undefined ? updates.brandId : selectedBrandId;
    const attributesToUse = updates.attributes !== undefined ? updates.attributes : selectedAttributes;
    const pageToUse = updates.page !== undefined ? updates.page : currentPage;
    const searchToUse = updates.search !== undefined ? updates.search : getCurrentParams().search;
    
    if (categoryIdToUse !== null && categoryIdToUse !== undefined) {
      params.set("categoryId", categoryIdToUse.toString());
    }
    
    if (brandIdToUse !== null && brandIdToUse !== undefined) {
      params.set("brandId", brandIdToUse.toString());
    }
    
    if (searchToUse) {
      params.set("search", searchToUse);
    }
    
    if (showPromoted) params.set("hasPromotion", "true");
    if (showFeatured) params.set("isFeatured", "true");
    
    if (isLeafCategory) {
      Object.entries(attributesToUse).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.set(key, value);
        }
      });
    }
    
    if (pageToUse > 1) {
      params.set("page", pageToUse.toString());
    }
    
    return `san-pham?${params.toString()}`;
  }, [selectedCategoryId, selectedBrandId, selectedAttributes, currentPage, getCurrentParams, showPromoted, showFeatured, isLeafCategory]);

  // Event handlers
  const handleCategoryClick = useCallback((categoryId: number | null) => {
    if (categoryId === selectedCategoryId && categoryId !== null) return;
    
    const newCategoryId = categoryId === selectedCategoryId ? null : categoryId;
    
    setLoadingFilterId(categoryId);
    setLoadingFilterType('category');
    setShowLightLoading(true);
    
    setSelectedCategoryId(newCategoryId);
    setCurrentPage(1);
    
    router.replace(buildUrlWithParams({ 
      categoryId: newCategoryId,
      page: 1 
    }), { scroll: false });
    
    filterLoadingTimeoutRef.current = setTimeout(() => {
      setLoadingFilterId(null);
      setLoadingFilterType(null);
      setShowLightLoading(false);
    }, 300);
  }, [selectedCategoryId, buildUrlWithParams, router]);

  const handleBrandClick = useCallback((brandId: number | null) => {
    if (brandId === selectedBrandId && brandId !== null) return;
    
    const newBrandId = brandId === selectedBrandId ? null : brandId;
    
    setLoadingFilterId(brandId);
    setLoadingFilterType('brand');
    setShowLightLoading(true);
    
    setSelectedBrandId(newBrandId);
    setCurrentPage(1);
    
    router.replace(buildUrlWithParams({ 
      brandId: newBrandId,
      page: 1 
    }), { scroll: false });
    
    filterLoadingTimeoutRef.current = setTimeout(() => {
      setLoadingFilterId(null);
      setLoadingFilterType(null);
      setShowLightLoading(false);
    }, 300);
  }, [selectedBrandId, buildUrlWithParams, router]);

  const handleRemoveAttributeFilter = useCallback((filter: any) => {
    if (!isLeafCategory) return;
    
    if (filter.type === 'attribute') {
      const key = `attr_${filter.attributeId}`;
      const currentValues = selectedAttributes[key];
      
      if (!currentValues) return;
      
      setShowLightLoading(true);
      setCurrentPage(1);
      
      let newAttributes = { ...selectedAttributes };
      
      if (Array.isArray(currentValues)) {
        const newValueIds = currentValues.filter(v => v !== filter.valueId.toString());
        if (newValueIds.length === 0) {
          delete newAttributes[key];
        } else if (newValueIds.length === 1) {
          newAttributes[key] = newValueIds[0];
        } else {
          newAttributes[key] = newValueIds;
        }
      } else if (currentValues === filter.valueId.toString()) {
        delete newAttributes[key];
      }
      
      setSelectedAttributes(newAttributes);
      
      router.replace(buildUrlWithParams({ 
        attributes: newAttributes,
        page: 1 
      }), { scroll: false });
      
      setTimeout(() => {
        setShowLightLoading(false);
      }, 300);
    }
  }, [selectedAttributes, buildUrlWithParams, router, isLeafCategory]);

  const handlePromotedChange = useCallback((checked: boolean) => {
    setShowLightLoading(true);
    setPendingPromoted(true);
    
    setShowPromoted(checked);
    setCurrentPage(1);
    
    router.replace(buildUrlWithParams({ page: 1 }), { scroll: false });
    
    setTimeout(() => {
      setShowLightLoading(false);
      setPendingPromoted(false);
    }, 300);
  }, [buildUrlWithParams, router]);

  const handleFeaturedChange = useCallback((checked: boolean) => {
    setShowLightLoading(true);
    
    setShowFeatured(checked);
    setCurrentPage(1);
    
    router.replace(buildUrlWithParams({ page: 1 }), { scroll: false });
    
    setTimeout(() => {
      setShowLightLoading(false);
    }, 300);
  }, [buildUrlWithParams, router]);

  const resetFilters = useCallback(() => {
    setShowLightLoading(true);
    
    setSelectedCategoryId(null);
    setSelectedBrandId(null);
    setSelectedAttributes({});
    setShowFeatured(false);
    setShowPromoted(false);
    setSortBy("createdAt_desc");
    setCurrentPage(1);
    
    router.replace("/san-pham", { scroll: false });
    
    setTimeout(() => {
      setShowLightLoading(false);
    }, 300);
  }, [router]);

  const handleSortChange = useCallback((value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    
    router.replace(buildUrlWithParams({ page }), { scroll: false });
    
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }, [buildUrlWithParams, router]);

  // Sort options
  const sortOptions = [
    { value: "createdAt_desc", label: "Mới nhất" },
    { value: "createdAt_asc", label: "Cũ nhất" },
    { value: "price_asc", label: "Giá: Thấp → Cao" },
    { value: "price_desc", label: "Giá: Cao → Thấp" },
  ];

  // Grid refresh optimization
  useEffect(() => {
    if (isProductsLoading) {
      setIsGridRefreshing(true);
    } else {
      scrollTimeoutRef.current = setTimeout(() => {
        setIsGridRefreshing(false);
      }, 50);
    }
    
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [isProductsLoading]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (filterLoadingTimeoutRef.current) clearTimeout(filterLoadingTimeoutRef.current);
    };
  }, []);

  // Tính toán số lượng filters đang active
  const activeFilterCount = useMemo(() => {
    let count = 0;
    
    if (selectedCategoryId) count++;
    if (selectedBrandId) count++;
    if (showFeatured) count++;
    if (showPromoted) count++;
    
    if (isLeafCategory) {
      Object.values(selectedAttributes).forEach(value => {
        if (Array.isArray(value)) {
          count += value.length;
        } else if (value) {
          count++;
        }
      });
    }
    
    return count;
  }, [selectedCategoryId, selectedBrandId, showFeatured, showPromoted, selectedAttributes, isLeafCategory]);

  // =======================
  // RENDER LOGIC
  // =======================
  const renderContent = useMemo(() => {
    // 1. Nếu đang loading
    if (isProductsLoading && currentPage === 1) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
          {[...Array(8)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    // 2. Nếu có lỗi
    if (isProductsError) {
      return (
        <div className="w-full py-8">
          <div className="flex justify-center">
            <div className="flex flex-col justify-center items-center bg-white p-6 border border-gray-200 text-center w-full max-w-md">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-2xl">⚠️</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Đã xảy ra lỗi
              </h3>
              <p className="text-gray-600 mb-4">
                Không thể tải dữ liệu. Vui lòng thử lại sau.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-800 text-white hover:bg-gray-900 rounded text-sm"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 3. Nếu là danh mục cha -> hiển thị danh mục con
    if (selectedCategoryId && !isLeafCategory && childCategories.length > 0) {
      return (
        <div className="pt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {childCategories.map((category: any) => (
              <CategoryCard 
                key={category.id} 
                category={category} 
              />
            ))}
          </div>
        </div>
      );
    }

    // 4. Nếu là leaf category hoặc không có category -> hiển thị sản phẩm
    if (products.length > 0) {
      return (
        <div className={`transition-opacity duration-150 ${isGridRefreshing ? 'opacity-80' : 'opacity-100'}`}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
            {products.map((product, index) => {
              const globalIndex = (currentPage - 1) * PRODUCTS_PER_PAGE + index;

              if (product.promotionProducts && product.promotionProducts.length > 0) {
                return (
                  <div key={`${product.id}-${currentPage}`}>
                    <ProductCardPromoted
                      product={product}
                      index={globalIndex}
                    />
                  </div>
                );
              } else if (product.isFeatured) {
                return (
                  <div key={`${product.id}-${currentPage}`}>
                    <ProductCardFeatured
                      product={product}
                      index={globalIndex}
                    />
                  </div>
                );
              } else {
                return (
                  <div key={`${product.id}-${currentPage}`}>
                    <ProductCard
                      product={product}
                      index={globalIndex}
                    />
                  </div>
                );
              }
            })}
          </div>
        </div>
      );
    }

    // 5. Không có sản phẩm
    return (
      <div className="w-full py-8">
        <div className="flex justify-center">
          <div className="flex flex-col justify-center items-center bg-white p-6 border border-gray-200 text-center w-full max-w-md">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-2xl">🔍</span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {showPromoted ? "Không có sản phẩm khuyến mãi" : "Không tìm thấy sản phẩm"}
            </h3>
            <p className="text-gray-600 mb-4">
              {showPromoted
                ? "Hiện tại không có sản phẩm nào đang khuyến mãi."
                : getCurrentParams().search
                ? `Không có sản phẩm nào phù hợp với tìm kiếm "${getCurrentParams().search}"`
                : "Không có sản phẩm nào phù hợp với bộ lọc hiện tại"}
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-800 text-white hover:bg-gray-900 rounded text-sm"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>
    );
  }, [
    isProductsLoading,
    isProductsError,
    currentPage,
    selectedCategoryId,
    isLeafCategory,
    childCategories,
    products,
    isGridRefreshing,
    showPromoted,
    getCurrentParams,
    resetFilters
  ]);

  // Loading state toàn trang
  if (isProductsLoading && currentPage === 1) {
    return (
      <div className="min-h-screen bg-white w-full">
        <ProductBreadcrumb
          searchTerm={getCurrentParams().search || undefined}
          selectedCategoryName={selectedCategoryName || undefined}
          selectedBrand={selectedBrand || undefined}
          showFeatured={showFeatured}
          showPromoted={showPromoted}
          currentPage={currentPage}
          totalPages={totalPages}
        />

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-9">
              <div className="h-24 bg-gray-100 rounded mb-4 animate-pulse"></div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {[...Array(8)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white w-full">
      {showLightLoading && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      <ProductBreadcrumb
        searchTerm={getCurrentParams().search || undefined}
        selectedCategoryName={selectedCategoryName || undefined}
        selectedBrand={selectedBrand || undefined}
        showFeatured={showFeatured}
        showPromoted={showPromoted}
        currentPage={currentPage}
        totalPages={totalPages}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 md:py-6">
        {/* MOBILE FILTER TOGGLE BUTTON */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="w-full flex items-center justify-between bg-gray-800 text-white px-4 py-3 rounded"
          >
            <div className="flex items-center gap-2">
              <FilterOutlined />
              <span>Bộ lọc</span>
              {activeFilterCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <SearchOutlined />
          </button>
        </div>

   

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* SIDEBAR FILTERS - DESKTOP */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-4">
              {/* Category Filter */}
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                  className="w-full flex justify-between items-center px-4 py-3 hover:bg-gray-50 border-b border-gray-200"
                >
                  <h3 className="font-medium text-gray-900">Danh mục</h3>
                  {showCategoryFilter ? <UpOutlined /> : <DownOutlined />}
                </button>
                {showCategoryFilter && (
                  <div className="p-2">
                    <CategoryTreeFilter
                      selectedCategoryId={selectedCategoryId}
                      onCategorySelect={handleCategoryClick}
                      isLoading={loadingFilterType === 'category' && !!loadingFilterId}
                      loadingCategoryId={loadingFilterId}
                    />
                  </div>
                )}
              </div>

              {/* Brand Filter */}
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setShowBrandFilter(!showBrandFilter)}
                  className="w-full flex justify-between items-center px-4 py-3 hover:bg-gray-50 border-b border-gray-200"
                >
                  <h3 className="font-medium text-gray-900">Thương hiệu</h3>
                  {showBrandFilter ? <UpOutlined /> : <DownOutlined />}
                </button>
                {showBrandFilter && (
                  <div className="p-2">
                    <BrandFilter
                      selectedBrandId={selectedBrandId}
                      onBrandSelect={handleBrandClick}
                      isLoading={loadingFilterType === 'brand' && !!loadingFilterId}
                      loadingBrandId={loadingFilterId}
                      brands={visibleBrands}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-9">
            {/* Sort Bar - Only for leaf categories */}
            {isLeafCategory && (
              <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-sm text-gray-600">
                    Hiển thị {products.length} sản phẩm
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 hidden sm:block">Sắp xếp:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="px-3 py-2 border border-gray-300 text-sm rounded w-full sm:w-auto"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* RENDER CONTENT */}
            {renderContent}

            {/* PAGINATION */}
            {isLeafCategory && totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    ←
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 border rounded text-sm ${
                          currentPage === pageNum
                            ? 'bg-gray-800 text-white border-gray-800'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE FILTERS DRAWER */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowMobileFilters(false)}
          />
          
          {/* Drawer Panel */}
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="p-4 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Bộ lọc</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <CloseOutlined />
                </button>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto space-y-4">
                {/* Category Filter */}
                <div className="border border-gray-200 rounded-lg">
                  <div className="p-3 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-medium text-gray-900">Danh mục</h3>
                  </div>
                  <div className="p-2 max-h-64 overflow-y-auto">
                    <CategoryTreeFilter
                      selectedCategoryId={selectedCategoryId}
                      onCategorySelect={(id) => {
                        handleCategoryClick(id);
                        setShowMobileFilters(false);
                      }}
                      isLoading={loadingFilterType === 'category' && !!loadingFilterId}
                      loadingCategoryId={loadingFilterId}
                    />
                  </div>
                </div>

                {/* Brand Filter */}
                <div className="border border-gray-200 rounded-lg">
                  <div className="p-3 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-medium text-gray-900">Thương hiệu</h3>
                  </div>
                  <div className="p-2">
                    <BrandFilter
                      selectedBrandId={selectedBrandId}
                      onBrandSelect={(id) => {
                        handleBrandClick(id);
                        setShowMobileFilters(false);
                      }}
                      isLoading={loadingFilterType === 'brand' && !!loadingFilterId}
                      loadingBrandId={loadingFilterId}
                      brands={visibleBrands}
                    />
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="pt-4 border-t mt-4">
                <button
                  onClick={resetFilters}
                  className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 mb-2"
                >
                  Xóa tất cả bộ lọc
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}