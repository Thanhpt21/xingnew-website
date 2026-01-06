// hooks/pcb-order/useCreatePcbOrder.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { 
  PcbOrder, 
  PcbOrderResponse, 
  PcbOrderFormData,
  validatePcbOrderFormData 
} from '@/types/pcb-order.type'

export const useCreatePcbOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: PcbOrderFormData): Promise<PcbOrder> => {
      // Validate form data
      const validationErrors = validatePcbOrderFormData(formData)
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '))
      }
      
      const formDataToSend = new FormData()
      
      // Thêm các trường dữ liệu vào formData
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'gerberFile' && value instanceof File) {
          formDataToSend.append('gerberFile', value)
        } else if (value !== undefined && value !== null && value !== '') {
          if (typeof value === 'object' && key !== 'gerberFile') {
            // Xử lý các object nested (pcbDetails, assemblyDetails, stencilDetails)
            formDataToSend.append(key, JSON.stringify(value))
          } else {
            formDataToSend.append(key, String(value))
          }
        }
      })

      console.log('📤 Sending PCB order data:', {
        userId: formData.userId,
        totalPrice: formData.totalPrice,
        finalTotal: formData.finalTotal,
        hasGerberFile: !!formData.gerberFile
      })

      const res = await api.post<PcbOrderResponse>('/pcb-orders', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (!res.data.success || !res.data.data) {
        throw new Error(res.data.message || 'Tạo đơn hàng thất bại')
      }

      return res.data.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pcb-orders'] })
      queryClient.invalidateQueries({ queryKey: ['pcb-order-statistics'] })
      queryClient.setQueryData(['pcb-order', data.id], data)
      queryClient.setQueryData(['pcb-order-by-id', data.pcbOrderId], data)
    },
    onError: (error: any) => {
      console.error('❌ Error creating PCB order:', error)
    }
  })
}