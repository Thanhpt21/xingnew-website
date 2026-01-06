import { api } from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"

// hooks/categories/useCategories.ts
interface UseCategoriesParams {
  page?: number
  limit?: number
  search?: string
  parentId?: number | string
  status?: string
}

export const useCategories = ({
  page = 1,
  limit = 10,
  search = '',
  parentId,
  status
}: UseCategoriesParams = {}) => {
  return useQuery({
    queryKey: ['categories', page, limit, search, parentId, status],
    queryFn: async () => {
      const params: any = { page, limit, search }
      
      if (parentId !== undefined) {
        params.parentId = parentId === 0 ? '0' : parentId
      }
      
      if (status) {
        params.status = status
      }
      
      const res = await api.get('/categories', { params })
      return res.data.data
    },
  })
}