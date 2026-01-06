// types/pcb-order.ts
export enum PcbOrderType {
  PCB = 'pcb',
  ASSEMBLY = 'assembly',
  STENCIL = 'stencil'
}

export enum PcbOrderStatus {
  NEW = 'NEW',
  QUOTATION_SENT = 'QUOTATION_SENT',
  CONFIRMED = 'CONFIRMED',
  IN_PRODUCTION = 'IN_PRODUCTION',
  QUALITY_CHECK = 'QUALITY_CHECK',
  READY_FOR_SHIP = 'READY_FOR_SHIP',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ON_HOLD = 'ON_HOLD'
}

export enum PcbPaymentStatus {
  PENDING = 'PENDING',
  DEPOSIT_PAID = 'DEPOSIT_PAID',
  FULLY_PAID = 'FULLY_PAID',
  REFUNDED = 'REFUNDED',
  PAYMENT_FAILED = 'PAYMENT_FAILED'
}

export interface PcbDetails {
  // Các trường cơ bản
  layerCount: string;                    // Số lớp: 1,2,4,6,8
  material: string;                      // Vật liệu: FR-4, Nhôm, Cem, 22F, 94VO, 94HB
  differentCircuits: string;             // Số mạch khác nhau: 1,2,3,4
  assemblyRequired: string;              // Yêu cầu ghép: Không/Có yêu cầu ghép
  thickness: string;                     // Độ dày phíp: 0.4-2.0mm
  copperThickness: string;               // Độ dày đồng: 1oz, 2oz
  
  // Các trường kỹ thuật mới
  halfHoleMachining: string;             // Gia công bán lỗ: Không/Có
  minDrillHole: string;                  // Lỗ khoan nhỏ nhất: ≥0.15mm đến ≥0.3mm
  minTraceWidth: string;                 // Độ rộng/cự ly đường mạch: ≥3mil đến ≥0.3mm
  chipBGA: string;                       // Chip BGA: Không, ≥0.25, ≥0.3, ≥0.35
  
  // Màu sắc và hoàn thiện
  pcbColor: string;                      // Màu Board: Xanh lá, Đỏ, Vàng, Xanh da trời, Đen, Trắng
  silkscreenColor: string;               // Màu chữ: Trắng, Đen, Không in
  surfaceFinish: string;                 // Mạ: Thiếc chì, Thiếc không chì, Vàng, OSP
  
  // Kiểm tra và hình dạng
  testMethod: string;                    // Phương thức kiểm tra: Mắt thường/Flying probe
  boardShape: string;                    // Hình dạng: Chữ nhật/Không phải chữ nhật
  
  // Giao hàng và thanh toán
  deliveryTime: string;                  // Thời gian giao hàng: Bình thường/Nhanh 13-17 ngày
  deliveryMethod: string;                // Phương thức giao hàng: Đến lấy/Chuyển phát nhanh
  paymentRatio: string;                  // Tỷ lệ thanh toán: 50%/100%
}
export interface AssemblyDetails {
  smdPoints: number;
  dipPoints: number;
  assemblySides: string;
  componentTypes: string;
  totalComponents: string;
  packaging: string;
  pcbaConfirmation: boolean;
  componentSource: string;
}

export interface StencilDetails {
  stencilType: string;
  electropolishing: string;
  stencilSide: string;
  fiducials: string;
}

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

// Type gốc từ Prisma
export interface PcbOrder {
  id: number;
  pcbOrderId: string;
  pcbOrderType: PcbOrderType;
  orderDate: Date | string;
  
  userId?: number;
  user?: UserInfo;
  
  // Thông tin giá
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  fastDelivery: boolean;
  fastDeliveryFee: number;
  finalTotal: number;
  
  // Thông tin kích thước
  boardWidth: number;
  boardHeight: number;
  totalArea: number;
  
  // Thông tin file
  gerberFileName?: string | null;
  gerberFileSize?: number | null;
  gerberFileType?: string | null;
  gerberFileUrl?: string | null;
  
  // Thông tin chi tiết theo từng loại (dạng JSON)
  pcbDetails?: PcbDetails | null;
  assemblyDetails?: AssemblyDetails | null;
  stencilDetails?: StencilDetails | null;
  
  // Ghi chú
  notes?: string | null;
  
  // Trạng thái
  status: PcbOrderStatus;
  paymentStatus: PcbPaymentStatus;
  
