// hooks/useUpdatePcbOrder.ts - Phiên bản đơn giản
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { PcbOrder, PcbOrderResponse } from '@/types/pcb-order.type'


interface UpdatePcbOrderParams {
  id: number
  data: any
}

export const useUpdatePcbOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      id, 
      data 
    }: UpdatePcbOrderParams): Promise<PcbOrder> => {
      const res = await api.put<PcbOrderResponse>(`/pcb-orders/${id}`, data)
      
      if (!res.data.success || !res.data.data) {
        throw new Error(res.data.message || 'Cập nhật đơn hàng thất bại')
      }

      return res.data.data
    },
    onSuccess: (data, variables) => {
      // Invalidate các query liên quan
      queryClient.invalidateQueries({ queryKey: ['pcb-orders'] })
      queryClient.invalidateQueries({ queryKey: ['pcb-order-statistics'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['user-pcb-orders'] })
      
      // Update cache cho đơn hàng cụ thể
      queryClient.setQueryData(['pcb-order', variables.id], data)
      queryClient.setQueryData(['pcb-order-by-id', data.pcbOrderId], data)
      
      // Update trong danh sách orders
      queryClient.setQueryData<PcbOrder[]>(['pcb-orders'], (old) =>
        old?.map(order => (order.id === variables.id ? data : order))
      )
    },
  })
}