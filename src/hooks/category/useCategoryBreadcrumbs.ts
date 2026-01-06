// hooks/categories/useCategoryBreadcrumbs.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useCategoryBreadcrumbs = (categoryId: number) => {
  return useQuery({
    queryKey: ['category-breadcrumbs', categoryId],
    queryFn: async () => {
      const res = await api.get(`/categories/${categoryId}/breadcrumbs`)
      return res.data.data
    },
    enabled: !!categoryId,
  })
}