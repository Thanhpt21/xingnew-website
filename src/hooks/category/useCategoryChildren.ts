// hooks/categories/useCategoryChildren.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useCategoryChildren = (parentId: number | string | null) => {
  return useQuery({
    queryKey: ['categoryChildren', parentId],
    queryFn: async () => {
      const res = await api.get(`/categories?parentId=${parentId === null ? 0 : parentId}`)
      return res.data.data
    },
    enabled: parentId !== undefined,
  })
}