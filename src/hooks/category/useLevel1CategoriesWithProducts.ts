// hooks/categories/useLevel1CategoriesWithProducts.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { Product } from '@/types/product.type'

interface Level3Category {
  id: number
  name: string
  slug: string
  productCount: number
}


interface Level1CategoryWithProducts {
  id: number
  name: string
  slug: string
  thumb: string | null
  description: string
  level: number
  level3Categories: Level3Category[]
  level3CategoriesCount: number
  topProducts: Product[]
}

interface UseLevel1CategoriesWithProductsProps {
  limit?: number
  enabled?: boolean
}

export const useLevel1CategoriesWithProducts = ({
  limit = 5,
  enabled = true,
}: UseLevel1CategoriesWithProductsProps = {}) => {
  return useQuery({
    queryKey: ['level1CategoriesWithProducts', limit],
    queryFn: async () => {
      // Dùng tree để lấy categories theo cấp bậc
      const res = await api.get('/categories/tree')
      const allCategories = res.data.data as any[]
      
      // Filter chỉ lấy level 1, và limit số lượng
      return allCategories.slice(0, limit).map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        thumb: cat.thumb || null,
        description: cat.description || '',
        level: cat.level || 1,
        level3Categories: extractLevel3Categories(cat.children || []),
        level3CategoriesCount: countLevel3Categories(cat.children || []),
        topProducts: [] // Nếu API không trả về products, để rỗng
      })) as Level1CategoryWithProducts[]
    },
    enabled,
    // Cache trong 5 phút, stale trong 1 phút
    staleTime: 60 * 1000, // 1 phút
    gcTime: 5 * 60 * 1000, // 5 phút (React Query v5 dùng gcTime thay cho cacheTime)
  })
}

// Helper function để trích xuất level 3 categories từ tree
function extractLevel3Categories(children: any[]): any[] {
  const level3: any[] = []
  
  for (const level2 of children) {
    if (level2.children && level2.children.length > 0) {
      for (const level3Cat of level2.children) {
        level3.push({
          id: level3Cat.id,
          name: level3Cat.name,
          slug: level3Cat.slug,
          productCount: level3Cat._count?.products || 0
        })
      }
    }
  }
  
  return level3
}

// Helper function để đếm level 3 categories
function countLevel3Categories(children: any[]): number {
  let count = 0
  
  for (const level2 of children) {
    if (level2.children && level2.children.length > 0) {
      count += level2.children.length
    }
  }
  
  return count
}