// hooks/categories/useCategoryWithChildren.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

interface UseCategoryWithChildrenParams {
  id: number | string
  depth?: number
}

export const useCategoryWithChildren = ({ id, depth = 2 }: UseCategoryWithChildrenParams) => {
  return useQuery({
    queryKey: ['categoryWithChildren', id, depth],
    queryFn: async () => {
      const res = await api.get(`/categories/${id}/with-children`, {
        params: { depth }
      })
      return res.data.data
    },
    enabled: !!id,
  })
}