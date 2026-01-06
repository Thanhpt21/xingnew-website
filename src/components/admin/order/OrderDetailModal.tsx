'use client';

import { Modal, Typography, Table, Image, Skeleton, Tag, Row, Col } from 'antd';
import { useOrderOne } from '@/hooks/order/useOrderOne';
import { useProductOne } from '@/hooks/product/useProductOne';
import { useShippingAddressOne } from '@/hooks/shipping-address/useShippingAddressOne';
import { formatDate, formatVND } from '@/utils/helpers';
import { Order, OrderItem } from '@/types/order.type';
import { getImageUrl } from '@/utils/getImageUrl';
import { useAllAttributes } from '@/hooks/attribute/useAllAttributes';
import { useAttributeValues } from '@/hooks/attribute-value/useAttributeValues';
import { GiftProductDisplay } from '@/components/layout/common/GiftProductDisplay';
import { useMemo } from 'react';

interface OrderDetailModalProps {
  open: boolean;
  onClose: () => void;
  orderId?: number;
}

const { Title, Text } = Typography;

// Component để hiển thị thông tin sản phẩm với product hook
const ProductItemWithDetails: React.FC<{ item: OrderItem }> = ({ item }) => {
  const productId = item.productVariant?.product?.id || item.productId;
  const { data: productData, isLoading: productLoading } = useProductOne(productId || 0);
  
  const { data: allAttributes } = useAllAttributes();
  const { data: allAttributeValues } = useAttributeValues();

  // Tạo map cho thuộc tính
  const attributeMap = useMemo(() => {
    return allAttributes?.reduce((acc: Record<number, string>, attr: any) => {
      acc[attr.id] = attr.name;
      return acc;
    }, {} as Record<number, string>) ?? {};
  }, [allAttributes]);

  const attributeValueMap = useMemo(() => {
    return allAttributeValues?.data?.reduce((acc: Record<number, string>, val: any) => {
      acc[val.id] = val.value;
      return acc;
    }, {} as Record<number, string>) ?? {};
  }, [allAttributeValues]);

  // Render attributes
  const renderAttributes = (attrValues: Record<string, any>) => {
    if (!attrValues || Object.keys(attrValues).length === 0) return 'Không có thuộc tính';
    return Object.entries(attrValues)
      .map(([attrId, valueId]) => {
        const attrName = attributeMap[Number(attrId)] || `Thuộc tính ${attrId}`;
        const valueName = attributeValueMap[Number(valueId)] || valueId;
        return `${attrName}: ${valueName}`;
      })
      .join(' | ');
  };

  // Get product info từ productData hoặc từ item
  const getProductInfo = () => {
    if (productLoading) return { name: 'Đang tải...', thumb: null, attributes: '' };
    
    // Ưu tiên từ productData nếu có
    if (productData) {
      return {
        name: productData.name || 'Sản phẩm',
        thumb: productData.thumb,
        attributes: renderAttributes(item.productVariant?.attrValues || {}),
      };
    }
    
    // Fallback từ item
    return {
      name: item.productVariant?.product?.name || item.productVariant?.sku || 'Sản phẩm',
      thumb: item.productVariant?.thumb || item.productVariant?.product?.thumb,
      attributes: renderAttributes(item.productVariant?.attrValues || {}),
    };
  };

  const productInfo = getProductInfo();
  const imageUrl = getImageUrl(productInfo.thumb);

  if (productLoading) {
    return (
      <div className="flex items-center gap-4">
        <Skeleton.Image active style={{ width: 50, height: 50 }} />
        <div className="flex-1">
          <Skeleton active paragraph={{ rows: 2 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0">
        {imageUrl ? (
          <Image
            preview={false}
            src={imageUrl}
            alt={productInfo.name}
            width={50}
            height={50}
            className="object-cover rounded"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 mb-1">
          {productInfo.name}
        </div>
        {item.productVariant?.sku && (
          <div className="text-xs text-gray-500 mb-1">
            SKU: {item.productVariant.sku}
          </div>
        )}
        {productInfo.attributes && productInfo.attributes !== 'Không có thuộc tính' && (
          <div className="text-xs text-gray-600 mb-2">
            {productInfo.attributes}
          </div>
        )}
        
        {/* Hiển thị quà tặng */}
        {item.giftProductId && item.giftQuantity && (
          <div className="mt-2">
            <GiftProductDisplay 
              giftProductId={item.giftProductId}
              giftQuantity={item.giftQuantity}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Component hiển thị địa chỉ giao hàng
const ShippingAddressDisplay: React.FC<{ 
  address: any; 
  isLoading: boolean 
}> = ({ address, isLoading }) => {
  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 3 }} />;
  }

  if (!address) {
    return <Text type="secondary">Không có thông tin địa chỉ</Text>;
  }

  // Lấy tên từ province, district, ward hoặc province_name, district_name, ward_name
  const provinceName = address.province_name || address.province || '';
  const districtName = address.district_name || address.district || '';
  const wardName = address.ward_name || address.ward || '';

  return (
    <div className="space-y-1">
      <div className="font-medium">{address.name}</div>
      <div className="text-gray-600">{address.phone}</div>
      <div className="text-gray-600">{address.address}</div>
      <div className="text-gray-600">
        {wardName && `${wardName}, `}
        {districtName && `${districtName}, `}
        {provinceName}
      </div>
      {address.is_default && (
        <Tag color="blue" className="mt-1">Địa chỉ mặc định</Tag>
      )}
      {address.note && (
        <div className="mt-2">
          <Text type="secondary">Ghi chú: {address.note}</Text>
        </div>
      )}
    </div>
  );
};

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ open, onClose, orderId }) => {
  const { data: order, isLoading, isError, error } = useOrderOne(orderId);
  
  // Lấy shipping address details
  const shippingAddressId = order?.shippingAddressId;
  const { 
    data: shippingAddress, 
    isLoading: loadingShippingAddress 
  } = useShippingAddressOne(shippingAddressId || 0);

  // Loading state
  if (isLoading) {
    return (
      <Modal open={open} title="Chi tiết đơn hàng" onCancel={onClose} footer={null} width={1200}>
        <div className="space-y-6">
          <Skeleton active paragraph={{ rows: 4 }} />
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      </Modal>
    );
  }

  if (isError) {
    console.error('Lỗi khi tải chi tiết đơn hàng:', error);
    return (
      <Modal open={open} title="Chi tiết đơn hàng" onCancel={onClose} footer={null}>
        <div className="text-center py-8">
          <div className="text-red-500 font-medium mb-2">Đã xảy ra lỗi khi tải chi tiết đơn hàng.</div>
          <Text type="secondary">Vui lòng thử lại sau.</Text>
        </div>
      </Modal>
    );
  }

  if (!order) return null;

  // Status config
  const getStatusConfig = (status: string) => {
    const configs: Record<string, { text: string; color: string }> = {
      "DRAFT": { text: "Đang soạn đơn", color: "gray" },
      "PENDING": { text: "Đang chờ xử lý", color: "orange" },
      "PAID": { text: "Đã thanh toán", color: "blue" },
      "SHIPPED": { text: "Đang giao hàng", color: "purple" },
      "DELIVERED": { text: "Đã giao hàng", color: "green" },
    };
    return configs[status] || { text: status, color: "default" };
  };

  const statusConfig = getStatusConfig(order.status);
  const paymentStatusConfig = getStatusConfig(order.paymentStatus);

  // Thông tin đơn hàng
  const orderInfoData = [
    { 
      key: '1', 
      label: 'Trạng thái đơn hàng', 
      value: <Tag color={statusConfig.color}>{statusConfig.text}</Tag> 
    },
    { 
      key: '3', 
      label: 'Mã đơn hàng', 
      value: <Text strong>#{order.id}</Text> 
    },
    { 
      key: '4', 
      label: 'Ngày tạo đơn hàng', 
      value: formatDate(order.createdAt) 
    },
    { 
      key: '5', 
      label: 'Email người đặt', 
      value: order.user?.email || '-' 
    },
    { 
      key: '6', 
      label: 'Phương thức thanh toán', 
      value: order.paymentMethod?.name || 'Thanh toán khi nhận hàng (COD)' 
    },
    { 
      key: '7', 
      label: 'Phương thức giao hàng', 
      value: order.deliveryMethod === 'XTEAM' ? 'Giao hàng nhanh' : 'Giao hàng tiết kiệm' 
    },
  ];

  // Thông tin thanh toán
  const paymentInfoData = [
    { 
      key: '1', 
      label: 'Tổng tiền hàng', 
      value: formatVND(order.totalAmount - (order.shippingFee || 0)) 
    },
    { 
      key: '2', 
      label: 'Phí vận chuyển', 
      value: formatVND(order.shippingFee || 0) 
    },
    { 
      key: '3', 
      label: 'Tổng thanh toán', 
      value: <Text strong type="success">{formatVND(order.totalAmount)}</Text> 
    },
  ];

  // Columns cho bảng sản phẩm
  const productColumns = [
    {
      title: 'Sản phẩm',
      key: 'product',
      width: '50%',
      render: (_text: any, item: OrderItem) => (
        <ProductItemWithDetails item={item} />
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: '15%',
      align: 'center' as const,
    },
    {
      title: 'Đơn giá',
      key: 'unitPrice',
      width: '15%',
      align: 'right' as const,
      render: (_text: any, item: OrderItem) => formatVND(item.unitPrice),
    },
    {
      title: 'Thành tiền',
      key: 'totalPrice',
      width: '20%',
      align: 'right' as const,
      render: (_text: any, item: OrderItem) => (
        <Text strong>{formatVND(item.unitPrice * item.quantity)}</Text>
      ),
    },
  ];

  // Tính tổng tiền sản phẩm
  const totalProductAmount = order.items?.reduce(
    (sum, item) => sum + (item.unitPrice * item.quantity), 
    0
  ) || 0;

  return (
    <Modal
      open={open}
      title={`Đơn hàng #${order.id}`}
      onCancel={onClose}
      footer={null}
      width={1200}
      className="order-detail-modal"
    >
      <div className="space-y-6">
        {/* Layout 2 cột cho thông tin chung */}
        <Row gutter={16}>
          {/* Cột trái: Thông tin đơn hàng */}
          <Col span={12}>
            <div className="bg-gray-50 p-4 rounded-lg">
              <Title level={5} className="mb-4">Thông tin đơn hàng</Title>
              <div className="space-y-3">
                {orderInfoData.map((info) => (
                  <div key={info.key} className="flex justify-between">
                    <span className="text-gray-600 font-medium">{info.label}:</span>
                    <span>{info.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Col>

          {/* Cột phải: Địa chỉ giao hàng */}
          <Col span={12}>
            <div className="bg-gray-50 p-4 rounded-lg">
              <Title level={5} className="mb-4">Địa chỉ giao hàng</Title>
              <ShippingAddressDisplay 
                address={shippingAddress} 
                isLoading={loadingShippingAddress} 
              />
            </div>
          </Col>
        </Row>

        {/* Danh sách sản phẩm */}
        <div>
          <Title level={5} className="mb-4">Danh sách sản phẩm</Title>
          <Table
            dataSource={order.items as OrderItem[]}
            columns={productColumns}
            pagination={false}
            rowKey="id"
            size="middle"
            className="product-table"
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={3} align="right">
                    <Text strong>Tổng tiền sản phẩm:</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="right">
                    <Text strong>{formatVND(totalProductAmount)}</Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
        </div>

        {/* Tóm tắt thanh toán */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <Title level={5} className="mb-4">Tóm tắt thanh toán</Title>
          <div className="space-y-3">
            {paymentInfoData.map((info) => (
              <div key={info.key} className="flex justify-between items-center">
                <span className="text-gray-700">{info.label}:</span>
                <span className={info.key === '3' ? 'text-xl font-bold text-blue-600' : 'font-medium'}>
                  {info.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .order-detail-modal :global(.ant-modal-body) {
          max-height: 70vh;
          overflow-y: auto;
        }
        .product-table :global(.ant-table-thead > tr > th) {
          background-color: #f8f9fa;
          font-weight: 600;
        }
        .product-table :global(.ant-table-tbody > tr:hover > td) {
          background-color: #f8fafc;
        }
      `}</style>
    </Modal>
  );
};

export default OrderDetailModal;