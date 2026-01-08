'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { Button, message, Modal, Result, Checkbox, Card, Skeleton, Empty } from 'antd'
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
import { motion } from "framer-motion";
import { useCreateOrder } from '@/hooks/order/useCreateOrder'

// Mock data cho warehouses - Chỉ có 1 kho duy nhất
const warehouse = {
  id: 1,
  name: "Kho trung tâm",
  phone: "0948380880",
  location: {
    address: "Số 66, tờ bản đồ 34, ấp Thanh Hiệp",
    ward_id: 28021,
    ward_name: "Xã Thanh Phú",
    district_id: 803,
    district_name: "Huyện Bến Lức",
    province_id: 80,
    province_name: "Tỉnh Long An"
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
    <div className="flex gap-2 p-2 bg-gray-50 border border-gray-200 rounded mb-2">
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
          <span className="text-gray-800 font-medium text-sm">
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

  // Lấy danh sách sản phẩm đã được chọn
  const selectedCartItems = useMemo(() => {
    return items.filter(item => selectedItems.has(item.id))
  }, [items, selectedItems])

  // Tính toán dựa trên sản phẩm đã chọn
  const temporaryTotal = getSelectedTotal()
  const currentShippingFee = shippingFee || 0
  const finalTotal = temporaryTotal + currentShippingFee

  const totalWeight = useMemo(() => {
    return selectedCartItems.reduce((sum, item) => sum + (item.variant?.product?.weight || item.product?.weight || 0) * item.quantity, 0)
  }, [selectedCartItems])

  const totalValue = useMemo(() => {
    return selectedCartItems.reduce((sum, item) => sum + (item.finalPrice || item.priceAtAdd || 0) * item.quantity, 0)
  }, [selectedCartItems])

  // Kiểm tra nếu không có sản phẩm nào được chọn
  useEffect(() => {
    if (mounted && selectedCartItems.length === 0) {
      message.warning('Không có sản phẩm nào được chọn trong giỏ hàng')
      router.push('/gio-hang')
    }
  }, [mounted, selectedCartItems.length, router])

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
    if (selectedCartItems.length === 0) {
      message.warning('Không có sản phẩm nào được chọn.')
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

    const orderItems: OrderItemDto[] = selectedCartItems.map(item => {
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

        // Xóa các sản phẩm đã đặt hàng khỏi giỏ hàng
        selectedCartItems.forEach(item => {
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
        <div className="container mx-auto max-w-7xl">
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

  // Nếu không có sản phẩm nào được chọn
  if (selectedCartItems.length === 0) {
    return (
      <div className="py-12">
        <div className="container mx-auto max-w-2xl px-4">
          <Card>
            <Result
              status="warning"
              title="Không có sản phẩm nào được chọn"
              subTitle="Vui lòng quay lại giỏ hàng và chọn sản phẩm để đặt hàng"
              extra={[
                <Button 
                  type="primary" 
                  key="cart" 
                  onClick={() => router.push('/gio-hang')}
                  className="mb-2 bg-gray-800 hover:bg-gray-900 border-none"
                >
                  Quay lại giỏ hàng
                </Button>,
                <Button 
                  key="shop" 
                  onClick={() => router.push('/san-pham')}
                  className="border-gray-300 text-gray-800 hover:text-gray-900 hover:border-gray-800"
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
                  className="mb-2 bg-gray-800 hover:bg-gray-900 border-none"
                >
                  Xem đơn hàng
                </Button>,
                <Button 
                  key="shop" 
                  onClick={() => router.push('/san-pham')}
                  className="border-gray-300 text-gray-800 hover:text-gray-900 hover:border-gray-800"
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
    <div className="">
      <div className="container mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="border-b border-gray-200 bg-white/80 backdrop-blur-sm"
        >
          <div className="max-w-7xl mx-auto py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium transition-colors hover:underline">
                Trang chủ
              </Link>
              <span className="text-gray-400">/</span>
              <Link href="/gio-hang" className="text-gray-600 hover:text-gray-900 font-medium transition-colors hover:underline">
                Giỏ hàng
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-800 font-semibold">Đặt hàng</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-4">
            {/* Shipping Address */}
            <Card className="border border-gray-200">
              <h3 className="font-bold mb-4 text-gray-900">Địa chỉ giao hàng</h3>
              <ShippingAddressSelection
                shippingAddresses={shippingAddresses || []}
                onSelectAddress={handleSelectShippingAddress}
              />
            </Card>

            {/* Shipping Method */}
            <Card className="border border-gray-200">
              <h3 className="font-bold mb-4 text-gray-900">Phương thức vận chuyển</h3>
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
            <Card className="border border-gray-200">
              <h3 className="font-bold mb-4 text-gray-900">Phương thức thanh toán</h3>
              <PaymentMethodSelection onMethodSelected={setPaymentMethod} />
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-4 border border-gray-200 rounded">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900">Sản phẩm đã chọn</h3>
                <Button 
                  type="text" 
                  size="small" 
                  onClick={() => {
                    selectAll(false, selectedCartItems.map(item => item.id))
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  Bỏ chọn tất cả
                </Button>
              </div>
              
              <div className="space-y-4">
                {/* Cart Items List */}
                <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                  {selectedCartItems.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">Chưa có sản phẩm nào được chọn</div>
                  ) : (
                    selectedCartItems.map((item) => (
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
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số lượng sản phẩm:</span>
                    <span className="font-medium text-gray-900">{selectedCartItems.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng số lượng:</span>
                    <span className="font-medium text-gray-900">
                      {selectedCartItems.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span className="font-medium text-gray-900">{formatVND(temporaryTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span className="font-medium text-gray-900">{formatVND(currentShippingFee)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="font-bold text-gray-900">Tổng cộng:</span>
                    <span className="text-xl text-gray-900 font-bold">
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
                  className="mt-4 bg-gray-800 hover:bg-gray-900 border-none"
                >
                  {`Đặt hàng (${selectedItems.size} sản phẩm)`}
                </Button>
                
                {!currentUser && (
                  <div className="text-center text-red-600 text-sm mt-2">
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