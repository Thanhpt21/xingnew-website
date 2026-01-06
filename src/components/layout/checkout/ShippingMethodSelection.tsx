'use client'

import React, { useState, useEffect } from 'react'
import { Button, Typography, Spin, Row, Col } from 'antd'
import useShippingMethod from '@/stores/shippingMethodStore'
import Image from 'next/image'
import { useCalculateGHTKFee } from '@/hooks/ghtk/useCalculateGHTKFee'
import { CalculateFeeDto, GHTKRawFeeResponse } from '@/types/ghtk.type'

const { Title, Text } = Typography

interface ShippingMethodSelectionProps {
  onMethodSelected: (methodId: number | null, fee: number | null) => void
  deliveryProvince: string
  deliveryDistrict: string
  deliveryWard?: string | null
  deliveryAddress?: string | null
  totalWeight: number
  totalValue: number
  pickProvince: string
  pickDistrict: string
  pickWard?: string | null
  pickAddress: string
}

const ShippingMethodSelection: React.FC<ShippingMethodSelectionProps> = ({
  onMethodSelected,
  deliveryProvince,
  deliveryDistrict,
  deliveryWard,
  deliveryAddress,
  totalWeight,
  totalValue,
  pickProvince,
  pickDistrict,
  pickWard,
  pickAddress,
}) => {
  const { selectedShippingMethod, setSelectedShippingMethod, setShippingFee } =
    useShippingMethod()

  const STANDARD_DELIVERY_ID = 0
  const XTEAM_DELIVERY_ID = 1

  const [localSelectedMethod, setLocalSelectedMethod] = useState<string>('standard')
  const [actualCalculatedFee, setActualCalculatedFee] = useState<number | null>(null)

  const {
    mutate: calculateFee,
    isPending: isCalculatingFee,
    data: ghtkFeeResponse,
    error: ghtkError,
  } = useCalculateGHTKFee()


  // Khởi tạo method mặc định
  useEffect(() => {
    if (selectedShippingMethod !== 'standard') {
      setSelectedShippingMethod('standard')
    }
    setLocalSelectedMethod('standard')
  }, [setSelectedShippingMethod]) // Thêm dependency

  // Effect tính phí GHTK - trigger khi thay đổi địa chỉ hoặc phương thức
  useEffect(() => {
    const isValidForCalculation =
      deliveryProvince &&
      deliveryDistrict &&
      deliveryWard &&
      pickProvince &&
      pickDistrict &&
      pickWard &&
      totalWeight > 0

    if (!isValidForCalculation) {
      setActualCalculatedFee(null)
      setShippingFee(null)
      onMethodSelected(null, null)
      return
    }

    // ✅ Kiểm tra giới hạn giá trị cho giao hàng nhanh (xteam)
    if (localSelectedMethod === 'xteam') {
      if (totalValue < 1 || totalValue > 20000000) {
        console.warn('⚠️ Giao hàng nhanh yêu cầu giá trị đơn hàng từ 1đ - 20,000,000đ')
        setActualCalculatedFee(null)
        setShippingFee(null)
        onMethodSelected(null, null)
        return
      }
    }

    const currentPayload: CalculateFeeDto = {
      pick_province: pickProvince,
      pick_district: pickDistrict,
      pick_ward: pickWard || '', // Đảm bảo không có undefined
      pick_address: pickAddress,
      province: deliveryProvince,
      district: deliveryDistrict,
      ward: deliveryWard || '', // Đảm bảo không có undefined
      address: deliveryAddress || '',
      weight: totalWeight,
      value: totalValue,
      deliver_option: localSelectedMethod === 'xteam' ? 'xteam' : 'none',
      transport: 'road',
    }

    calculateFee(currentPayload, {
      onSuccess: (response: GHTKRawFeeResponse) => {
        if (response.success && response.fee?.success && typeof response.fee?.fee?.fee === 'number') {
          const feeValue = response.fee.fee.fee
          setActualCalculatedFee(feeValue)
          setShippingFee(feeValue)
          
          const methodId = localSelectedMethod === 'xteam' ? XTEAM_DELIVERY_ID : STANDARD_DELIVERY_ID
          onMethodSelected(methodId, feeValue)
        } else {
          setActualCalculatedFee(null)
          setShippingFee(null)
          onMethodSelected(null, null)
        }
      },
      onError: (error: any) => {
        console.error('❌ Fee calculation error:', error)
        setActualCalculatedFee(null)
        setShippingFee(null)
        onMethodSelected(null, null)
      },
    })
  }, [
    deliveryProvince,
    deliveryDistrict,
    deliveryWard,
    deliveryAddress,
    totalWeight,
    totalValue,
    pickProvince,
    pickDistrict,
    pickWard,
    pickAddress,
    localSelectedMethod,
    calculateFee,
    setShippingFee,
    onMethodSelected,
  ]) // Thêm tất cả dependencies

  const handleSelectMethod = (method: string) => {
    setSelectedShippingMethod(method)
    setLocalSelectedMethod(method)
  }

  return (
    <div>

      {/* Chọn phương thức giao hàng */}
      <div className="mb-4">
        <Row gutter={16} justify="start">
          {/* Giao hàng tiết kiệm */}
          <Col xs={24} sm={12} className="mb-3">
            <Button
              type={localSelectedMethod === 'standard' ? 'primary' : 'default'}
              onClick={() => handleSelectMethod('standard')}
              disabled={isCalculatingFee}
              block
            >
              Giao hàng tiết kiệm
            </Button>
          </Col>

          {/* Giao hàng nhanh (Xteam) */}
          {/* <Col xs={24} sm={12}>
            <Button
              type={localSelectedMethod === 'xteam' ? 'primary' : 'default'}
              onClick={() => handleSelectMethod('xteam')}
              disabled={isCalculatingFee}
              block
            >
              Giao hàng nhanh (Xteam)
            </Button>
          </Col> */}
        </Row>
      </div>

      {/* Hiển thị phí giao hàng */}
      {localSelectedMethod && (
        <div className="mb-4">
          <Text strong>
            Phí giao hàng {localSelectedMethod === 'xteam' ? 'nhanh' : 'tiết kiệm'}:
          </Text>
          {isCalculatingFee ? (
            <div className="inline-flex items-center ml-2">
              <Spin size="small" className="mr-2" />
              <Text type="warning">Đang tính phí...</Text>
            </div>
          ) : actualCalculatedFee !== null ? (
            <Text className="ml-2">
              {actualCalculatedFee.toLocaleString('vi-VN')} VNĐ
            </Text>
          ) : (
            <div>
              <Text type="danger" className="block">
                Không thể tính phí (vui lòng kiểm tra địa chỉ giao hàng)
              </Text>
              {/* ✅ Hiển thị lý do lỗi cho giao hàng nhanh */}
              {localSelectedMethod === 'xteam' && (totalValue < 1 || totalValue > 20000000) && (
                <Text type="warning" className="text-sm block mt-1">
                  Giao hàng nhanh yêu cầu giá trị đơn hàng từ 1đ - 20,000,000đ. 
                  Giá trị hiện tại: {totalValue.toLocaleString('vi-VN')}đ
                </Text>
              )}
            </div>
          )}

          <br />
          <Text type="secondary" className="text-sm">
            {localSelectedMethod === 'xteam' 
              ? 'Thời gian giao hàng nhanh: Trong ngày.' 
              : 'Thời gian giao hàng tiết kiệm: 3-7 ngày làm việc.'}
          </Text>

          <div className="mt-4 flex flex-wrap gap-3 items-center">
            <Text strong>Được hỗ trợ bởi:</Text>
            <div className="relative w-24 h-8">
              <Image
                src="/image/ghtk.png"
                alt="Giao Hàng Tiết Kiệm"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {ghtkError && (
        <Text type="danger" className="text-sm block mt-2">
          Lỗi: {ghtkError.message || 'Không thể tính phí vận chuyển.'}
        </Text>
      )}
    </div>
  )
}

export default ShippingMethodSelection