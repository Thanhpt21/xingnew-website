'use client';

import {
  Table,
  Tag,
  Space,
  Tooltip,
  Input,
  Button,
  Modal,
  message,
  Select,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EyeOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useOrders } from '@/hooks/order/useOrders';
import { useDeleteOrder } from '@/hooks/order/useDeleteOrder';
import { useUpdateOrder } from '@/hooks/order/useUpdateOrder';
import { Order } from '@/types/order.type';
import { OrderStatus, PaymentStatus } from '@/enums/order.enums';
import OrderDetailModal from './OrderDetailModal';
import { formatVND, formatDate } from '@/utils/helpers';
import PaymentDetailModal from './PaymentDetailModal';

export default function OrderTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>(undefined);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | undefined>(undefined);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentOrderId, setSelectedPaymentOrderId] = useState<number | undefined>(undefined);

  const { data, isLoading, refetch } = useOrders({
    page,
    limit: 10,
    search,
    status: statusFilter,
  });

  const { mutateAsync: deleteOrder } = useDeleteOrder();
  const { mutateAsync: updateOrder } = useUpdateOrder();

  // Mapping từ OrderStatus enum sang tiếng Việt
  const getStatusVietnamese = (status: OrderStatus): string => {
    const statusMap: Record<OrderStatus, string> = {
      [OrderStatus.DRAFT]: 'Đang soạn đơn',
      [OrderStatus.PAID_PENDING]: 'Chờ xác nhận thanh toán',
      [OrderStatus.PAID]: 'Đã thanh toán',
      [OrderStatus.PROCESSING]: 'Đang xử lý đơn hàng',
      [OrderStatus.SHIPPED]: 'Đang vận chuyển',
      [OrderStatus.DELIVERED]: 'Đã giao hàng',
      [OrderStatus.CANCELLED]: 'Đã hủy đơn',
      [OrderStatus.REFUNDED]: 'Đã hoàn tiền',
    };
    return statusMap[status] || status;
  };

  // Get tag color based on order status
  const getStatusColor = (status: OrderStatus): string => {
    const colorMap: Record<OrderStatus, string> = {
      [OrderStatus.DRAFT]: 'yellow',
      [OrderStatus.PAID_PENDING]: 'orange',
      [OrderStatus.PAID]: 'blue',
      [OrderStatus.PROCESSING]: 'geekblue',
      [OrderStatus.SHIPPED]: 'cyan',
      [OrderStatus.DELIVERED]: 'green',
      [OrderStatus.CANCELLED]: 'red',
      [OrderStatus.REFUNDED]: 'purple',
    };
    return colorMap[status] || 'default';
  };

  const handleStatusChange = async (value: OrderStatus, record: Order) => {
    try {
      await updateOrder({ id: record.id, data: { status: value } });
      message.success(`Cập nhật trạng thái thành công: ${getStatusVietnamese(value)}`);
      refetch?.();
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  const handleDeleteOrder = async (id: number) => {
    try {
      await deleteOrder(id);
      message.success('Xóa đơn hàng thành công');
      refetch?.();
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Xóa thất bại');
    }
  };

  const showOrderDetail = (id: number) => {
    setSelectedOrderId(id);
    setIsDetailModalOpen(true);
  };

  const hideOrderDetail = () => {
    setIsDetailModalOpen(false);
    setSelectedOrderId(undefined);
  };

  const showPaymentDetails = (orderId: number) => {
    setSelectedPaymentOrderId(orderId);
    setIsPaymentModalOpen(true);
  };

  const hidePaymentDetails = () => {
    setIsPaymentModalOpen(false);
    setSelectedPaymentOrderId(undefined);
  };

  // Danh sách trạng thái đơn hàng bằng tiếng Việt
  const statusOptions = [
    { value: OrderStatus.DRAFT, label: 'Đang soạn đơn' },
    { value: OrderStatus.PAID_PENDING, label: 'Chờ xác nhận thanh toán' },
    { value: OrderStatus.PAID, label: 'Đã thanh toán' },
    { value: OrderStatus.PROCESSING, label: 'Đang xử lý đơn hàng' },
    { value: OrderStatus.SHIPPED, label: 'Đang vận chuyển' },
    { value: OrderStatus.DELIVERED, label: 'Đã giao hàng' },
    { value: OrderStatus.CANCELLED, label: 'Đã hủy đơn' },
    { value: OrderStatus.REFUNDED, label: 'Đã hoàn tiền' },
  ];

  const columns: ColumnsType<Order & { user?: { email?: string } }> = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_text, _record, index) => (page - 1) * 10 + index + 1,
    },
    {
      title: 'ID đơn hàng',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Email khách hàng',
      dataIndex: ['user', 'email'],
      key: 'email',
      render: (email) => email || '-',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => formatVND(amount),
    },
    {
      title: 'Phí vận chuyển',
      dataIndex: 'shippingFee',
      key: 'shippingFee',
      render: (shippingFee: number) => formatVND(shippingFee),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => formatDate(date),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: OrderStatus, record: Order) => (
        <Space direction="vertical" size="small">
          {/* Hiển thị trạng thái hiện tại bằng tiếng Việt */}
          <Tag color={getStatusColor(status)}>
            {getStatusVietnamese(status)}
          </Tag>
          
          {/* Select để thay đổi trạng thái */}
          <Select
            value={status}
            style={{ width: 200 }}
            onChange={(value) => handleStatusChange(value as OrderStatus, record)}
            size="small"
          >
            {statusOptions.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Space>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          {record.paymentMethod?.code === 'VNPAY' && (
            <Tooltip title="Xem chi tiết thanh toán">
              <InfoCircleOutlined
                onClick={() => showPaymentDetails(record.id)}
                style={{ color: 'blue', cursor: 'pointer' }}
              />
            </Tooltip>
          )}
          <Tooltip title="Xem chi tiết đơn hàng">
            <EyeOutlined
              onClick={() => showOrderDetail(record.id)}
              style={{ color: 'green', cursor: 'pointer' }}
            />
          </Tooltip>
          <Tooltip title="Xóa đơn hàng">
            <DeleteOutlined
              onClick={() => {
                Modal.confirm({
                  title: 'Xác nhận xóa đơn hàng',
                  content: `Bạn có chắc chắn muốn xóa đơn hàng ID ${record.id}?`,
                  okText: 'Xóa',
                  okType: 'danger',
                  cancelText: 'Hủy',
                  onOk: async () => await handleDeleteOrder(record.id),
                });
              }}
              style={{ color: 'red', cursor: 'pointer' }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center mb-4 gap-2">
        <Input
          placeholder="Tìm kiếm theo ID hoặc email"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{ width: 200 }}
        />
        <Button 
          type="primary" 
          onClick={() => { 
            setSearch(inputValue); 
            setPage(1); 
            refetch?.(); 
          }}
        >
          Tìm kiếm
        </Button>

        <Select
          placeholder="Lọc trạng thái"
          allowClear
          style={{ width: 200 }}
          value={statusFilter}
          onChange={(value) => setStatusFilter(value)}
        >
          {statusOptions.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>

        <Button 
          type="primary" 
          onClick={() => { 
            setPage(1); 
            refetch?.(); 
          }}
        >
          Áp dụng bộ lọc
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data?.data || []}
        rowKey="id"
        loading={isLoading}
        pagination={{
          total: data?.total,
          current: page,
          pageSize: 10,
          onChange: (p) => setPage(p),
        }}
      />

      <OrderDetailModal
        open={isDetailModalOpen}
        onClose={hideOrderDetail}
        orderId={selectedOrderId}
      />

      <PaymentDetailModal
        open={isPaymentModalOpen}
        onClose={hidePaymentDetails}
        orderId={selectedPaymentOrderId}
      />
    </div>
  );
}