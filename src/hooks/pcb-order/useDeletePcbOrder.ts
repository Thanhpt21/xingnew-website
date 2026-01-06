// hooks/useDeletePcbOrder.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useDeletePcbOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number): Promise<{ success: boolean }> => {
      const res = await api.delete(`/pcb-orders/${id}`)
      return res.data
    },
    onSuccess: (_, id) => {
      // Invalidate các query liên quan
      queryClient.invalidateQueries({ queryKey: ['pcb-orders'] })
      queryClient.invalidateQueries({ queryKey: ['pcb-order-statistics'] })
      queryClient.removeQueries({ queryKey: ['pcb-order', id] })
      
      // Xóa cache của orderId (nếu có)
      queryClient.invalidateQueries({ 
        queryKey: ['pcb-order-by-id'],
        predicate: (query) => {
          const queryKey = query.queryKey
          return queryKey[0] === 'pcb-order-by-id'
        }
      })
    },
  })
}