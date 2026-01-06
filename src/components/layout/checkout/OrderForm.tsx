'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { Button, message, Modal, Result, Checkbox, Card, Skeleton } from 'antd'
import { CheckCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import { CreateOrderDto, OrderItemDto } from '@/types/order.type'
import { ShippingAddress } from '@/types/shipping-address.type'
import Link from 'next/link'
import { DeliveryMethod } from '@/enums/order.enums'
import { useAuth } from '@/context/AuthContext'
import { useShippingAddressesByUserId } from '@/hooks/shipping-address/useShippingAddressesByUserId'
import { useCartStore } from '@/stores/cartStore'
import { getImageUrl } from '@/utils/getImageUrl'
import { formatVND } from '@/utils/helpers'
import { useAllAttributes } from '@/hooks/attribute/useAllAttributes'
import { useAttributeValues } from '@/hooks/attribute-value/useAttributeValues'
import dynamic from 'next/dynamic'
import { useCreateOrder } from '@/hooks/order/useCreateOrder'

// Mock data cho warehouses - Chỉ có 1 kho duy nhất
const warehouse = {
  id: 1,
  name: "Kho Hà Nội (Trung tâm)",
  phone: "024 1234 5678",
  location: {
    address: "123 Đường Láng, Phường Láng Thượng",
    ward_id: 101,
    ward_name: "Phường Láng Thượng",
    district_id: 1,
    district_name: "Quận Đống Đa",
    province_id: 1,
    province_name: "Hà Nội"
  }
}

// Dynamic imports
const PaymentMethodSelection = dynamic(() => import('./PaymentMethodSelection'), {
  loading: () => <Skeleton active paragraph={{ rows: 3 }} />
})

const ShippingMethodSelection = dynamic(() => import('./ShippingMethodSelection'), {
  loading: () => <Skeleton active paragraph={{ rows: 3 }} />
})

const ShippingAddressSelection = dynamic(() => import('./ShippingAddressSelection'), {
  loading: () => <Skeleton active paragraph={{ rows: 3 }} />
})

// Simple Cart Item component
interface SimpleCartItemProps {
  item: any
  isSelected: boolean
  onToggle: () => void
  renderAttributes: (attrs: Record<string, any>) => string
}

const SimpleCartItem: React.FC<SimpleCartItemProps> = ({ 
  item, 
  isSelected, 
  onToggle,
  renderAttributes 
}) => {
  const getProductName = () => {
    if (item.product?.name) return item.product.name;
    if (item.variant?.product?.name) return item.variant.product.name;
    return 'Sản phẩm';
  };

  const getProductThumb = () => {
    if (item.variant?.thumb) return item.variant.thumb;
    if (item.product?.thumb) return item.product.thumb;
    if (item.variant?.product?.thumb) return item.variant.product.thumb;
    return '';
  };

  const getFinalPrice = () => {
    return item.finalPrice || item.priceAtAdd || 0;
  };

  const getAttributes = () => {
    if (item.variant?.attrValues) {
      return item.variant.attrValues;
    }
    return null;
  };

  const thumb = getProductThumb();
  const thumbUrl = getImageUrl(thumb) || '/placeholder.png';
  const productName = getProductName();
  const finalPrice = getFinalPrice();
  const attributes = renderAttributes(getAttributes());

  return (
    <div className="flex gap-2 p-2 bg-gray-50 border rounded mb-2">
      <Checkbox
        checked={isSelected}
        onChange={onToggle}
        className="mt-1"
      />
      
      <img
        src={thumbUrl}
        alt={productName}
        className="w-16 h-16 object-cover rounded"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = '/placeholder.png';
        }}
      />
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm text-gray-900 mb-1">
          {productName}
        </h3>
        
        {attributes && attributes !== 'Không có thuộc tính' && (
          <p className="text-xs text-gray-500 mb-1">
            {attributes}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-blue-600 font-medium text-sm">
            {formatVND(finalPrice)}
          </span>
          <span className="text-gray-600 text-sm">x {item.quantity}</span>
        </div>
      </div>
    </div>
  )
}

// Component chính
const OrderForm: React.FC = () => {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [orderCompleted, setOrderCompleted] = useState(false)
  const [completedOrderId, setCompletedOrderId] = useState<number | null>(null)
  
  const { 
    items, 
    selectedItems, 
    toggleSelectItem, 
    selectAll,
    isSelectAll, 
    getSelectedTotal, 
    clearSelectedItems,
    removeItem
  } = useCartStore()

  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder()

  // Mặc định dùng kho duy nhất từ mock data
  const [pickInfo, setPickInfo] = useState({
    address: "",
    district_name: "",
    name: "",
    phone: "",
    province_name: "",
    ward_name: "",
  })

  const { currentUser } = useAuth()
  const userId = currentUser?.id
  
  const { data: shippingAddresses, isLoading: isLoadingShippingAddresses } = useShippingAddressesByUserId(
    userId || 0
  )

  const [paymentMethod, setPaymentMethod] = useState<any>(null)
  const [shippingFee, setShippingFee] = useState<number | null>(null)
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(DeliveryMethod.STANDARD)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [paymentUrl, setPaymentUrl] = useState('')
  
  const [selectedShippingAddressId, setSelectedShippingAddressId] = useState<number | null>(null)

  const { data: allAttributes } = useAllAttributes()
  const { data: allAttributeValues } = useAttributeValues()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Maps cho attributes
  const attributeMap = useMemo(() => {
    if (!allAttributes) return {}
    return allAttributes.reduce((acc: Record<number, string>, attr: any) => {
      acc[attr.id] = attr.name
      return acc
    }, {})
  }, [allAttributes])

  const attributeValueMap = useMemo(() => {
    if (!allAttributeValues?.data) return {}
    return allAttributeValues.data.reduce((acc: Record<number, string>, val: any) => {
      acc[val.id] = val.value
      return acc
    }, {})
  }, [allAttributeValues?.data])

  const renderAttributes = (attrValues: Record<string, any>) => {
    if (!attrValues || Object.keys(attrValues).length === 0) return 'Không có thuộc tính'
    
    return Object.entries(attrValues)
      .map(([attrId, valueId]) => {
        const attrName = attributeMap[Number(attrId)] || `Thuộc tính ${attrId}`
        const valueName = attributeValueMap[Number(valueId)] || valueId
        return `${attrName}: ${valueName}`
      })
      .join(', ')
  }

  // Tự động select items
  useEffect(() => {
    if (items.length > 0 && selectedItems.size === 0 && mounted) {
      const idsToSelect = items.slice(0, 10).map(i => i.id)
      selectAll(true, idsToSelect)
      
      if (items.length > 10) {
        message.info(`Đã chọn 10 sản phẩm đầu tiên`)
      }
    }
  }, [items, selectedItems.size, selectAll, mounted])

  // Tính toán
  const temporaryTotal = getSelectedTotal()
  const currentShippingFee = shippingFee || 0
  const finalTotal = temporaryTotal + currentShippingFee
  const isSelectAllDisabled = items.length > 10

  const totalWeight = useMemo(() => {
    return items
      .filter(item => selectedItems.has(item.id))
      .reduce((sum, item) => sum + (item.variant?.product?.weight || item.product?.weight || 0) * item.quantity, 0)
  }, [items, selectedItems])

  const totalValue = useMemo(() => {
    return items
      .filter(item => selectedItems.has(item.id))
      .reduce((sum, item) => sum + (item.finalPrice || item.priceAtAdd || 0) * item.quantity, 0)
  }, [items, selectedItems])

  // Auto select default shipping address
  useEffect(() => {
    if (shippingAddresses && shippingAddresses.length > 0) {
      const defaultAddress = shippingAddresses.find((address: ShippingAddress) => address.is_default)
      if (defaultAddress) {
        setSelectedShippingAddressId(defaultAddress.id)
      }
    }
  }, [shippingAddresses])

  // Get selected shipping address
  const selectedShippingAddress = useMemo(() => {
    return shippingAddresses?.find((addr: ShippingAddress) => addr.id === selectedShippingAddressId)
  }, [shippingAddresses, selectedShippingAddressId])

  // Thiết lập thông tin kho mặc định khi component mount
  useEffect(() => {
    if (warehouse?.location) {
      const location = warehouse.location
      setPickInfo({
        address: location.address || '',
        district_name: location.district_name || '',
        name: warehouse.name || '',
        phone: warehouse.phone || '',
        province_name: location.province_name || '',
        ward_name: location.ward_name || '',
      })
    }
  }, [])

  const handleSelectShippingMethod = (methodId: number | null, fee: number | null) => {
    setShippingFee(fee)
    setDeliveryMethod(methodId === 1 ? DeliveryMethod.XTEAM : DeliveryMethod.STANDARD)
  }

  const handleSelectShippingAddress = (selectedAddressId: number) => {
    setSelectedShippingAddressId(selectedAddressId)
  }

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      message.warning('Giỏ hàng trống.')
      return
    }

    if (!paymentMethod) {
      message.warning('Vui lòng chọn phương thức thanh toán.')
      return
    }

    if (shippingFee === null || shippingFee === undefined) {
      message.warning('Vui lòng chọn phương thức vận chuyển.')
      return
    }

    if (!selectedShippingAddressId) {
      message.warning('Vui lòng chọn địa chỉ giao hàng.')
      return
    }

    if (!currentUser) {
      message.warning('Vui lòng đăng nhập để đặt hàng.');
      router.push('/dang-nhap?redirect=/thanh-toan');
      return;
    }

    if (!paymentMethod?.id) {
      message.error('Phương thức thanh toán không hợp lệ.');
      return;
    }

    const selectedItemIds = Array.from(selectedItems);
    const validItems = items.filter(item => selectedItemIds.includes(item.id));
    
    if (validItems.length === 0) {
      message.error('Không có sản phẩm nào được chọn.');
      return;
    }

    const orderItems: OrderItemDto[] = validItems.map(item => {
      const promotion = item.product?.promotionProducts?.[0];
      
      if (!item.productId) {
        throw new Error('Cart item không hợp lệ');
      }
      
      return {
        productVariantId: item.productVariantId || undefined,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.finalPrice || item.priceAtAdd || 0,
        giftProductId: promotion?.giftProductId || null,
        giftQuantity: promotion?.giftQuantity || 0,
      }
    });

    const invalidPriceItems = orderItems.filter(item => !item.unitPrice || item.unitPrice <= 0);
    if (invalidPriceItems.length > 0) {
      message.error('Có sản phẩm không có giá hợp lệ.');
      return;
    }

    const invalidItems = orderItems.filter(item => !item.productId);
    if (invalidItems.length > 0) {
      message.error('Có sản phẩm không hợp lệ.');
      return;
    }

    const payload: CreateOrderDto = {
      items: orderItems,
      totalAmount: finalTotal,
      status: 'DRAFT',
      paymentStatus: 'PENDING',
      paymentMethodId: paymentMethod.id,
      shippingAddressId: selectedShippingAddressId || undefined,
      shippingFee: shippingFee || undefined,
      deliveryMethod: deliveryMethod,
    }

    createOrder(payload, {
      onSuccess: (response) => {
        let orderId: number;
        let totalAmount: number;
        
        if (response && response.id) {
          orderId = response.id;
          totalAmount = response.totalAmount;
        } else {
          message.error('Không nhận được thông tin đơn hàng');
          return;
        }
        
        message.success('Đặt hàng thành công!');

        validItems.forEach(item => {
          removeItem(item.id);
        });
        
        clearSelectedItems();

        if (paymentMethod.code === 'VNPAY') {
          try {
            const returnUrl = `${window.location.origin}/payment-callback`;
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
            
            const paymentUrl = `${baseUrl}/payments/vnpay?orderId=${orderId}&amount=${totalAmount}&returnUrl=${encodeURIComponent(returnUrl)}`;
            
            const paymentWindow = window.open(paymentUrl, '_blank');
            if (!paymentWindow) {
              window.location.href = paymentUrl;
            }
          } catch (error: any) {
            message.error('Lỗi thanh toán VNPay');
          }
        } else {
          setCompletedOrderId(orderId);
          setOrderCompleted(true);
        }
      },
      onError: (error: any) => {
        message.error('Đặt hàng thất bại');
      },
    });
  };

  // Loading state
  if (!mounted || isLoadingShippingAddresses) {
    return (
      <div className="py-8">
        <div className="container mx-auto max-w-7xl px-4">
          <Skeleton active paragraph={{ rows: 1 }} className="mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-7 space-y-4">
              <Card>
                <Skeleton active paragraph={{ rows: 4 }} />
              </Card>
              <Card>
                <Skeleton active paragraph={{ rows: 4 }} />
              </Card>
              <Card>
                <Skeleton active paragraph={{ rows: 4 }} />
              </Card>
            </div>
            <div className="lg:col-span-5">
              <Card>
                <Skeleton active paragraph={{ rows: 8 }} />
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Order completed state
  if (orderCompleted) {
    return (
      <div className="py-12">
        <div className="container mx-auto max-w-2xl px-4">
          <Card>
            <Result
              status="success"
              title="Đặt hàng thành công!"
              subTitle={
                <div className="text-gray-600 mt-4">
                  <p>Mã đơn hàng: <span className="font-medium">#{completedOrderId}</span></p>
                  <p className="mt-2">Đơn hàng của bạn đang được xử lý.</p>
                </div>
              }
              extra={[
                <Button 
                  type="primary" 
                  key="orders" 
                  onClick={() => router.push('/tai-khoan?p=history')}
                  className="mb-2"
                >
                  Xem đơn hàng
                </Button>,
                <Button 
                  key="shop" 
                  onClick={() => router.push('/san-pham')}
                >
                  Tiếp tục mua sắm
                </Button>,
              ]}
            />
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Breadcrumb */}
        <div className="mb-6 text-gray-600 flex ">
          <Link href="/gio-hang" className="flex items-center gap-1 hover:text-blue-600">
            <ShoppingCartOutlined />
            <span>Giỏ hàng</span>
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium">Thanh toán</span>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Thanh toán
          </h1>
          <p className="text-gray-600">
            Hoàn tất đơn hàng của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-4">
            {/* Shipping Address */}
            <Card>
              <h3 className="font-bold mb-4">Địa chỉ giao hàng</h3>
              <ShippingAddressSelection
                shippingAddresses={shippingAddresses || []}
                onSelectAddress={handleSelectShippingAddress}
              />
            </Card>

            {/* Shipping Method */}
            <Card>
              <h3 className="font-bold mb-4">Phương thức vận chuyển</h3>
              <ShippingMethodSelection
                onMethodSelected={handleSelectShippingMethod}
                deliveryProvince={selectedShippingAddress?.province || ''}
                deliveryDistrict={selectedShippingAddress?.district || ''}
                deliveryWard={selectedShippingAddress?.ward || null}
                deliveryAddress={selectedShippingAddress?.address || null}
                totalWeight={totalWeight}
                totalValue={totalValue}
                pickProvince={pickInfo.province_name || ''}
                pickDistrict={pickInfo.district_name || ''}
                pickWard={pickInfo.ward_name || null}
                pickAddress={pickInfo.address || ''}
              />
            </Card>

            {/* Payment Method */}
            <Card>
              <h3 className="font-bold mb-4">Phương thức thanh toán</h3>
              <PaymentMethodSelection onMethodSelected={setPaymentMethod} />
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-4 border rounded">
              <h3 className="font-bold mb-4">Tóm tắt đơn hàng</h3>
              
              <div className="space-y-4">
                {/* Select All */}
                <div className="flex items-center">
                  <Checkbox
                    checked={isSelectAll()}
                    onChange={(e) => {
                      const checked = e.target.checked
                      if (checked && items.length > 10) {
                        message.warning('Chỉ được chọn tối đa 10 sản phẩm')
                        return
                      }
                      const ids = items.slice(0, 10).map(i => i.id)
                      selectAll(checked, ids)
                    }}
                    disabled={items.length > 10}
                  />
                  <span className="ml-2">Chọn tất cả</span>
                  {isSelectAllDisabled && (
                    <span className="ml-2 text-gray-500 text-sm">(Tối đa 10)</span>
                  )}
                </div>

                {/* Cart Items List */}
                <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                  {items.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">Giỏ hàng trống</div>
                  ) : (
                    items.slice(0, 10).map((item) => (
                      <SimpleCartItem
                        key={item.id}
                        item={item}
                        isSelected={selectedItems.has(item.id)}
                        onToggle={() => toggleSelectItem(item.id)}
                        renderAttributes={renderAttributes}
                      />
                    ))
                  )}
                </div>

                {/* Summary */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span className="font-medium">{formatVND(temporaryTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span className="font-medium">{formatVND(currentShippingFee)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-bold">Tổng cộng:</span>
                    <span className="text-xl text-blue-600 font-bold">
                      {formatVND(finalTotal)}
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={handlePlaceOrder}
                  loading={isCreatingOrder}
                  disabled={!selectedShippingAddressId || !paymentMethod || shippingFee === null || selectedItems.size === 0 || !currentUser}
                  className="mt-4"
                >
                  {`Đặt hàng (${selectedItems.size})`}
                </Button>
                
                {!currentUser && (
                  <div className="text-center text-red-500 text-sm mt-2">
                    Vui lòng đăng nhập để đặt hàng
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal VNPay */}
        <Modal
          title="Thanh toán VNPay"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width="80%"
        >
          <iframe
            src={paymentUrl}
            width="100%"
            height="500"
            title="VNPay Payment"
          />
        </Modal>
      </div>
    </div>
  )
}

export default OrderForm