  // Thời gian
  estimatedCompleteDate?: Date | string | null;
  actualCompleteDate?: Date | string | null;
  
  // Timestamps
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Response types cho API
export interface PcbOrderResponse {
  success: boolean;
  data?: PcbOrder;
  error?: string;
  message?: string;
}

export interface PcbOrderListResponse {
  success: boolean;
  message?: string;
  data: {
    data: PcbOrder[];           // Danh sách đơn hàng
    total: number;              // Tổng số đơn hàng
    page: number;               // Trang hiện tại
    limit: number;              // Số lượng mỗi trang
    totalPages: number;         // Tổng số trang
  };
  error?: string;
}

// Type cho pagination response
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Type cho thống kê
export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  pendingOrders: number;
  inProductionOrders: number;
  completedOrders: number;
  revenueByMonth: Array<{ month: string; revenue: number }>;
  ordersByType: {
    pcb: number;
    assembly: number;
    stencil: number;
  };
}

export interface StatusStatistics {
  [key: string]: number;
}

export interface StatsResponse {
  success: boolean;
  data: DashboardStats | StatusStatistics;
  error?: string;
  message?: string;
}

// ==================== UPDATED: Type cho form data ====================
export interface PcbOrderFormData {
  // BẮT BUỘC theo schema
  pcbOrderType: PcbOrderType;
  userId: number;                     // Thêm: user ID bắt buộc
  quantity: number;
  unitPrice: number;                 // Thêm: giá đơn vị
  totalPrice: number;                // Thêm: tổng giá
  fastDelivery: boolean;
  fastDeliveryFee: number;           // Thêm: phí giao hàng nhanh
  finalTotal: number;                // Thêm: tổng cuối cùng
  boardWidth: number;
  boardHeight: number;
  totalArea: number;                 // Thêm: diện tích tổng (m²)
  
  // File upload (có thể có hoặc không)
  gerberFile?: File;
  
  // Thông tin file (optional - có thể tự động điền từ file)
  gerberFileName?: string;
  gerberFileSize?: number;
  gerberFileType?: string;
  
  // Chi tiết theo loại (optional)
  pcbDetails?: Partial<PcbDetails>;
  assemblyDetails?: Partial<AssemblyDetails>;
  stencilDetails?: Partial<StencilDetails>;
  
  // Ghi chú (optional)
  notes?: string;
  
  // Trạng thái (optional - có thể để default)
  status?: PcbOrderStatus;
  paymentStatus?: PcbPaymentStatus;
}

// Type cho update status
export interface UpdateStatusData {
  status: PcbOrderStatus;
  notes?: string;
}

// Type cho update payment status
export interface UpdatePaymentStatusData {
  paymentStatus: PcbPaymentStatus;
}

// Utility function để tạo form data mặc định
export function createDefaultPcbOrderFormData(userId: number): PcbOrderFormData {
  return {
    pcbOrderType: PcbOrderType.PCB,
    userId,
    quantity: 5,
    unitPrice: 0,
    totalPrice: 0,
    fastDelivery: false,
    fastDeliveryFee: 0,
    finalTotal: 0,
    boardWidth: 0,
    boardHeight: 0,
    totalArea: 0,
    notes: '',
    status: PcbOrderStatus.NEW,
    paymentStatus: PcbPaymentStatus.PENDING,
  };
}

// Helper để tính toán các giá trị dựa trên form data
export function calculatePcbOrderValues(formData: Partial<PcbOrderFormData>) {
  const quantity = formData.quantity || 0;
  const unitPrice = formData.unitPrice || 0;
  const boardWidth = formData.boardWidth || 0;
  const boardHeight = formData.boardHeight || 0;
  const fastDelivery = formData.fastDelivery || false;
  const fastDeliveryFee = formData.fastDeliveryFee || 0;
  
  return {
    totalPrice: quantity * unitPrice,
    totalArea: (boardWidth * boardHeight) / 1000000, // mm² to m²
    finalTotal: (quantity * unitPrice) + (fastDelivery ? fastDeliveryFee : 0),
  };
}

