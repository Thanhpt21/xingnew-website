import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { message } from 'antd';

interface AddCartItemDto {
  productId?: number;
  variantId?: number;
  quantity: number;
  price?: number;
}

interface AddCartItemResponse {
  success: boolean;
  message: string;
  data: any;
}

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation<AddCartItemResponse, Error, AddCartItemDto>({
    mutationFn: async (dto: AddCartItemDto) => {
      const { data } = await axios.post('/api/cart/items', {
        productId: dto.productId,
        productVariantId: dto.variantId,
        quantity: dto.quantity,
        price: dto.price
      });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['my-cart'] });
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'Thêm vào giỏ hàng thất bại');
    }
  });
};