import { CartItem, Product, ProductVariant } from '@/types/cart.type';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartStore {
  items: CartItem[];
  selectedItems: Set<number>;
  isHydrated: boolean;

  // Actions
  addItem: (itemData: Partial<CartItem> & { 
    productId: number; 
    quantity: number; 
    priceAtAdd: number; 
  }) => number;
  updateQuantity: (itemId: number, quantity: number) => void;
  removeItem: (id: number) => void;
  getTotalPrice: () => number;
  
  // Selected items actions
  setSelectedItems: (items: Set<number>) => void;
  toggleSelectItem: (id: number) => void;
  selectAll: (checked: boolean, itemIds?: number[]) => void;
  clearSelectedItems: () => void;
  clearCart: () => void;

  // Getters
  isSelectAll: () => boolean;
  getSelectedTotal: () => number;
  getItemById: (id: number) => CartItem | undefined;
  getItemCount: () => number;
  getItemByProduct: (productId: number, variantId?: number | null) => CartItem | undefined;
  
  // Helper functions
  calculateFinalPrice: (basePrice: number, promotion?: any) => number;
}

// Helper để tạo Product object an toàn
const createSafeProduct = (productData: any): Product => ({
  id: productData?.id || 0,
  name: productData?.name || 'Sản phẩm không xác định',
  slug: productData?.slug || '',
  description: productData?.description || '', // ✅ Đảm bảo là string
  basePrice: productData?.basePrice || 0,
  thumb: productData?.thumb || null,
  images: productData?.images || null,
  status: productData?.status || 'ACTIVE',
  isPublished: productData?.isPublished || false,
  isFeatured: productData?.isFeatured || false,
  totalRatings: productData?.totalRatings || 0,
  totalReviews: productData?.totalReviews || 0,
  numberSold: productData?.numberSold || 0,
  seoTitle: productData?.seoTitle || null,
  seoDescription: productData?.seoDescription || null,
  seoKeywords: productData?.seoKeywords || null,
  categoryId: productData?.categoryId || 0,
  brandId: productData?.brandId || 0,
  createdById: productData?.createdById || 0,
  weight: productData?.weight || null,
  length: productData?.length || null,
  width: productData?.width || null,
  height: productData?.height || null,
  createdAt: productData?.createdAt || new Date().toISOString(),
  updatedAt: productData?.updatedAt || new Date().toISOString(),
  promotionProducts: productData?.promotionProducts || [],
});

