// hooks/pcb-order/useUserPcbOrders.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { 
  UserPcbOrdersResponse,
  UserPcbOrderQueryParams,
  DEFAULT_PCB_ORDER_QUERY 
} from '@/types/pcb-order.type';

/**
 * Hook để lấy danh sách đơn hàng PCB của một user cụ thể
 * @param userId - ID của user (bắt buộc)
 * @param params - Các query parameters tùy chọn
 */
export const useUserPcbOrders = (
  userId: number | undefined,
  params: UserPcbOrderQueryParams = {}
) => {
  const queryParams = { ...DEFAULT_PCB_ORDER_QUERY, ...params };
  
  return useQuery({
    queryKey: ['user-pcb-orders', userId, queryParams],
    queryFn: async (): Promise<UserPcbOrdersResponse> => {
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      const res = await api.get(`/pcb-orders/user/${userId}`, { 
        params: queryParams 
      });
      return res.data;
    },
    enabled: !!userId, // Chỉ chạy query khi có userId
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};