// order.type.ts - Phiên bản cập nhật theo backend thực tế
import { DeliveryMethod } from "@/enums/order.enums"
import { User } from "./user.type"

// ✅ Payment Method type
export interface PaymentMethod {
  id: number
  code: string
  name: string
  createdAt?: string
  updatedAt?: string
}

// ✅ Product type
export interface Product {
  id: number
  name: string
  slug?: string
  description?: string
  basePrice?: number
  thumb?: string
  images?: string[]
  status?: string
  isPublished?: boolean
  isFeatured?: boolean
  totalRatings?: number
  totalReviews?: number
  numberSold?: number
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
  categoryId?: number
  brandId?: number
  createdById?: number
  weight?: number
  length?: number
  width?: number
  height?: number
  createdAt?: string
  updatedAt?: string
  stock?: number
  brand?: any
  category?: any
}

// ✅ Product Variant type
export interface ProductVariant {
  id: number
  productId: number
  sku: string
  barcode?: string
  priceDelta?: number
  price?: number | null
  attrValues?: Record<string, any>
  thumb?: string
  stock?: number
  createdAt?: string
  updatedAt?: string
  product?: Product
}

// ✅ Shipping Address type - khớp với backend ShippingAddress model
export interface ShippingAddress {
  id: number
  name: string
  phone: string
  address: string
  note?: string | null
  province_id: number
  province: string
  district_id: number
  district: string
  ward_id: number
  ward: string
  province_name?: string | null
  district_name?: string | null
  ward_name?: string | null
  is_default: boolean
  createdAt: string
  updatedAt: string
  userId?: number | null
}

// ✅ Order Item type - khớp với backend OrderItem
export interface OrderItem {
  id: number
  orderId: number
  productVariantId?: number | null
  productId?: number | null
  quantity: number
  unitPrice: number
  giftProductId?: number | null
  giftQuantity?: number | null
  createdAt?: string
  updatedAt?: string
  productVariant?: ProductVariant
  product?: Product
}

// ✅ User Basic Info - khớp với UserBasicDto từ backend
export interface UserBasicInfo {
  id: number
  name: string
  email: string
  phone?: string | null
  gender?: string | null
  avatar?: string | null
  isActive: boolean
  type_account: string
}

// ✅ Payment Method Basic - khớp với PaymentMethodBasicDto
export interface PaymentMethodBasic {
  id: number
  code: string
  name: string
}

// ✅ Shipping Address Basic - khớp với ShippingAddressBasicDto
export interface ShippingAddressBasic {
  id: number
  name: string
  phone: string
  address: string
  note?: string | null
  province_id: number
  province: string
  district_id: number
  district: string
  ward_id: number
  ward: string
  province_name?: string | null
  district_name?: string | null
  ward_name?: string | null
  is_default: boolean
  createdAt: string
  updatedAt: string
  userId?: number | null
}

// ✅ Order Payment type
export interface OrderPayment {
  id: number
  orderId: number
  paymentMethodId: number
  amount: number
  transactionId?: string
  status: string
  paymentDate?: string
  notes?: string
  createdAt?: string
  updatedAt?: string
  method?: PaymentMethod
}

// ✅ Order type - khớp với OrderResponseDto từ backend
export interface Order {
  id: number
  userId: number
  paymentMethodId?: number | null
  shippingAddressId?: number | null
  totalAmount: number
  status: string
  paymentStatus: string
  shippingFee: number
  deliveryMethod: DeliveryMethod | string
  createdAt: string
  updatedAt: string
  
  // Relations - khớp với backend response
  items?: OrderItem[]
  payments?: OrderPayment[]
  user?: UserBasicInfo
  paymentMethod?: PaymentMethodBasic
  shippingAddress?: ShippingAddressBasic
}

// ✅ OrderItemDto - cho việc tạo order
export interface OrderItemDto {
  productVariantId?: number | null
  productId?: number | null
  quantity: number
  unitPrice: number
  giftProductId?: number | null
  giftQuantity?: number
}

