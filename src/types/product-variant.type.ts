// DTO tạo variant
export interface CreateProductVariantDto {
  sku: string
  priceDelta?: number
  stock?: number 
  barcode?: string | null
  attrValues: Record<string, any> 
  thumb?: string
}

// DTO cập nhật variant
export interface UpdateProductVariantDto {
  sku?: string
  priceDelta?: number
  stock?: number 
  barcode?: string | null
  attrValues?: Record<string, any>
  thumb?: string
}


export interface ProductVariant {
  id: number
  productId: number
  sku: string
  stock: number
  barcode?: string | null
  priceDelta: number
  price?: number | null
  attrValues: Record<string, any>
  thumb?: string | null
  createdAt: string
  updatedAt: string
}