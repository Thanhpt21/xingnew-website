// components/admin/pcb-order/UpdateQuotationModal.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  Button,
  message,
  Space,
  Typography,
  Divider,
  Alert,
} from 'antd';

import { PcbOrder } from '@/types/pcb-order.type';
import { formatVND } from '@/utils/helpers';
import { useUpdatePcbOrder } from '@/hooks/pcb-order/useUpdatePcbOrder';

const { Text, Title } = Typography;

interface UpdateQuotationModalProps {
  open: boolean;
  onClose: () => void;
  order: PcbOrder | null;
  onSuccess?: () => void;
}

export default function UpdateQuotationModal({
  open,
  onClose,
  order,
  onSuccess,
}: UpdateQuotationModalProps) {
  const [form] = Form.useForm();
  const [isFastDelivery, setIsFastDelivery] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const updatePcbOrder = useUpdatePcbOrder();

  // Reset form khi modal mở/đóng
  useEffect(() => {
    if (open && order) {
      const initialValues = {
        unitPrice: order.unitPrice,
        quantity: order.quantity,
        fastDelivery: order.fastDelivery,
        fastDeliveryFee: order.fastDeliveryFee || 0,
        notes: '',
      };
      
      form.setFieldsValue(initialValues);
      setIsFastDelivery(order.fastDelivery);
    } else {
      form.resetFields();
    }
  }, [open, order, form]);

  // Sử dụng useMemo để tính toán mà không gây re-render
  const calculatePrices = useMemo(() => {
    if (!order) return { totalPrice: 0, finalTotal: 0 };
    
    try {
      const values = form.getFieldsValue();
      const unitPrice = values.unitPrice || order.unitPrice || 0;
      const quantity = values.quantity || order.quantity || 0;
      const fastDelivery = values.fastDelivery || order.fastDelivery || false;
      const fastDeliveryFee = values.fastDeliveryFee || order.fastDeliveryFee || 0;
      
      const totalPrice = unitPrice * quantity;
      const finalTotal = totalPrice + (fastDelivery ? fastDeliveryFee : 0);
      
      return { totalPrice, finalTotal };
    } catch (error) {
      return { totalPrice: 0, finalTotal: 0 };
    }
  }, [order, form]);

  const handleSubmit = async (values: any) => {
    if (!order) return;

    try {
      setIsSubmitting(true);
      
      // Format dữ liệu trước khi gửi
      const updateData = {
        unitPrice: values.unitPrice,
        quantity: values.quantity,
        fastDelivery: values.fastDelivery,
        fastDeliveryFee: values.fastDeliveryFee || 0,
        notes: values.notes || `Báo giá đã cập nhật`,
      };

      await updatePcbOrder.mutateAsync({
        id: order.id,
        data: updateData,
      });

      message.success('Cập nhật báo giá thành công!');
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
      form.resetFields();
    } catch (error: any) {
      message.error(error.message || 'Cập nhật thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFastDeliveryChange = (checked: boolean) => {
    setIsFastDelivery(checked);
    form.setFieldValue('fastDelivery', checked);
    
    // Nếu tắt giao hàng nhanh, reset phí về 0
    if (!checked) {
      form.setFieldValue('fastDeliveryFee', 0);
    }
  };

  // Destructure từ useMemo
  const { totalPrice, finalTotal } = calculatePrices;

  return (
    <Modal
      title={
        <div>
          <Title level={4} className="!mb-1">
            Cập nhật báo giá
          </Title>
          <Text type="secondary">
            Đơn hàng: {order?.pcbOrderId}
          </Text>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      destroyOnClose
      afterClose={() => {
        form.resetFields();
        setIsFastDelivery(false);
      }}
    >
      {order && (
        <>
          <Alert
            message="Thông báo"
            description="Khi cập nhật báo giá, đơn hàng sẽ tự động chuyển sang trạng thái 'Đã gửi báo giá'"
            type="info"
            showIcon
            className="mb-4"
          />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            // KHÔNG gọi calculatePrices trực tiếp trong onValuesChange
          >
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Form.Item
                  label="Đơn giá (VND)"
                  name="unitPrice"
                  rules={[
                    { required: true, message: 'Vui lòng nhập đơn giá' },
                    { type: 'number', min: 1, message: 'Đơn giá phải lớn hơn 0' },
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    placeholder="Nhập đơn giá"
                  />
                </Form.Item>
              </div>

              <div>
                <Form.Item
                  label="Số lượng"
                  name="quantity"
                  rules={[
                    { required: true, message: 'Vui lòng nhập số lượng' },
                    { type: 'number', min: 1, message: 'Số lượng phải lớn hơn 0' },
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={1}
                    placeholder="Nhập số lượng"
                  />
                </Form.Item>
              </div>
            </div>

            <Divider />

            <Form.Item
              label="Giao hàng nhanh"
              name="fastDelivery"
              valuePropName="checked"
            >
              <Switch 
                checked={isFastDelivery}
                onChange={handleFastDeliveryChange}
                checkedChildren="Có" 
                unCheckedChildren="Không" 
              />
            </Form.Item>

            {isFastDelivery && (
              <Form.Item
                label="Phí giao hàng nhanh (VND)"
                name="fastDeliveryFee"
                rules={[
                  { required: isFastDelivery, message: 'Vui lòng nhập phí giao hàng nhanh' },
                  { type: 'number', min: 0, message: 'Phí không được âm' },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  placeholder="Nhập phí giao hàng nhanh"
                />
              </Form.Item>
            )}

            <Divider />

            {/* Preview tính toán - sử dụng values từ useMemo */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <Title level={5} className="!mb-3">Tính toán tự động</Title>
              <Space direction="vertical" size="small" className="w-full">
                <div className="flex justify-between">
                  <Text>Tổng tiền hàng:</Text>
                  <Text strong>{formatVND(totalPrice)}</Text>
                </div>
                {isFastDelivery && (
                  <div className="flex justify-between">
                    <Text>Phí giao hàng nhanh:</Text>
                    <Text type="secondary">
                      {formatVND(form.getFieldValue('fastDeliveryFee') || 0)}
                    </Text>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2">
                  <Text>Tổng thanh toán:</Text>
                  <Title level={4} type="danger" className="!mb-0">
                    {formatVND(finalTotal)}
                  </Title>
                </div>
              </Space>
            </div>

            <Form.Item
              label="Ghi chú cập nhật"
              name="notes"
            >
              <Input.TextArea
                rows={3}
                placeholder="Nhập ghi chú cho báo giá mới..."
                maxLength={500}
                showCount
              />
            </Form.Item>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button onClick={onClose} disabled={updatePcbOrder.isPending}>
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={updatePcbOrder.isPending || isSubmitting}
              >
                Cập nhật báo giá
              </Button>
            </div>
          </Form>
        </>
      )}
    </Modal>
  );
}