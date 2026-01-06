// hooks/useUpdatePcbOrderStatus.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { PcbOrder, PcbOrderResponse, PcbOrderStatus } from '@/types/pcb-order.type'

interface UpdateStatusData {
  status: PcbOrderStatus
  notes?: string
}

export const useUpdatePcbOrderStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      id, 
      ...data 
    }: UpdateStatusData & { id: number }): Promise<PcbOrder> => {
      const res = await api.put<PcbOrderResponse>(`/pcb-orders/${id}/status`, data)
      
      if (!res.data.success || !res.data.data) {
        throw new Error(res.data.error || 'Cập nhật trạng thái thất bại')
      }

      return res.data.data
    },
    onSuccess: (data, variables) => {
      // Cập nhật cache
      queryClient.invalidateQueries({ queryKey: ['pcb-orders'] })
      queryClient.invalidateQueries({ queryKey: ['pcb-order-statistics'] })
      queryClient.setQueryData(['pcb-order', variables.id], data)
      queryClient.setQueryData(['pcb-order-by-id', data.pcbOrderId], data)
      
    },

  })
  
}