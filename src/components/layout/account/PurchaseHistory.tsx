'use client';

import React, { useState } from "react";
import { useCurrent } from "@/hooks/auth/useCurrent";
import { useOrdersByUser } from "@/hooks/order/useOrdersByUser";
import { useProductOne } from "@/hooks/product/useProductOne";
import { formatDate } from "@/utils/helpers";
import { Order, OrderItem } from "@/types/order.type";
import { getImageUrl } from "@/utils/getImageUrl";
import Link from "next/link";

const PurchaseHistory: React.FC = () => {
  const { data: currentUser } = useCurrent();
  const userId = currentUser?.id;
  const {
    data: ordersData,
    isLoading,
    isError,
  } = useOrdersByUser({ userId });
  const orders = ordersData?.data ?? [];

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { text: string; color: string }> = {
      "DRAFT": { text: "Đang soạn đơn", color: "bg-gray-100 text-gray-700" },
      "PENDING": { text: "Đang chờ xử lý", color: "bg-gray-200 text-gray-800" },
      "PAID": { text: "Đã thanh toán", color: "bg-gray-300 text-gray-800" },
      "SHIPPED": { text: "Đang giao hàng", color: "bg-gray-400 text-white" },
      "DELIVERED": { text: "Đã giao hàng", color: "bg-gray-600 text-white" },
    };
    return configs[status] || { text: "Chưa xác định", color: "bg-gray-100 text-gray-700" };
  };

  const formatCurrency = (amount: number | undefined) => {
    return (amount || 0).toLocaleString('vi-VN') + '₫';
  };

  const getProductImageUrl = (item: any, productData?: any) => {
    const thumb = item?.productVariant?.thumb || 
                  productData?.thumb || 
                  item?.productVariant?.product?.thumb;
    return thumb ? getImageUrl(thumb) : null;
  };

  const getProductName = (item: any, productData?: any) => {
    return item?.productVariant?.product?.name || 
           productData?.name || 
           item?.product?.name || 
           "Sản phẩm";
  };

  const ProductItem: React.FC<{ 
    item: any; 
  }> = ({ item }) => {
    const { data: productData } = useProductOne(item.productId || item.product?.id || 0);
    
    const imageUrl = getProductImageUrl(item, productData);
    const productName = getProductName(item, productData);
    const price = item.unitPrice || 0;
    const quantity = item.quantity || 1;
    const total = price * quantity;

    return (
      <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded mb-2 hover:bg-gray-50 transition-colors">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={productName}
            className="w-12 h-12 object-cover border border-gray-300"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.png';
            }}
          />
        ) : (
          <div className="w-12 h-12 bg-gray-100 border border-gray-300 flex items-center justify-center">
            <div className="text-gray-500 text-lg">📦</div>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900">
            {productName}
          </div>
          <div className="text-sm text-gray-600">
            {quantity} × {formatCurrency(price)}
          </div>
        </div>
        
        <div className="font-medium text-gray-800">
          {formatCurrency(total)}
        </div>
      </div>
    );
  };

  const OrderPreview: React.FC<{ order: Order }> = ({ order }) => {
    const statusConfig = getStatusConfig(order.status);
    const totalAmount = (order.totalAmount || 0) + (order.shippingFee || 0);
    const firstItem = order.items?.[0];
    const itemCount = order.items?.length || 0;

    const { data: firstProductData } = useProductOne(
      firstItem?.productId || firstItem?.product?.id || 0
    );

    const firstProductName = getProductName(firstItem, firstProductData);
    const firstProductImageUrl = getProductImageUrl(firstItem, firstProductData);

    return (
      <div className="bg-white border border-gray-300 p-4 mb-3 rounded shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-900">
                Đơn hàng #{order.id}
              </span>
              <span className={`px-2 py-1 text-xs rounded ${statusConfig.color}`}>
                {statusConfig.text}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {formatDate(order.createdAt)}
            </div>
          </div>
          
          <div className="font-bold text-gray-900">
            {formatCurrency(totalAmount)}
          </div>
        </div>

        <div className="mb-4">
          {firstItem && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded">
              {firstProductImageUrl ? (
                <img
                  src={firstProductImageUrl}
                  alt={firstProductName}
                  className="w-10 h-10 object-cover border border-gray-300"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-100 border border-gray-300 flex items-center justify-center">
                  <div className="text-gray-500">📦</div>
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {firstProductName}
                </div>
                <div className="text-sm text-gray-600">
                  {firstItem.quantity} × {formatCurrency(firstItem.unitPrice)}
                </div>
              </div>
            </div>
          )}
          
          {itemCount > 1 && (
            <div className="mt-2 text-sm text-gray-500 text-center">
              + {itemCount - 1} sản phẩm khác
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-3 border-t border-gray-200">
          <button
            onClick={() => {
              setSelectedOrder(order);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-gray-800 text-white font-medium rounded hover:bg-gray-900 transition-colors flex-1"
          >
            Xem chi tiết
          </button>
          
          {order.status === "DELIVERED" && firstItem && (
            <Link
              href={firstProductData?.slug ? `/san-pham/${firstProductData.slug}` : '/san-pham'}
              className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 hover:border-gray-400 transition-colors flex-1 text-center"
            >
              Đánh giá
            </Link>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-100 rounded animate-pulse border border-gray-200"></div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-8">
        <div className="text-center p-6 bg-gray-50 border border-gray-300 rounded">
          <div className="text-gray-800 font-medium mb-2">Lỗi khi tải đơn hàng</div>
          <p className="text-gray-600">Vui lòng thử lại sau.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Lịch sử mua hàng
        </h2>
        <p className="text-gray-600">
          Quản lý đơn hàng của bạn ({orders.length} đơn)
        </p>
      </div>

      {orders.length > 0 ? (
        <div>
          {orders.map((order) => (
            <OrderPreview key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 border border-gray-300 rounded">
          <div className="text-gray-500 text-4xl mb-4">📦</div>
          <p className="text-gray-800 font-medium mb-2">Chưa có đơn hàng nào</p>
          <p className="text-gray-600 mb-6">Bắt đầu mua sắm để xem lịch sử đơn hàng</p>
          <Link href="/san-pham" className="px-5 py-2.5 bg-gray-800 text-white font-medium rounded hover:bg-gray-900 transition-colors inline-block">
            Khám phá sản phẩm
          </Link>
        </div>
      )}

      {/* Order Detail Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-300 rounded w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="border-b border-gray-300 p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-lg">
                  Đơn hàng #{selectedOrder.id}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 text-sm rounded ${getStatusConfig(selectedOrder.status).color}`}>
                  {getStatusConfig(selectedOrder.status).text}
                </span>
                <span className="text-sm text-gray-600">
                  {formatDate(selectedOrder.createdAt)}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-5">
              <div>
                <h4 className="font-medium text-gray-900 mb-3 text-lg">Sản phẩm đã mua</h4>
                <div>
                  {selectedOrder.items?.map((item: OrderItem) => (
                    <ProductItem key={item.id} item={item} />
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 border border-gray-200 rounded">
                <div className="flex justify-between text-gray-700 mb-2">
                  <span>Tổng tiền hàng:</span>
                  <span className="font-medium">
                    {formatCurrency((selectedOrder.totalAmount || 0) - (selectedOrder.shippingFee || 0))}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700 mb-2">
                  <span>Phí vận chuyển:</span>
                  <span className="font-medium">{formatCurrency(selectedOrder.shippingFee)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-300 mt-2">
                  <span className="font-bold text-gray-900">Tổng thanh toán:</span>
                  <span className="font-bold text-xl text-gray-900">
                    {formatCurrency(selectedOrder.totalAmount || 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-300 p-5">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full px-4 py-3 bg-gray-800 text-white font-medium rounded hover:bg-gray-900 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;