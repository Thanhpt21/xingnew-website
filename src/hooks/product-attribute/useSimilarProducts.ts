// hooks/product-attribute/useSimilarProducts.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

interface SimilarProductsParams {
  filters: Array<{attributeId: number, valueId: number}>;
  categoryId: number;
  excludeProductId?: number;
  enabled?: boolean;
}

export const useSimilarProducts = ({
  filters,
  categoryId,
  excludeProductId,
  enabled = true
}: SimilarProductsParams) => {
  return useQuery({
    queryKey: ['similar-products', JSON.stringify(filters), categoryId, excludeProductId],
    queryFn: async () => {
      console.log('useSimilarProducts - Calling API with:', { filters, categoryId, excludeProductId });
      
      // Không gọi API nếu không có filters hoặc categoryId
      if (!filters || filters.length === 0 || !categoryId) {
        console.log('useSimilarProducts - Skipping API call - no filters or categoryId');
        return { 
          success: true, 
          data: { count: 0, attributes: [] } 
        };
      }

      try {
        const res = await api.get('/product-attributes/similar/count', {
          params: {
            filters: JSON.stringify(filters),
            categoryId,
            excludeProductId
          }
        });
        
        console.log('useSimilarProducts - API response:', res.data);
        return res.data;
      } catch (error: any) {
        console.error('useSimilarProducts - API error:', error);
        throw error;
      }
    },
    enabled: enabled && filters.length > 0 && !!categoryId,
    staleTime: 1 * 60 * 1000, // 1 phút
    retry: 1,
  });
};