// Helper để tạo ProductVariant object an toàn
const createSafeVariant = (variantData: any): ProductVariant | null => {
  if (!variantData) return null;
  
  return {
    id: variantData.id || 0,
    productId: variantData.productId || 0,
    sku: variantData.sku || '',
    barcode: variantData.barcode || null,
    priceDelta: variantData.priceDelta || 0,
    price: variantData.price || null,
    attrValues: variantData.attrValues || null,
    thumb: variantData.thumb || null,
    stock: variantData.stock || 0,
    createdAt: variantData.createdAt || new Date().toISOString(),
    updatedAt: variantData.updatedAt || new Date().toISOString(),
    product: variantData.product ? createSafeProduct(variantData.product) : undefined,
  };
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      selectedItems: new Set<number>(),
      isHydrated: false,

      // Thêm item mới vào cart - Sửa lại để nhận Partial<CartItem>
      addItem: (itemData) => {
        const { 
          productId, 
          productVariantId, 
          quantity, 
          priceAtAdd, 
          product, 
          variant 
        } = itemData;
        
        // Validate: phải có productId
        if (!productId) {
          console.error('Cannot add item: missing productId');
          return -1;
        }
        
        // Validate: price phải > 0
        if (priceAtAdd <= 0) {
          console.error('Cannot add item: invalid price', priceAtAdd);
          return -1;
        }
        
        // Kiểm tra item đã tồn tại chưa
        const existingItem = get().getItemByProduct(productId, productVariantId || null);
        
        if (existingItem) {
          // Cập nhật số lượng nếu đã tồn tại
          get().updateQuantity(existingItem.id, existingItem.quantity + quantity);
          return existingItem.id;
        } else {
          // Tạo item mới với dữ liệu an toàn
          const newId = Date.now();
          const safeProduct = createSafeProduct(product);
          const safeVariant = createSafeVariant(variant);
          
          const newItem: CartItem = {
            id: newId,
            cartId: 0, // Không cần cartId nữa
            productId: productId,
            productVariantId: productVariantId || null,
            quantity,
            priceAtAdd,
            finalPrice: get().calculateFinalPrice(priceAtAdd, safeProduct.promotionProducts?.[0]),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            variant: safeVariant,
            product: safeProduct,
          };
          
          set((state) => {
            const newSelected = new Set(state.selectedItems);
            newSelected.add(newId);
            return { 
              items: [...state.items, newItem], 
              selectedItems: newSelected,
            };
          });
          
          return newId;
        }
      },

      // Cập nhật số lượng
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        
        set((state) => {
          const item = state.items.find(i => i.id === itemId);
          if (!item) return state;

          const updatedItem = {
            ...item,
            quantity,
            updatedAt: new Date().toISOString(),
            finalPrice: item.finalPrice || item.priceAtAdd,
          };

          return {
            items: state.items.map(i => i.id === itemId ? updatedItem : i)
          };
        });
      },

      // Xóa item
      removeItem: (id) =>
        set((state) => {
          const newSelected = new Set(state.selectedItems);
          newSelected.delete(id);
          return {
            items: state.items.filter((i) => i.id !== id),
            selectedItems: newSelected,
          };
        }),

      // Tính tổng giá tất cả items
      getTotalPrice: () =>
        get().items.reduce((sum, i) => {
          const price = i.finalPrice || i.priceAtAdd || 0;
          return sum + price * i.quantity;
        }, 0),

      // Set selected items
      setSelectedItems: (items) => set({ selectedItems: items }),

      // Toggle select item
      toggleSelectItem: (id) =>
        set((state) => {
          const newSelected = new Set(state.selectedItems);
          if (newSelected.has(id)) newSelected.delete(id);
          else newSelected.add(id);
          return { selectedItems: newSelected };
        }),

      // Select all items
      selectAll: (checked, itemIds = get().items.map(i => i.id)) =>
        set({ selectedItems: checked ? new Set(itemIds) : new Set() }),

      // Clear selected items
      clearSelectedItems: () => set({ selectedItems: new Set() }),

      // Clear cart
      clearCart: () => {
        set({ items: [], selectedItems: new Set() });
      },

      // Kiểm tra đã chọn tất cả chưa
      isSelectAll: () => {
        const { items, selectedItems } = get();
        return items.length > 0 && items.every((item) => selectedItems.has(item.id));
      },

      // Tính tổng giá các items đã chọn
      getSelectedTotal: () => {
        const { items, selectedItems } = get();
        return items
          .filter((item) => selectedItems.has(item.id))
          .reduce((total, item) => {
            const price = item.finalPrice || item.priceAtAdd || 0;
            return total + price * item.quantity;
          }, 0);
      },

      // Lấy item theo ID
      getItemById: (id: number) => {
        return get().items.find(item => item.id === id);
      },

      // Lấy số lượng items
      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      // Lấy item theo product và variant (có thể null)
      getItemByProduct: (productId: number, variantId?: number | null) => {
        return get().items.find(item => {
          // So sánh productId
          if (item.productId !== productId) {
            return false;
          }
          
          // So sánh variantId nếu có
          if (variantId !== undefined) {
            return item.productVariantId === variantId;
          }
          
          return true;
        });
      },

      // Tính giá cuối cùng sau khi áp dụng promotion
      calculateFinalPrice: (basePrice: number, promotion?: any) => {
        if (!promotion) return basePrice;
        
        let finalPrice = basePrice;
        
        if (promotion.discountType === 'PERCENT') {
          finalPrice = basePrice * (1 - promotion.discountValue / 100);
        } else if (promotion.discountType === 'FIXED') {
          finalPrice = Math.max(0, basePrice - promotion.discountValue);
        }
        
        return Math.round(finalPrice);
      },
    }),
    {
      name: 'cart-storage',
      version: 6, // Tăng version để clear cache cũ
      partialize: (state) => ({
        items: state.items.map((item) => ({
          id: item.id,
          productVariantId: item.productVariantId,
          productId: item.productId,
          quantity: item.quantity,
          priceAtAdd: item.priceAtAdd,
          finalPrice: item.finalPrice,
          product: item.product ? createSafeProduct(item.product) : null,
          variant: item.variant ? createSafeVariant(item.variant) : null,
        })),
        selectedItems: Array.from(state.selectedItems),
      }),
      merge: (persistedState: any, currentState: CartStore): CartStore => {
        if (!persistedState) {
          return { ...currentState, isHydrated: true };
        }

        const selectedItems = persistedState?.selectedItems
          ? new Set<number>(persistedState.selectedItems)
          : new Set<number>();

        const items = persistedState?.items || [];

        // Validate và restore items
        const validatedItems: CartItem[] = items.map((item: any) => {
          const safeProduct = createSafeProduct(item.product);
          const safeVariant = createSafeVariant(item.variant);
          
          return {
            id: item.id || Date.now(),
            productVariantId: item.productVariantId || null,
            productId: item.productId || safeProduct.id || 0,
            quantity: item.quantity || 1,
            priceAtAdd: item.priceAtAdd || 0,
            finalPrice: item.finalPrice || item.priceAtAdd || 0,
            product: safeProduct,
            variant: safeVariant,
            cartId: 0,
            createdAt: item.createdAt || new Date().toISOString(),
            updatedAt: item.updatedAt || new Date().toISOString(),
          };
        });

        return {
          ...currentState,
          items: validatedItems,
          selectedItems,
          isHydrated: true,
        };
      },
    }
  )
);

// Hook để kiểm tra hydration
export const useCartHydration = () => {
  const isHydrated = useCartStore((state) => state.isHydrated);
  return isHydrated;
};