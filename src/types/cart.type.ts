// types/cart.type.ts
import { PromotionProduct } from "./promotion-product.type"

// Sửa Product interface cho phù hợp với product.type.ts
export interface Product {
  id: number
  name: string
  slug: string
  description?: string | null // ✅ Thay đổi từ string thành string | null
  basePrice: number
  thumb?: string | null // ✅ Thêm null
  images?: string[] | null
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'OUT_OF_STOCK' | 'DELETED'
  isPublished: boolean
  isFeatured: boolean
  totalRatings: number
  totalReviews: number
  numberSold: number
  seoTitle?: string | null // ✅ Thêm null
  seoDescription?: string | null // ✅ Thêm null
  seoKeywords?: string | null // ✅ Thêm null
  categoryId: number
  brandId: number
  createdById: number
  weight?: number | null // ✅ Thêm null
  length?: number | null // ✅ Thêm null
  width?: number | null // ✅ Thêm null
  height?: number | null // ✅ Thêm null
  stock?: number // ✅ Thêm stock (nếu cần)
  createdAt: string
  updatedAt: string
  promotionProducts: PromotionProduct[]
}

export interface ProductVariant {
  id: number
  productId: number
  sku: string
  barcode?: string | null
  priceDelta: number
  price?: number | null
  attrValues: Record<string, any> | null
  thumb?: string | null
  stock: number
  createdAt: string
  updatedAt: string
  product?: Product
}

export interface CartItem {
  id: number
  cartId?: number // ✅ Optional
  productVariantId: number | null
  productId: number // ✅ KHÔNG NULL
  quantity: number
  priceAtAdd: number
  finalPrice?: number
  createdAt?: string // ✅ Optional
  updatedAt?: string // ✅ Optional
  variant?: ProductVariant | null
  product?: Product // ✅ Thêm null ở đây nếu cần
}

export interface AddCartItemDto {
  productVariantId?: number | null
  productId?: number | null
  quantity: number
  priceAtAdd?: number
}

export interface UpdateCartItemDto {
  quantity?: number
  priceAtAdd?: number
}

export interface ClientCartItemDto {
  productVariantId?: number | null
  productId?: number | null
  quantity: number
  priceAtAdd?: number
}

export interface MergeCartDto {
  items: ClientCartItemDto[]
}