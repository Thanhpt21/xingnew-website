// types/category.type.ts
import { Product } from "./product.type";

// Base Category interface
export interface Category {
  id: number;
  parentId?: number | null; 
  name: string;
  slug: string;
  description?: string | null;
  thumb?: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
  position: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  createdAt: string;
  updatedAt: string;
  
  // Relationships
  parent?: Category | null;
  children?: Category[];
  products?: Product[];
}

// Category with counts (cho các API trả về thêm counts)
export interface CategoryWithCounts extends Category {
  _count?: {
    products?: number;
    children?: number;
  };
  level?: number; // Thêm level nếu cần
}

// Hoặc nếu muốn counts là required
export interface CategoryWithRequiredCounts extends Category {
  _count: {
    products: number;
    children: number;
  };
  level?: number;
}

// Category for API responses
export interface CategoryResponse {
  success: boolean;
  message: string;
  data: CategoryWithCounts | CategoryWithCounts[];
  total?: number;
  page?: number;
  pageCount?: number;
}