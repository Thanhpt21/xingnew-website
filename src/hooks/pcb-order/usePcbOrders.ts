// hooks/usePcbOrders.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { 
  PcbOrderListResponse, 
  PcbOrderQueryParams,
  DEFAULT_PCB_ORDER_QUERY 
} from '@/types/pcb-order.type'

export const usePcbOrders = (params: PcbOrderQueryParams = {}) => {
  const queryParams = { ...DEFAULT_PCB_ORDER_QUERY, ...params }
  
  return useQuery({
    queryKey: ['pcb-orders', queryParams],
    queryFn: async (): Promise<PcbOrderListResponse> => {
      const res = await api.get('/pcb-orders', { params: queryParams })
      return res.data
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  })
}