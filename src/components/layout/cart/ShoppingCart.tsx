'use client';

import { Table, Button, InputNumber, Image, Modal, message, Checkbox, Empty, Card, Tag } from 'antd';
import { DeleteOutlined, HomeOutlined, MinusOutlined, PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';
import { useAllAttributes } from '@/hooks/attribute/useAllAttributes';
import { useAttributeValues } from '@/hooks/attribute-value/useAttributeValues';
import { getImageUrl } from '@/utils/getImageUrl';
import { formatVND } from '@/utils/helpers';
import { useCartStore } from '@/stores/cartStore';
import { CartItem } from '@/types/cart.type';

const ShoppingCart = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const {
    items,
    selectedItems,
    toggleSelectItem,
    selectAll,
    isSelectAll,
    getSelectedTotal,
    clearCart,
    removeItem,
    updateQuantity,
    getItemCount
  } = useCartStore();
  
  const { data: allAttributes } = useAllAttributes();
  const { data: allAttributeValues } = useAttributeValues();
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Helper functions
  const getProductName = (item: CartItem) => {
    return item.product?.name || item.variant?.product?.name || 'Sản phẩm không xác định';
  };

  const getProductThumb = (item: CartItem) => {
    if (item.variant?.thumb) return item.variant.thumb;
    if (item.product?.thumb) return item.product.thumb;
    if (item.variant?.product?.thumb) return item.variant.product.thumb;
    return '';
  };

  const getFinalPrice = (item: CartItem) => {
    return item.finalPrice || item.priceAtAdd || 0;
  };

  const getAttributes = (item: CartItem) => {
    if (item.variant?.attrValues) {
      return item.variant.attrValues;
    }
    return null;
  };

  const handleSelectAllChange = (checked: boolean) => {
    const itemIds = items.slice(0, 10).map(item => item.id);
    selectAll(checked, itemIds);
  };

  const handleClearCart = () => {
    clearCart();
    message.success('Đã xóa toàn bộ giỏ hàng');
  };

  // Xử lý xóa item
  const handleRemoveItem = (item: CartItem) => {
    removeItem(item.id);
    message.success('Đã xóa sản phẩm khỏi giỏ hàng');
  };

  // Xử lý thay đổi số lượng
  const onChangeQuantity = (value: number | null, item: CartItem) => {
    if (!value || value < 1 || value === item.quantity) return;
    
    updateQuantity(item.id, value);
  };

  // Đi tới thanh toán
  const handleCheckoutClick = () => {
    if (!currentUser) {
      setIsLoginModalVisible(true);
      return;
    }
    
    if (selectedItems.size === 0) {
      message.warning('Vui lòng chọn ít nhất một sản phẩm để đặt hàng');
      return;
    }
    
    router.push('/dat-hang');
  };

  // Hiển thị thuộc tính
  const renderAttributes = (attrValues: Record<string, any> | null) => {
    if (!attrValues || Object.keys(attrValues).length === 0) return '';
    return Object.entries(attrValues)
      .map(([attrId, valueId]) => {
        const attrName = attributeMap[Number(attrId)] || `ID: ${attrId}`;
        const valueName = attributeValueMap[Number(valueId)] || `ID: ${valueId}`;
        return `${attrName}: ${valueName}`;
      })
      .join(', ');
  };

  // Loading state
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-600 mx-auto"></div>
      </div>
    );
  }

  // Giỏ hàng trống
  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-6">
            <Link href="/" className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors">
              <HomeOutlined />
              <span>Trang chủ</span>
            </Link>
          </div>

          <Card className="border border-gray-200">
            <Empty
              description={
                <div className="py-8">
                  <p className="text-lg font-medium text-gray-700 mb-2">Giỏ hàng trống</p>
                  <p className="text-gray-500 mb-6">Hãy thêm sản phẩm vào giỏ hàng</p>
                  <Link href="/san-pham">
                    <Button type="primary" icon={<ShoppingCartOutlined />} className="bg-gray-800 hover:bg-gray-900 border-none">
                      Tiếp tục mua sắm
                    </Button>
                  </Link>
                </div>
              }
            />
          </Card>
        </div>
      </div>
    );
  }

  // Cột bảng (Desktop)
  const columns = [
    {
      title: (
        <Checkbox
          checked={isSelectAll()}
          onChange={(e) => handleSelectAllChange(e.target.checked)}
          disabled={items.length > 10}
        />
      ),
      key: 'checkbox',
      width: 50,
      render: (_: any, record: CartItem) => (
        <Checkbox
          checked={selectedItems.has(record.id)}
          onChange={() => toggleSelectItem(record.id)}
          disabled={items.length > 10 && !selectedItems.has(record.id)}
        />
      ),
    },
    {
      title: 'Sản phẩm',
      key: 'product',
      render: (_: any, record: CartItem) => {
        const thumb = getProductThumb(record);
        const productName = getProductName(record);
        const attributes = renderAttributes(getAttributes(record));
        
        return (
          <div className="flex items-center gap-4">
            <Image
              src={getImageUrl(thumb) || '/placeholder.png'}
              alt={productName}
              width={80}
              height={80}
              style={{ objectFit: 'cover' }}
              preview={false}
              fallback="/placeholder.png"
              className="flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="font-medium text-gray-900 mb-1">
                {productName}
              </div>
              {attributes && (
                <div className="text-sm text-gray-500 mb-1">
                  {attributes}
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Giá',
      key: 'price',
      width: 100,
      render: (_: any, record: CartItem) => {
        const finalPrice = getFinalPrice(record);
        return (
          <span className="font-medium text-gray-800">{formatVND(finalPrice)}</span>
        );
      },
    },
    {
      title: 'Số lượng',
      key: 'quantity',
      width: 140,
      render: (_: any, record: CartItem) => (
        <div className="flex items-center gap-2">
          <Button
            size="small"
            icon={<MinusOutlined />}
            disabled={record.quantity <= 1}
            onClick={() => onChangeQuantity(record.quantity - 1, record)}
            className="border border-gray-300"
          />
          <InputNumber
            min={1}
            value={record.quantity}
            onChange={(v) => typeof v === 'number' && onChangeQuantity(v, record)}
            className="w-14 text-center border border-gray-300"
            controls={false}
          />
          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={() => onChangeQuantity(record.quantity + 1, record)}
            className="border border-gray-300"
          />
        </div>
      ),
    },
    {
      title: 'Tổng',
      key: 'total',
      width: 100,
      render: (_: any, record: CartItem) => {
        const finalPrice = getFinalPrice(record);
        const total = finalPrice * record.quantity;
        return (
          <span className="font-medium text-gray-800">{formatVND(total)}</span>
        );
      },
    },
    {
      title: '',
      key: 'action',
      width: 50,
      render: (_: any, record: CartItem) => (
        <Button
          danger
          type="text"
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveItem(record)}
        />
      ),
    },
  ];

  return (
    <div className="py-6">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto pb-6 px-4">
          <div className="flex items-center gap-2 text-sm">
            <a href="/" className="text-gray-600 hover:text-gray-900 font-medium">
              Trang chủ
            </a>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">Giỏ hàng</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="my-2">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900">Giỏ hàng của bạn</h1>
            <Button 
              danger 
              onClick={handleClearCart}
              disabled={items.length === 0}
              size="small"
            >
              Xóa tất cả
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">{getItemCount()} sản phẩm</p>
            {!currentUser && (
              <p className="text-sm text-yellow-600">
                ⚠️ Giỏ hàng tạm thời
              </p>
            )}
          </div>
          {items.length > 10 && (
            <div className="mt-1 text-sm text-yellow-600">
              ⚠️ Chỉ hiển thị tối đa 10 sản phẩm
            </div>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <Table
            rowKey="id"
            dataSource={items.slice(0, 10)}
            columns={columns}
            pagination={false}
            className="border border-gray-200"
          />
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
            <Checkbox
              checked={isSelectAll()}
              onChange={(e) => handleSelectAllChange(e.target.checked)}
              disabled={items.length > 10}
            />
            <span className="text-sm font-medium text-gray-700">Chọn tất cả</span>
            {items.length > 10 && (
              <span className="text-xs text-yellow-600 ml-auto">(Tối đa 10)</span>
            )}
          </div>
          
          {items.slice(0, 10).map((item) => {
            const thumb = getProductThumb(item);
            const productName = getProductName(item);
            const finalPrice = getFinalPrice(item);
            const attributes = renderAttributes(getAttributes(item));
            
            return (
              <Card key={item.id} className="border border-gray-200">
                <div className="flex gap-3">
                  <Checkbox
                    checked={selectedItems.has(item.id)}
                    onChange={() => toggleSelectItem(item.id)}
                    disabled={items.length > 10 && !selectedItems.has(item.id)}
                    className="mt-1"
                  />
                  
                  <Image
                    src={getImageUrl(thumb) || '/placeholder.png'}
                    alt={productName}
                    width={70}
                    height={70}
                    style={{ objectFit: 'cover' }}
                    preview={false}
                    fallback="/placeholder.png"
                    className="flex-shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-gray-900 mb-1">
                      {productName}
                    </h3>
                    
                    {attributes && (
                      <p className="text-xs text-gray-500 mb-2">
                        {attributes}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-1 mb-2">
                      {!item.variant && (
                        <Tag color="default" className="text-xs bg-gray-100 text-gray-600">Sản phẩm đơn giản</Tag>
                      )}
                      {item.id < 0 && (
                        <Tag color="default" className="text-xs bg-yellow-100 text-yellow-800">Tạm thời</Tag>
                      )}
                    </div>
                    
                    <div className="space-y-1 text-sm mb-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Giá:</span>
                        <span className="font-medium text-gray-800">{formatVND(finalPrice)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Button
                          size="small"
                          icon={<MinusOutlined />}
                          disabled={item.quantity <= 1}
                          onClick={() => onChangeQuantity(item.quantity - 1, item)}
                          className="border border-gray-300"
                        />
                        <InputNumber
                          min={1}
                          value={item.quantity}
                          onChange={(v) => typeof v === 'number' && onChangeQuantity(v, item)}
                          className="w-10 text-center border border-gray-300"
                          size="small"
                          controls={false}
                        />
                        <Button
                          size="small"
                          icon={<PlusOutlined />}
                          onClick={() => onChangeQuantity(item.quantity + 1, item)}
                          className="border border-gray-300"
                        />
                      </div>
                      
                      <Button
                        danger
                        type="text"
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveItem(item)}
                      />
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                      <span className="text-gray-600">Tổng:</span>
                      <span className="text-gray-900 font-bold">
                        {formatVND(finalPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6">
          <div className="bg-white border border-gray-200 p-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="text-sm text-gray-600">
                Đã chọn: <span className="font-medium text-gray-900">{selectedItems.size}</span> sản phẩm
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="text-xl font-bold text-gray-900">
                  Tổng: {formatVND(getSelectedTotal())}
                </div>
                <Button
                  type="primary"
                  size="large"
                  onClick={handleCheckoutClick}
                  disabled={selectedItems.size === 0}
                  className="w-full md:w-auto bg-gray-800 hover:bg-gray-900 border-none"
                >
                  {currentUser ? 'Đặt hàng' : 'Thanh toán'} ({selectedItems.size})
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal đăng nhập */}
      <Modal
        title="Yêu cầu đăng nhập"
        open={isLoginModalVisible}
        onOk={() => router.push(`/dang-nhap?redirect=${encodeURIComponent('/gio-hang')}`)}
        onCancel={() => setIsLoginModalVisible(false)}
        okText="Đăng nhập"
        cancelText="Hủy"
        centered
        okButtonProps={{ className: 'bg-gray-800 hover:bg-gray-900 border-none' }}
      >
        <div className="py-4">
          <p className="text-gray-600 mb-3">Bạn cần đăng nhập để tiến hành thanh toán.</p>
        </div>
      </Modal>
    </div>
  );
};

export default ShoppingCart;