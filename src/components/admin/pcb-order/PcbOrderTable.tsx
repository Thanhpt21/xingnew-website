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
import { usePcbOrders } from '@/hooks/pcb-order/usePcbOrders';
import { useDeletePcbOrder } from '@/hooks/pcb-order/useDeletePcbOrder';
import { useUpdatePcbOrderStatus } from '@/hooks/pcb-order/useUpdatePcbOrderStatus';
import { PcbOrder } from '@/types/pcb-order.type';
import { PcbOrderStatus, PcbPaymentStatus } from '@/enums/pcb-order.enums';
import PcbOrderDetailModal from './PcbOrderDetailModal';
import { formatVND, formatDate } from '@/utils/helpers';
import UpdateQuotationModal from './UpdateQuotationModal';

export default function PcbOrderTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<PcbOrderStatus | undefined>(undefined);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | undefined>(undefined);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentOrderId, setSelectedPaymentOrderId] = useState<number | undefined>(undefined);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [selectedOrderForQuotation, setSelectedOrderForQuotation] = useState<PcbOrder | null>(null);

  const { data, isLoading, refetch } = usePcbOrders({
    page,
    limit: 10,
    search,
    status: statusFilter,
  });

  const { mutateAsync: deleteOrder } = useDeletePcbOrder();
  const { mutateAsync: updateOrder } = useUpdatePcbOrderStatus();

  // Mapping từ PcbOrderStatus enum sang tiếng Việt (GIỐNG Order)
  const getStatusVietnamese = (status: PcbOrderStatus): string => {
    const statusMap: Record<PcbOrderStatus, string> = {
      [PcbOrderStatus.NEW]: 'Mới',
      [PcbOrderStatus.QUOTATION_SENT]: 'Đã gửi báo giá',
      [PcbOrderStatus.CONFIRMED]: 'Đã xác nhận',
      [PcbOrderStatus.IN_PRODUCTION]: 'Đang sản xuất',
      [PcbOrderStatus.QUALITY_CHECK]: 'Kiểm tra chất lượng',
      [PcbOrderStatus.READY_FOR_SHIP]: 'Sẵn sàng giao',
      [PcbOrderStatus.SHIPPED]: 'Đã gửi hàng',
      [PcbOrderStatus.DELIVERED]: 'Đã giao',
      [PcbOrderStatus.COMPLETED]: 'Hoàn thành',
      [PcbOrderStatus.CANCELLED]: 'Đã hủy',
      [PcbOrderStatus.ON_HOLD]: 'Tạm hoãn',
    };
    return statusMap[status] || status;
  };

  // Get tag color based on order status (GIỐNG Order)
  const getStatusColor = (status: PcbOrderStatus): string => {
    const colorMap: Record<PcbOrderStatus, string> = {
      [PcbOrderStatus.NEW]: 'blue',
      [PcbOrderStatus.QUOTATION_SENT]: 'cyan',
      [PcbOrderStatus.CONFIRMED]: 'geekblue',
      [PcbOrderStatus.IN_PRODUCTION]: 'orange',
      [PcbOrderStatus.QUALITY_CHECK]: 'gold',
      [PcbOrderStatus.READY_FOR_SHIP]: 'lime',
      [PcbOrderStatus.SHIPPED]: 'green',
      [PcbOrderStatus.DELIVERED]: 'success',
      [PcbOrderStatus.COMPLETED]: 'success',
      [PcbOrderStatus.CANCELLED]: 'red',
      [PcbOrderStatus.ON_HOLD]: 'default',
    };
    return colorMap[status] || 'default';
  };

  const handleStatusChange = async (value: PcbOrderStatus, record: PcbOrder) => {
    try {
      await updateOrder({ id: record.id, status: value });
      message.success(`Cập nhật trạng thái thành công: ${getStatusVietnamese(value)}`);
      refetch?.();
    } catch (error: any) {
      message.error(error?.message || 'Cập nhật thất bại');
    }
  };

  const handleDeleteOrder = async (id: number) => {
    try {
      await deleteOrder(id);
      message.success('Xóa đơn hàng thành công');
      refetch?.();
    } catch (error: any) {
      message.error(error?.message || 'Xóa thất bại');
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

    // Thêm hàm mở modal cập nhật báo giá
  const showQuotationModal = (order: PcbOrder) => {
    setSelectedOrderForQuotation(order);
    setIsQuotationModalOpen(true);
  };

  const hideQuotationModal = () => {
    setIsQuotationModalOpen(false);
    setSelectedOrderForQuotation(null);
  };

  const handleQuotationSuccess = () => {
    // Refresh data
    refetch?.();
  };


  // Danh sách trạng thái đơn hàng bằng tiếng Việt (GIỐNG Order)
  const statusOptions = [
    { value: PcbOrderStatus.NEW, label: 'Mới' },
    { value: PcbOrderStatus.QUOTATION_SENT, label: 'Đã gửi báo giá' },
    { value: PcbOrderStatus.CONFIRMED, label: 'Đã xác nhận' },
    { value: PcbOrderStatus.IN_PRODUCTION, label: 'Đang sản xuất' },
    { value: PcbOrderStatus.QUALITY_CHECK, label: 'Kiểm tra chất lượng' },
    { value: PcbOrderStatus.READY_FOR_SHIP, label: 'Sẵn sàng giao' },
    { value: PcbOrderStatus.SHIPPED, label: 'Đã gửi hàng' },
    { value: PcbOrderStatus.DELIVERED, label: 'Đã giao' },
    { value: PcbOrderStatus.COMPLETED, label: 'Hoàn thành' },
    { value: PcbOrderStatus.CANCELLED, label: 'Đã hủy' },
    { value: PcbOrderStatus.ON_HOLD, label: 'Tạm hoãn' },
  ];

  const columns: ColumnsType<PcbOrder & { user?: { email?: string } }> = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_text, _record, index) => (page - 1) * 10 + index + 1,
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'pcbOrderId',
      key: 'pcbOrderId',
      width: 150,
    },
    {
      title: 'Loại',
      dataIndex: 'pcbOrderType',
      key: 'pcbOrderType',
      width: 100,
      render: (type: string) => {
        const typeMap: Record<string, string> = {
          'pcb': 'PCB',
          'assembly': 'Lắp ráp',
          'stencil': 'Stencil',
        };
        return typeMap[type] || type;
      },
    },
    {
      title: 'Email khách hàng',
      dataIndex: ['user', 'email'],
      key: 'email',
      render: (email) => email || '-',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'finalTotal',
      key: 'finalTotal',
      render: (amount: number) => formatVND(amount),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
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
      render: (status: PcbOrderStatus, record: PcbOrder) => (
        <Space direction="vertical" size="small">
          {/* Hiển thị trạng thái hiện tại bằng tiếng Việt */}
          <Tag color={getStatusColor(status)}>
            {getStatusVietnamese(status)}
          </Tag>
          
          {/* Select để thay đổi trạng thái */}
          <Select
            value={status}
            style={{ width: 200 }}
            onChange={(value) => handleStatusChange(value as PcbOrderStatus, record)}
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
          <Tooltip title="Xem chi tiết đơn hàng">
            <EyeOutlined
              onClick={() => showOrderDetail(record.id)}
              style={{ color: 'green', cursor: 'pointer' }}
            />
          </Tooltip>
            <Tooltip title="Cập nhật báo giá">
            <Button
              type="primary"
              size="small"
              onClick={() => showQuotationModal(record)}
              disabled={record.status !== 'NEW' && record.status !== 'QUOTATION_SENT'}
            >
              Báo giá
            </Button>
          </Tooltip>
          <Tooltip title="Xóa đơn hàng">
            <DeleteOutlined
              onClick={() => {
                Modal.confirm({
                  title: 'Xác nhận xóa đơn hàng',
                  content: `Bạn có chắc chắn muốn xóa đơn hàng ${record.pcbOrderId}?`,
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
          placeholder="Tìm kiếm theo mã đơn hoặc email"
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
        dataSource={data?.data?.data || []}
        rowKey="id"
        loading={isLoading}
        pagination={{
          total: data?.data?.total,
          current: page,
          pageSize: 10,
          onChange: (p) => setPage(p),
        }}
      />

      <PcbOrderDetailModal
        open={isDetailModalOpen}
        onClose={hideOrderDetail}
        orderId={selectedOrderId}
      />

       <UpdateQuotationModal
        open={isQuotationModalOpen}
        onClose={hideQuotationModal}
        order={selectedOrderForQuotation}
        onSuccess={handleQuotationSuccess}
      />

    </div>
  );
}