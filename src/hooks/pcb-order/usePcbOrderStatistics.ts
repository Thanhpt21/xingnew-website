// hooks/usePcbOrderStatistics.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { DashboardStats, StatusStatistics, StatsResponse } from '@/types/pcb-order.type'

export const usePcbOrderDashboardStats = () => {
  return useQuery({
    queryKey: ['pcb-order-statistics', 'dashboard'],
    queryFn: async (): Promise<DashboardStats> => {
      const res = await api.get<StatsResponse>('/pcb-orders/statistics/dashboard')
      if (!res.data.success || !res.data.data) {
        throw new Error('Không thể lấy thống kê')
      }
      return res.data.data as DashboardStats
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  })
}

export const usePcbOrderStatusStatistics = () => {
  return useQuery({
    queryKey: ['pcb-order-statistics', 'status'],
    queryFn: async (): Promise<StatusStatistics> => {
      const res = await api.get<StatsResponse>('/pcb-orders/statistics/status')
      if (!res.data.success || !res.data.data) {
        throw new Error('Không thể lấy thống kê trạng thái')
      }
      return res.data.data as StatusStatistics
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  })
}