// Helper để validate form data
export function validatePcbOrderFormData(formData: PcbOrderFormData): string[] {
  const errors: string[] = [];
  
  if (!formData.userId) errors.push('Thiếu userId');
  if (!formData.quantity || formData.quantity <= 0) errors.push('Số lượng phải lớn hơn 0');
  if (!formData.boardWidth || formData.boardWidth <= 0) errors.push('Chiều rộng board phải lớn hơn 0');
  if (!formData.boardHeight || formData.boardHeight <= 0) errors.push('Chiều cao board phải lớn hơn 0');
  if (formData.unitPrice < 0) errors.push('Giá đơn vị không hợp lệ');
  if (formData.totalPrice < 0) errors.push('Tổng giá không hợp lệ');
  if (formData.finalTotal < 0) errors.push('Tổng cuối cùng không hợp lệ');
  if (formData.totalArea <= 0) errors.push('Diện tích không hợp lệ');
  
  return errors;
}

// Type guard functions
export function isPcbOrder(order: PcbOrder): order is PcbOrder & { 
  pcbOrderType: PcbOrderType.PCB; 
  pcbDetails: PcbDetails 
} {
  return order.pcbOrderType === PcbOrderType.PCB && order.pcbDetails != null;
}

export function isAssemblyOrder(order: PcbOrder): order is PcbOrder & { 
  pcbOrderType: PcbOrderType.ASSEMBLY; 
  assemblyDetails: AssemblyDetails 
} {
  return order.pcbOrderType === PcbOrderType.ASSEMBLY && order.assemblyDetails != null;
}

export function isStencilOrder(order: PcbOrder): order is PcbOrder & { 
  pcbOrderType: PcbOrderType.STENCIL; 
  stencilDetails: StencilDetails 
} {
  return order.pcbOrderType === PcbOrderType.STENCIL && order.stencilDetails != null;
}

// Type guard cho PcbOrderFormData
export function isValidPcbOrderFormData(data: any): data is PcbOrderFormData {
  return (
    data &&
    typeof data === 'object' &&
    data.pcbOrderType &&
    typeof data.userId === 'number' &&
    typeof data.quantity === 'number' &&
    typeof data.unitPrice === 'number' &&
    typeof data.totalPrice === 'number' &&
    typeof data.fastDelivery === 'boolean' &&
    typeof data.fastDeliveryFee === 'number' &&
    typeof data.finalTotal === 'number' &&
    typeof data.boardWidth === 'number' &&
    typeof data.boardHeight === 'number' &&
    typeof data.totalArea === 'number'
  );
}

// Utility types cho Prisma JSON fields
export type PcbDetailsJson = string | PcbDetails | null;
export type AssemblyDetailsJson = string | AssemblyDetails | null;
export type StencilDetailsJson = string | StencilDetails | null;

// Helper để parse JSON fields
export function parsePcbDetails(details: any): PcbDetails | null {
  if (!details) return null;
  if (typeof details === 'string') {
    try {
      return JSON.parse(details) as PcbDetails;
    } catch {
      return null;
    }
  }
  return details as PcbDetails;
}

export function parseAssemblyDetails(details: any): AssemblyDetails | null {
  if (!details) return null;
  if (typeof details === 'string') {
    try {
      return JSON.parse(details) as AssemblyDetails;
    } catch {
      return null;
    }
  }
  return details as AssemblyDetails;
}

export function parseStencilDetails(details: any): StencilDetails | null {
  if (!details) return null;
  if (typeof details === 'string') {
    try {
      return JSON.parse(details) as StencilDetails;
    } catch {
      return null;
    }
  }
  return details as StencilDetails;
}

// Type cho query params
export interface PcbOrderQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  pcbOrderType?: PcbOrderType;
  status?: PcbOrderStatus;
  paymentStatus?: PcbPaymentStatus;
  userId?: number;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Type cho export
export interface ExportParams {
  startDate?: string;
  endDate?: string;
  pcbOrderType?: PcbOrderType;
  status?: PcbOrderStatus;
  paymentStatus?: PcbPaymentStatus;
}

// Default values
export const DEFAULT_PCB_ORDER_QUERY: PcbOrderQueryParams = {
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc'
};

export interface UserPcbOrdersResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      phone: string | null;
      avatar: string | null;
    };
    orders: PcbOrder[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    statistics: {
      totalOrders: number;
      totalSpent: number;
      statusCounts: Record<string, number>;
      averageOrderValue: number;
    };
  };
}

// Thêm query params cho user orders
export interface UserPcbOrderQueryParams extends PcbOrderQueryParams {
  userId?: number;
}

// Default query cho user orders
export const DEFAULT_USER_PCB_ORDER_QUERY: PcbOrderQueryParams = {
  page: 1,
  limit: 10,
};