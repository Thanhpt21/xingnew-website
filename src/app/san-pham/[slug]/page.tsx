"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Minus, Plus } from "lucide-react";

// Hooks
import { useProductBySlug } from "@/hooks/product/useProductBySlug";
import { useProductVariants } from "@/hooks/product-variant/useProductVariants";
import { useAttributeValues } from "@/hooks/attribute-value/useAttributeValues";
import { useAllAttributes } from "@/hooks/attribute/useAllAttributes";
import { useAllCategories } from "@/hooks/category/useAllCategories";
import { useAllBrands } from "@/hooks/brand/useAllBrands";

// Utils & Types
import { getImageUrl } from "@/utils/getImageUrl";
import { Product } from "@/types/product.type";
import { ProductVariant } from "@/types/product-variant.type";
import { formatVND } from "@/utils/helpers";

// Components
import ProductImageGallery from "@/components/layout/product/ProductImageGallery";
import { useCartStore } from "@/stores/cartStore";
import ProductAttributesDisplay from "@/components/layout/product/ProductAttributesDisplay";

// Mobile Breadcrumb Component
const MobileBreadcrumb = ({ 
  categoryName, 
  productName, 
  categoryId 
}: { 
  categoryName?: string; 
  productName: string;
  categoryId?: number;
}) => {
  return (
    <div className="lg:hidden flex items-center justify-between bg-white px-3 py-2 border-b border-gray-200">
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-1 text-gray-700 hover:text-gray-900"
      >
        <span className="text-sm">← Quay lại</span>
      </button>
      
      <div className="flex-1 text-center">
        <span className="text-sm font-medium text-gray-900 truncate max-w-[200px] inline-block">
          {productName}
        </span>
      </div>
    </div>
  );
};

// Desktop Breadcrumb
const DesktopBreadcrumb = ({ categoryName, productName, categoryId }: { 
  categoryName?: string; 
  productName: string;
  categoryId?: number;
}) => {
  return (
    <nav className="hidden lg:block bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto py-2">
        <div className="flex items-center text-sm text-gray-600">
          <Link href="/" className="text-gray-700 hover:text-gray-900">
            Trang chủ
          </Link>
          <span className="mx-1">/</span>
          
          <Link href="/san-pham" className="text-gray-700 hover:text-gray-900">
            Sản phẩm
          </Link>
          
          {categoryName && categoryId && (
            <>
              <span className="mx-1">/</span>
              <Link 
                href={`/san-pham?category=${categoryId}`}
                className="text-gray-700 hover:text-gray-900"
              >
                {categoryName}
              </Link>
            </>
          )}
          
          <span className="mx-1">/</span>
          <span className="text-gray-900 font-medium truncate max-w-[200px]">
            {productName}
          </span>
        </div>
      </div>
    </nav>
  );
};

// Loading skeleton
const ProductDetailSkeleton = () => (
  <div className="min-h-screen bg-white">
    <div className="max-w-7xl mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="bg-gray-200 h-[300px] lg:h-[500px] rounded animate-pulse"></div>
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          <div className="h-8 bg-gray-200 rounded animate-pulse w-1/4"></div>
          <div className="h-12 bg-gray-200 rounded animate-pulse w-full"></div>
        </div>
      </div>
    </div>
  </div>
);

// Attribute Selection Component
const AttributeSelection = ({ 
  attr, 
  variants, 
  allAttributeValues,
  selectedAttributes,
  onSelect 
}: { 
  attr: any;
  variants: any[];
  allAttributeValues: any;
  selectedAttributes: Record<string, number>;
  onSelect: (attrId: string, valueId: number) => void;
}) => {
  const availableValues = useMemo(() => {
    if (!variants || !allAttributeValues?.data) return [];
    
    const filteredVariants = variants.filter(variant => {
      return Object.entries(selectedAttributes).every(([selectedAttrId, selectedValueId]) => {
        return variant.attrValues?.[selectedAttrId] === selectedValueId;
      });
    });
    
    const valueIds = new Set<number>();
    filteredVariants.forEach(variant => {
      const valueId = variant.attrValues?.[attr.id.toString()];
      if (valueId) valueIds.add(valueId);
    });
    
    return allAttributeValues.data.filter((av: any) => 
      av.attributeId === attr.id && valueIds.has(av.id)
    );
  }, [variants, allAttributeValues, selectedAttributes, attr.id]);

  if (availableValues.length === 0) return null;

  return (
    <div className="space-y-2">
      <label className="font-medium text-gray-900 text-sm">
        {attr.name}
      </label>
      <div className="flex flex-wrap gap-2">
        {availableValues.map((av: any) => (
          <button
            key={av.id}
            onClick={() => onSelect(attr.id.toString(), av.id)}
            className={`
              px-3 py-2 rounded border text-sm
              ${selectedAttributes[attr.id.toString()] === av.id
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-700'
              }
            `}
          >
            {av.value}
          </button>
        ))}
      </div>
    </div>
  );
};

