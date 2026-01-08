'use client'

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { usePaymentMethods } from '@/hooks/payment-method/usePaymentMethods'
import { PaymentMethod } from '@/types/payment-method.type'

interface PaymentMethodSelectionProps {
  onMethodSelected: (method: PaymentMethod) => void
}

// Payment method content components
const CodContent = () => (
  <div className="mt-4 p-4 bg-gray-50 border border-gray-300 rounded">
    <h4 className="font-semibold text-gray-800 mb-2">Thanh toán khi nhận hàng (COD)</h4>
    <p className="text-gray-600 text-sm">
      Thanh toán trực tiếp bằng tiền mặt hoặc chuyển khoản cho nhân viên giao hàng khi nhận sản phẩm.
    </p>
    <div className="mt-2 text-xs text-gray-500">Không tính phí thanh toán</div>
  </div>
)

const BankTransferContent = () => (
  <div className="mt-4 p-4 bg-gray-50 border border-gray-300 rounded">
    <h4 className="font-semibold text-gray-800 mb-2">Chuyển khoản ngân hàng</h4>
    <p className="text-gray-600 text-sm mb-3">
      Chuyển khoản trước khi đơn hàng được xử lý.
    </p>
    <div className="bg-white p-3 border border-gray-300 rounded text-sm">
      <div className="flex justify-between mb-1">
        <span className="text-gray-700">Ngân hàng:</span>
        <span className="font-medium text-gray-900">Vietcombank</span>
      </div>
      <div className="flex justify-between mb-1">
        <span className="text-gray-700">Số tài khoản:</span>
        <span className="font-mono font-medium text-gray-900">0011 0023 4567</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-700">Chủ tài khoản:</span>
        <span className="font-medium text-gray-900">CÔNG TY TNHH ABC</span>
      </div>
    </div>
  </div>
)

const VnpayContent = () => (
  <div className="mt-4 p-4 bg-gray-50 border border-gray-300 rounded">
    <h4 className="font-semibold text-gray-800 mb-2">Thanh toán qua VNPay</h4>
    <p className="text-gray-600 text-sm mb-3">
      Thanh toán an toàn qua cổng VNPay.
    </p>
    <div className="bg-white p-3 border border-gray-300 rounded">
      <div className="text-sm font-medium mb-1 text-gray-900">Các ngân hàng hỗ trợ</div>
      <div className="text-xs text-gray-500">Vietcombank, BIDV, Techcombank, Agribank</div>
    </div>
  </div>
)

// Main component
const PaymentMethodSelection: React.FC<PaymentMethodSelectionProps> = ({
  onMethodSelected,
}) => {
  const { data: paymentResponse, isLoading } = usePaymentMethods()
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const hasSelectedInitial = useRef(false)

  const paymentMethods = paymentResponse?.data || []

  // Tự động chọn COD làm mặc định
  useEffect(() => {
    if (!hasSelectedInitial.current && paymentMethods.length > 0) {
      const defaultMethod = paymentMethods.find((m: any) => m.code === 'COD') || paymentMethods[0]
      if (defaultMethod) {
        setSelectedMethod(defaultMethod)
        onMethodSelected(defaultMethod)
        hasSelectedInitial.current = true
      }
    }
  }, [paymentMethods, onMethodSelected])

  const handleSelectPaymentMethod = useCallback((method: PaymentMethod) => {
    setSelectedMethod(method)
    onMethodSelected(method)
  }, [onMethodSelected])

  // Render content based on selected method
  const renderSelectedContent = () => {
    if (!selectedMethod) return null
    
    switch (selectedMethod.code) {
      case 'COD':
        return <CodContent />
      case 'BANK_TRANSFER':
        return <BankTransferContent />
      case 'VNPAY':
        return <VnpayContent />
      default:
        return null
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Phương thức thanh toán</h3>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-10 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  // Empty state
  if (paymentMethods.length === 0) {
    return (
      <div className="bg-white">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Phương thức thanh toán</h3>
        <div className="text-center py-4">
          <p className="text-gray-600">Không có phương thức thanh toán khả dụng</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white text-gray-600">


      {/* Method Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
        {paymentMethods.map((method: PaymentMethod) => {
          const isSelected = selectedMethod?.id === method.id
          
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => handleSelectPaymentMethod(method)}
              className={`
                p-3 rounded border transition-colors
                ${isSelected 
                  ? 'border-gray-800 bg-gray-50' 
                  : 'border-gray-300 hover:bg-gray-50 hover:border-gray-800'
                }
              `}
            >
              <div className="text-center">
                <div className={`text-sm font-medium mb-1 ${
                  isSelected ? 'text-gray-900' : 'text-gray-800'
                }`}>
                  {method.name}
                </div>
                <div className="text-xs text-gray-500">
                  {method.code === 'COD' && 'Thanh toán khi nhận hàng'}
                  {method.code === 'BANK_TRANSFER' && 'Chuyển khoản ngân hàng'}
                  {method.code === 'VNPAY' && 'Thanh toán trực tuyến'}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Selected Method Details */}
      {selectedMethod && (
        <div>
          <div className="mb-3">
            <span className="font-medium text-gray-800">Chi tiết phương thức thanh toán</span>
          </div>
          {renderSelectedContent()}
        </div>
      )}
    </div>
  )
}

export default PaymentMethodSelection