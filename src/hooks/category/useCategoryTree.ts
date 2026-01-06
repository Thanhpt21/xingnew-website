// hooks/categories/useCategoryTree.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useCategoryTree = () => {
  return useQuery({
    queryKey: ['categoryTree'],
    queryFn: async () => {
      const res = await api.get('/categories/tree')
      return res.data.data
    },
  })
}