// hooks/usePcbOrder.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { PcbOrder, PcbOrderResponse } from '@/types/pcb-order.type'

export const usePcbOrder = (id: number | undefined) => {
  return useQuery({
    queryKey: ['pcb-order', id],
    queryFn: async (): Promise<PcbOrder> => {
      const res = await api.get<PcbOrderResponse>(`/pcb-orders/${id}`)
      if (!res.data.success || !res.data.data) {
        throw new Error(res.data.error || 'Không tìm thấy đơn hàng')
      }
      return res.data.data
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  })
}

export const usePcbOrderByOrderId = (pcbOrderId: string | undefined) => {
  return useQuery({
    queryKey: ['pcb-order-by-id', pcbOrderId],
    queryFn: async (): Promise<PcbOrder> => {
      const res = await api.get<PcbOrderResponse>(`/pcb-orders/order-id/${pcbOrderId}`)
      if (!res.data.success || !res.data.data) {
        throw new Error(res.data.error || 'Không tìm thấy đơn hàng')
      }
      return res.data.data
    },
    enabled: !!pcbOrderId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  })
}