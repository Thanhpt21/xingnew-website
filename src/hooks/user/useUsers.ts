// useUsers.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

interface UseUsersParams {
  page?: number
  limit?: number
  search?: string
  enabled?: boolean
}

interface User {
  id: number
  name: string
  email: string
  avatar: string | null
  isActive: boolean
  type_account: string
  tokenAI: number
  role: string
  createdAt: string
  updatedAt: string
  conversationId: number | null
  stats: {
    totalMessages: number
    totalOrders: number
    totalOrderValue: number
    recentOrdersCount: number
    avgOrderValue: number
  }
  recentOrders: Array<{
    id: number
    totalAmount: number
    status: string
    createdAt: string
  }>
}

interface UsersResponse {
  data: User[]
  total: number
  page: number
  pageCount: number
}

export const useUsers = ({
  page = 1,
  limit = 10,
  search = '',
  enabled = true,
}: UseUsersParams = {}) => {
  return useQuery({
    queryKey: ['users', { page, limit, search }], // Object format tốt hơn
    queryFn: async (): Promise<UsersResponse> => {
      const res = await api.get('/users', {
        params: { 
          page, 
          limit, 
          search,
          timestamp: Date.now() // Tránh cache
        },
      })
      return res.data.data
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 phút
    gcTime: 10 * 60 * 1000, // 10 phút (trong React Query v4 trở lên)
    retry: 2,
    refetchOnWindowFocus: false, // Tùy chọn
  })
}