// Quantity Control Component
const QuantityControl = ({ 
  quantity, 
  maxQuantity, 
  onIncrease, 
  onDecrease, 
  onChange 
}: { 
  quantity: number;
  maxQuantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onChange: (value: number) => void;
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= maxQuantity) {
      onChange(value);
    }
  };

  const handleBlur = () => {
    if (quantity < 1) onChange(1);
    if (quantity > maxQuantity) onChange(maxQuantity);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700">Số lượng:</span>
      <div className="flex items-center border border-gray-300 rounded">
        <button
          onClick={onDecrease}
          disabled={quantity <= 1}
          className={`p-2 ${quantity <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <Minus size={16} />
        </button>
        
        <input
          type="number"
          min="1"
          max={maxQuantity}
          value={quantity}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className="w-16 text-center py-2 border-x border-gray-300 text-sm focus:outline-none focus:ring-0"
        />
        
        <button
          onClick={onIncrease}
          disabled={quantity >= maxQuantity}
          className={`p-2 ${quantity >= maxQuantity ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <Plus size={16} />
        </button>
      </div>
      
      <span className="text-sm text-gray-500">
        Còn {maxQuantity} sản phẩm
      </span>
    </div>
  );
};

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Cart Store
  const { addItem } = useCartStore();

  // States
  const [isAdding, setIsAdding] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, number>>({});
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // THÊM: State cho số lượng
  const [quantity, setQuantity] = useState<number>(1);
  const [maxQuantity, setMaxQuantity] = useState<number>(1);

  // Data fetching
  const { 
    data: product, 
    isLoading: loadingProduct, 
    isError 
  } = useProductBySlug({ slug: slug as string});

  const productId = product?.id;
  
  const { data: variants } = useProductVariants(productId);
  const { data: allAttributes } = useAllAttributes();
  const { data: allAttributeValues } = useAttributeValues();
  const { data: allCategories } = useAllCategories();
  const { data: allBrands } = useAllBrands();

  // Memoized data
  const categoryName = useMemo(() => 
    allCategories?.find((cat: any) => cat.id === product?.categoryId)?.name,
    [allCategories, product]
  );

  const brandName = useMemo(() =>
    allBrands?.find((brand: any) => brand.id === product?.brandId)?.name,
    [allBrands, product]
  );

  // Check if product has variants
  const hasVariants = useMemo(() => {
    return variants && variants.length > 0;
  }, [variants]);

  // Check if all required attributes are selected
  const isAllAttributesSelected = useMemo(() => {
    if (!hasVariants) return true;
    
    const allAttributeIds = new Set<string>();
    variants?.forEach(variant => {
      Object.keys(variant.attrValues || {}).forEach(attrId => {
        allAttributeIds.add(attrId);
      });
    });
    
    return Array.from(allAttributeIds).every(attrId => 
      selectedAttributes[attrId] !== undefined
    );
  }, [hasVariants, variants, selectedAttributes]);

  // Variant selection
  useEffect(() => {
    if (!variants || !product) return;

    if (!hasVariants) {
      setSelectedVariant(null);
      return;
    }

    const matched = variants.find((v) => {
      return Object.entries(v.attrValues || {}).every(([attrId, valueId]) => {
        return selectedAttributes[attrId] === valueId;
      });
    });

    setSelectedVariant(matched ?? null);
  }, [selectedAttributes, variants, product, hasVariants]);

  
  // Calculate current max stock
  const currentMaxStock = useMemo(() => {
    if (hasVariants && selectedVariant) {
      return selectedVariant.stock;
    } else if (product) {
      return product.stock;
    }
    return 0;
  }, [hasVariants, selectedVariant, product]);

  // Check if product is in stock
  const isInStock = useMemo(() => {
    return currentMaxStock > 0;
  }, [currentMaxStock]);


  // Calculate max quantity based on stock
useEffect(() => {
  const newMaxQuantity = currentMaxStock > 0 ? currentMaxStock : 1;
  setMaxQuantity(newMaxQuantity);
  
  if (quantity > newMaxQuantity) {
    setQuantity(newMaxQuantity > 0 ? newMaxQuantity : 1);
  }
}, [currentMaxStock, quantity]);

  // Quantity handlers
  const handleIncreaseQuantity = useCallback(() => {
    if (quantity < maxQuantity) {
      setQuantity(prev => prev + 1);
    }
  }, [quantity, maxQuantity]);

  const handleDecreaseQuantity = useCallback(() => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  }, [quantity]);

  const handleQuantityChange = useCallback((value: number) => {
    if (value >= 1 && value <= maxQuantity) {
      setQuantity(value);
    }
  }, [maxQuantity]);

  // Calculate main image
  const calculatedMainImage = useMemo(() => {
    if (selectedVariant?.thumb) {
      return getImageUrl(selectedVariant.thumb);
    }
    return getImageUrl(product?.thumb ?? null);
  }, [selectedVariant, product]);

  // Initialize main image
  useEffect(() => {
    setMainImage(calculatedMainImage);
  }, [calculatedMainImage]);

  // Price calculations
  const { originalPrice, finalPrice, discountInfo } = useMemo(() => {
    if (!product) return { originalPrice: 0, finalPrice: 0, discountInfo: null };

    const basePrice = selectedVariant?.price || product.basePrice;
    const promo = product.promotionProducts?.[0];

    if (!promo) {
      return { originalPrice: basePrice, finalPrice: basePrice, discountInfo: null };
    }

    let discountedPrice = basePrice;
    
    if (promo.discountType === "PERCENT") {
      discountedPrice = basePrice * (1 - promo.discountValue / 100);
    } else if (promo.discountType === "FIXED") {
      discountedPrice = Math.max(0, basePrice - promo.discountValue);
    }

    return {
      originalPrice: basePrice,
      finalPrice: Math.round(discountedPrice),
      discountInfo: {
        type: promo.discountType,
        value: promo.discountValue,
        saved: basePrice - discountedPrice
      }
    };
  }, [product, selectedVariant]);

  // Promotion info
  const promo = product?.promotionProducts?.[0];
  const giftProduct = promo?.giftProduct;

  // Check if can add to cart
  const canAddToCart = useMemo(() => {
    if (!hasVariants) {
      return true;
    }
    
    return isAllAttributesSelected && selectedVariant !== null;
  }, [hasVariants, isAllAttributesSelected, selectedVariant]);

  // Prepare product data for cart
  const getProductData = useCallback((): any => {
    if (!product) throw new Error('Product not found');
    
    return {
      ...product,
      basePrice: selectedVariant?.price || product.basePrice,
      promotionProducts: product.promotionProducts || [],
    };
  }, [product, selectedVariant]);

  // Prepare variant data for cart
  const getVariantData = useCallback((): ProductVariant | null => {
    if (!selectedVariant) return null;
    
    return {
      ...selectedVariant,
      price: selectedVariant.price || product?.basePrice || 0,
    };
  }, [selectedVariant, product]);

  // Calculate final price with promotion
  const calculateFinalPrice = useCallback((basePrice: number, promotion: any) => {
    if (!promotion) return basePrice;

    if (promotion.discountType === "PERCENT") {
      return basePrice * (1 - promotion.discountValue / 100);
    } else if (promotion.discountType === "FIXED") {
      return Math.max(0, basePrice - promotion.discountValue);
    }
    
    return basePrice;
  }, []);

  // Event handlers - Sử dụng CartStore
  const handleAddToCart = useCallback(() => {
    if (!product || isAdding || !canAddToCart) return;

    setIsAdding(true);

    try {
      const productData = getProductData();
      const variantData = getVariantData();
      const promotion = productData.promotionProducts?.[0];
      const basePrice = variantData?.price || productData.basePrice;
      const finalPrice = calculateFinalPrice(basePrice, promotion);

      // Sử dụng CartStore để thêm vào giỏ hàng với số lượng
      const itemId = addItem({
        productId: productData.id,
        productVariantId: variantData?.id || null,
        quantity: quantity, // Sử dụng quantity state
        priceAtAdd: finalPrice,
        product: productData,
        variant: variantData
      });

      if (itemId > 0) {
        setShowSuccessMessage(true);
        setTimeout(() => {
          setIsAdding(false);
          setShowSuccessMessage(false);
          setQuantity(1); // Reset quantity sau khi thêm
        }, 2000);
      } else {
        setIsAdding(false);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsAdding(false);
    }
  }, [product, isAdding, canAddToCart, getProductData, getVariantData, calculateFinalPrice, addItem, quantity]);

  const handleBuyNow = useCallback(() => {
    if (!product || isAdding || !canAddToCart) return;

    setIsAdding(true);

    try {
      const productData = getProductData();
      const variantData = getVariantData();
      const promotion = productData.promotionProducts?.[0];
      const basePrice = variantData?.price || productData.basePrice;
      const finalPrice = calculateFinalPrice(basePrice, promotion);

      // Sử dụng CartStore để thêm vào giỏ hàng với số lượng
      const itemId = addItem({
        productId: productData.id,
        productVariantId: variantData?.id || null,
        quantity: quantity, // Sử dụng quantity state
        priceAtAdd: finalPrice,
        product: productData,
        variant: variantData
      });

      if (itemId > 0) {
        // Chuyển đến trang thanh toán
        router.push("/dat-hang");
      } else {
        setIsAdding(false);
      }
    } catch (error) {
      console.error('Error buying now:', error);
      setIsAdding(false);
    }
  }, [product, isAdding, canAddToCart, getProductData, getVariantData, calculateFinalPrice, addItem, router, quantity]);

  const handleAttributeSelect = useCallback((attrId: string, valueId: number) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [attrId]: valueId
    }));
  }, []);

  // Reset selection when product changes
  useEffect(() => {
    setSelectedAttributes({});
    setSelectedVariant(null);
    setQuantity(1); // Reset quantity khi product thay đổi
    if (product?.thumb) {
      setMainImage(getImageUrl(product.thumb));
    }
  }, [productId, product]);

  // Loading and error states
  if (loadingProduct) {
    return <ProductDetailSkeleton />;
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-8 bg-white border border-gray-200 max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Không tìm thấy sản phẩm</h3>
          <p className="text-gray-600 mb-6">Sản phẩm không tồn tại hoặc đã bị xóa.</p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-50"
            >
              Quay lại
            </button>
            <button 
              onClick={() => router.push("/san-pham")}
              className="px-4 py-2 bg-gray-800 text-white hover:bg-gray-900"
            >
              Xem sản phẩm khác
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <span>✓</span>
            <span>Đã thêm {quantity} sản phẩm vào giỏ hàng!</span>
          </div>
        </div>
      )}

      {/* Mobile Breadcrumb */}
      <MobileBreadcrumb 
        categoryName={categoryName}
        productName={product.name}
      />

      {/* Desktop Breadcrumb */}
      <DesktopBreadcrumb 
        categoryName={categoryName}
        productName={product.name}
      />

      <div className="max-w-7xl mx-auto py-4 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 p-3">
              <ProductImageGallery
                currentData={product}
                productTitle={product.name}
                mainImage={mainImage}
                onThumbnailClick={(imageUrl) => setMainImage(imageUrl)}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4 lg:space-y-6">
            {/* Product name and rating */}
            <div className="space-y-2">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                {product.name}
              </h1>
            </div>

            {/* Category & Brand */}
            <div className="flex items-center gap-2 flex-wrap">
              {brandName && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {brandName}
                </span>
              )}
              {categoryName && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {categoryName}
                </span>
              )}
            </div>

            {/* Price Section */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                {discountInfo && (
                  <span className="text-lg text-gray-400 line-through">
                    {formatVND(originalPrice)}
                  </span>
                )}
                <span className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {formatVND(finalPrice)}
                </span>
              </div>
              
              {discountInfo && (
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-sm rounded">
                    {discountInfo.type === "PERCENT" 
                      ? `-${discountInfo.value}%` 
                      : `-${formatVND(discountInfo.value)}`}
                  </span>
                  <span className="text-sm text-gray-600">
                    Tiết kiệm: {formatVND(discountInfo.saved)}
                  </span>
                </div>
              )}
            </div>

            {/* Gift Promotion */}
            {giftProduct && (
              <div className="border border-gray-200 p-3 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-900">🎁 Quà tặng</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded overflow-hidden border border-gray-200">
                    <img 
                      src={getImageUrl(giftProduct.thumb) || ''}
                      alt={giftProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {giftProduct.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      x{promo?.giftQuantity} - Miễn phí
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quantity Control - THÊM MỚI */}
            <div className="border border-gray-200 rounded p-4">
              <QuantityControl
                quantity={quantity}
                maxQuantity={maxQuantity}
                onIncrease={handleIncreaseQuantity}
                onDecrease={handleDecreaseQuantity}
                onChange={handleQuantityChange}
              />
              
              {/* Tổng tiền */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">Tổng tiền:</span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatVND(finalPrice * quantity)}
                  </span>
                </div>
                {discountInfo && (
                  <div className="text-sm text-green-600 mt-1">
                    Tiết kiệm: {formatVND(discountInfo.saved * quantity)}
                  </div>
                )}
              </div>
            </div>

            {/* Attribute Selection */}
            {hasVariants && allAttributes && allAttributes.length > 0 && (
              <div className="space-y-4">
                {allAttributes.map((attr: any) => (
                  <AttributeSelection
                    key={attr.id}
                    attr={attr}
                    variants={variants || []}
                    allAttributeValues={allAttributeValues}
                    selectedAttributes={selectedAttributes}
                    onSelect={handleAttributeSelect}
                  />
                ))}
                
                {/* Hiển thị trạng thái chọn variant */}
                {isAllAttributesSelected && selectedVariant && (
                  <div className="bg-green-50 border border-green-200 p-3 rounded">
                    <div className="text-sm font-medium text-green-800">
                      ✓ Biến thể đã chọn
                    </div>
                    <div className="text-xs text-green-700 mt-1">
                      Mã SKU: {selectedVariant.sku}
                    </div>
                  </div>
                )}
                
                {isAllAttributesSelected && !selectedVariant && (
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
                    <div className="text-sm font-medium text-yellow-800">
                      ⚠️ Biến thể này hiện không có sẵn
                    </div>
                    <div className="text-xs text-yellow-700 mt-1">
                      Vui lòng chọn thuộc tính khác
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Stock info */}
            <div className="text-sm text-gray-600">
              {hasVariants ? (
                selectedVariant ? (
                  selectedVariant.stock > 0 ? (
                    <span className="text-green-600">✓ Còn hàng ({selectedVariant.stock} sản phẩm)</span>
                  ) : (
                    <span className="text-red-600">✗ Hết hàng</span>
                  )
                ) : (
                  <span>Vui lòng chọn thuộc tính để xem tồn kho</span>
                )
              ) : (
                product.stock > 0 ? (
                  <span className="text-green-600">✓ Còn hàng ({product.stock} sản phẩm)</span>
                ) : (
                  <span className="text-red-600">✗ Hết hàng</span>
                )
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!canAddToCart || isAdding || !isInStock}
                  className={`px-4 py-3 rounded text-sm font-medium ${
                    !canAddToCart || isAdding || !isInStock
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-800 text-white hover:bg-gray-900'
                  }`}
                >
                  {!isInStock ? 'Hết hàng' : isAdding ? 'Đang thêm...' : 'Thêm vào giỏ'}
                </button>
                
               
              </div>
              
              {hasVariants && !isAllAttributesSelected && (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded">
                    <span className="text-blue-600">ℹ️</span>
                    <span className="text-blue-700 text-sm">
                      Vui lòng chọn đầy đủ thuộc tính
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Service Features */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 pt-4 border-t border-gray-200">
              <div className="text-center p-2">
                <div className="text-sm font-medium text-gray-900">🚚 Giao hàng</div>
                <div className="text-xs text-gray-600">Miễn phí</div>
              </div>
              <div className="text-center p-2">
                <div className="text-sm font-medium text-gray-900">🔄 Đổi trả</div>
                <div className="text-xs text-gray-600">7 ngày</div>
              </div>
              <div className="text-center p-2">
                <div className="text-sm font-medium text-gray-900">🛡️ Bảo hành</div>
                <div className="text-xs text-gray-600">Chính hãng</div>
              </div>
              <div className="text-center p-2">
                <div className="text-sm font-medium text-gray-900">⚡ Giao nhanh</div>
                <div className="text-xs text-gray-600">2-3 ngày</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white border border-gray-200 rounded overflow-hidden">
             <ProductAttributesDisplay productId={product.id} categoryId={product.categoryId || 0} />
        </div>

        {/* Product Description */}
        <div className="mt-8 bg-white border border-gray-200 rounded overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Mô tả sản phẩm</h3>
          </div>
          <div className="px-4 py-6">
            <div
              dangerouslySetInnerHTML={{
                __html: product.description || 
                  '<div class="text-gray-500 text-center py-6">Chưa có mô tả chi tiết cho sản phẩm này.</div>',
              }}
              className="text-gray-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
}