import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { message } from 'antd';

interface CartItemToMerge {
  productId?: number;
  productVariantId?: number;
  quantity: number;
  priceAtAdd?: number;
}

interface MergeCartDto {
  items: CartItemToMerge[];
}

export const useMergeCart = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, MergeCartDto>({
    mutationFn: async (dto: MergeCartDto) => {
      const { data } = await axios.post('/api/cart/merge', dto);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['my-cart'] });
      message.success('Đã đồng bộ giỏ hàng');
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'Đồng bộ giỏ hàng thất bại');
    }
  });
};