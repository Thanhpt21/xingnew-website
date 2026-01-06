// hooks/categories/useNestedCategoryTree.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

interface UseNestedCategoryTreeParams {
  levels?: number
}

export const useNestedCategoryTree = ({ levels = 3 }: UseNestedCategoryTreeParams = {}) => {
  return useQuery({
    queryKey: ['nestedCategoryTree', levels],
    queryFn: async () => {
      const res = await api.get('/categories/nested', { params: { levels } })
      return res.data.data
    },
  })
}