// ✅ CreateOrderDto - khớp với backend CreateOrderDto
export interface CreateOrderDto {
  items: OrderItemDto[]
  paymentMethodId?: number
  shippingAddressId?: number
  shippingFee?: number
  deliveryMethod?: DeliveryMethod | string
  totalAmount?: number
  status?: string
  paymentStatus?: string
}

// ✅ UpdateOrderDto - cho việc update order
export interface UpdateOrderDto {
  status?: string
  paymentStatus?: string
  shippingFee?: number
  deliveryMethod?: DeliveryMethod | string
  totalAmount?: number
  paymentMethodId?: number
  shippingAddressId?: number
}

// ✅ Order Response type (response từ API)
export interface OrderResponse {
  id: number
  userId: number
  paymentMethodId?: number | null
  shippingAddressId?: number | null
  totalAmount: number
  status: string
  paymentStatus: string
  shippingFee: number
  deliveryMethod: DeliveryMethod | string
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  payments?: OrderPayment[]
  user?: UserBasicInfo
  paymentMethod?: PaymentMethodBasic
  shippingAddress?: ShippingAddressBasic
}

// ✅ Order Filter type
export interface OrderFilter {
  userId?: number
  status?: string
  paymentStatus?: string
  search?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

// ✅ Order Summary type (dashboard stats)
export interface OrderSummary {
  orders: {
    total: number
    today: number
    monthly: number
    yearly: number
    pending: number
    processing: number
  }
  revenue: {
    total: number
    today: number
    monthly: number
    yearly: number
  }
}

// ✅ Revenue Statistics
export interface RevenueStatistics {
  totalRevenue: number
  currency: string
  startDate: string
  endDate: string
  status: string
}

// ✅ Order Statistics
export interface OrderStatistics {
  totalOrders: number
  startDate: string
  endDate: string
  status: string
  breakdownByStatus: {
    status: string
    count: number
  }[]
}

// ✅ Sales Statistics
export interface SalesStatistics {
  summary: {
    totalRevenue: number
    totalOrders: number
    successRate: number
    currency: string
    period: {
      startDate: string
      endDate: string
    }
  }
  breakdown: {
    byStatus: {
      status: string
      orderCount: number
      revenue: number
    }[]
  }
}

// ✅ Monthly Revenue
export interface MonthlyRevenue {
  year: number
  monthlyData: {
    month: number
    revenue: number
    orderCount: number
  }[]
}

// ✅ Stock Availability
export interface StockAvailability {
  available: boolean
  requested: number
  availableStock: number
  productName?: string
}

// ✅ User Purchase Check
export interface UserPurchaseCheck {
  hasPurchased: boolean
  orderId?: number | null
  orderItemId?: number | null
  orderStatus?: string
  purchasedAt?: string
  productName?: string
}

// ✅ Payment Status Enum
export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED'
}

// ✅ Order Status Enum
export enum OrderStatus {
  DRAFT = 'DRAFT',
  PAID_PENDING = 'PAID_PENDING',
  PAID = 'PAID',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

// ✅ API Response types
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageCount: number
}

// ✅ Specific API responses
export interface CreateOrderResponse extends ApiResponse<OrderResponse> {}

export interface OrderListResponse extends ApiResponse<PaginatedResponse<Order>> {}

export interface OrderDetailResponse extends ApiResponse<Order> {}

export interface RevenueResponse extends ApiResponse<RevenueStatistics> {}

export interface OrderStatsResponse extends ApiResponse<OrderStatistics> {}

export interface SalesStatsResponse extends ApiResponse<SalesStatistics> {}

export interface MonthlyRevenueResponse extends ApiResponse<MonthlyRevenue> {}

export interface DashboardStatsResponse extends ApiResponse<OrderSummary> {}

export interface StockCheckResponse extends ApiResponse<StockAvailability> {}

export interface PurchaseCheckResponse extends ApiResponse<UserPurchaseCheck> {}