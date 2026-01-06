// hooks/product/useProducts.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

interface UseProductsParams {
  page?: number
  limit?: number
  search?: string
  brandId?: number
  categoryId?: number
  sortBy?: string
  isFeatured?: boolean
  hasPromotion?: boolean
  queryParams?: Record<string, any>
  // THÊM enabled vào params
  enabled?: boolean
}

export const useProducts = ({
  page = 1,
  limit = 10,
  search = '',
  brandId,
  categoryId,
  sortBy = 'createdAt_desc',
  isFeatured,
  hasPromotion,
  queryParams,
  enabled = true, // THÊM enabled với giá trị mặc định
}: UseProductsParams = {}) => {
  return useQuery({
    queryKey: [
      'products', 
      page, 
      limit, 
      search, 
      brandId, 
      categoryId, 
      sortBy,
      isFeatured,
      hasPromotion,
      queryParams ? Object.entries(queryParams).sort() : null
    ],
    queryFn: async () => {
      // Tạo params object
      const params: any = { 
        page, 
        limit, 
        search, 
        brandId, 
        categoryId, 
        sortBy,
        isFeatured,
        hasPromotion,
      }
      
      // Thêm các queryParams vào params (để xử lý attr_*)
      if (queryParams) {
        Object.keys(queryParams).forEach(key => {
          params[key] = queryParams[key]
        })
      }
      
      const res = await api.get('/products', { params })
      return res.data.data
    },
    // SỬ DỤNG enabled từ params
    enabled,
    // TỐI ƯU: Giữ data cũ khi đang fetch trang mới
    placeholderData: (previousData) => previousData,
    // TỐI ƯU: Cache 5 phút
    staleTime: 5 * 60 * 1000,
  })
}