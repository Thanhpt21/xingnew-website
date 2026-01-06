// components/admin/pcb-order/PcbOrderDetailModal.tsx
'use client';

import { Modal, Descriptions, Tag, Typography, Divider, Card, Row, Col, Space, Button, Collapse } from 'antd';
import { usePcbOrder } from '@/hooks/pcb-order/usePcbOrder';
import { 
  PcbOrderStatus, 
  PcbPaymentStatus, 
  PcbOrderType 
} from '@/types/pcb-order.type';
import { formatVND, formatDate } from '@/utils/helpers';
import { 
  UserOutlined, 
  CalendarOutlined, 
  DollarOutlined,
  BoxPlotOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  SettingOutlined,
  CarOutlined,
  CheckSquareOutlined,
  PrinterOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

interface PcbOrderDetailModalProps {
  open: boolean;
  onClose: () => void;
  orderId?: number;
}

export default function PcbOrderDetailModal({ 
  open, 
  onClose, 
  orderId 
}: PcbOrderDetailModalProps) {
  const { data: order, isLoading } = usePcbOrder(orderId);

  // Get status Vietnamese
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

  // Get payment status Vietnamese
  const getPaymentStatusVietnamese = (status: PcbPaymentStatus): string => {
    const statusMap: Record<PcbPaymentStatus, string> = {
      [PcbPaymentStatus.PENDING]: 'Chờ thanh toán',
      [PcbPaymentStatus.DEPOSIT_PAID]: 'Đã đặt cọc',
      [PcbPaymentStatus.FULLY_PAID]: 'Đã thanh toán',
      [PcbPaymentStatus.REFUNDED]: 'Đã hoàn tiền',
      [PcbPaymentStatus.PAYMENT_FAILED]: 'Thanh toán thất bại',
    };
    return statusMap[status] || status;
  };

  // Get order type Vietnamese
  const getOrderTypeVietnamese = (type: PcbOrderType): string => {
    const typeMap: Record<PcbOrderType, string> = {
      [PcbOrderType.PCB]: 'PCB Gia công',
      [PcbOrderType.ASSEMBLY]: 'PCB Lắp ráp',
      [PcbOrderType.STENCIL]: 'SMT Stencil',
    };
    return typeMap[type] || type;
  };

  // Get status color
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

  // Get payment status color
  const getPaymentStatusColor = (status: PcbPaymentStatus): string => {
    const colorMap: Record<PcbPaymentStatus, string> = {
      [PcbPaymentStatus.PENDING]: 'warning',
      [PcbPaymentStatus.DEPOSIT_PAID]: 'processing',
      [PcbPaymentStatus.FULLY_PAID]: 'success',
      [PcbPaymentStatus.REFUNDED]: 'default',
      [PcbPaymentStatus.PAYMENT_FAILED]: 'error',
    };
    return colorMap[status] || 'default';
  };

  // Helper function to get display value
  const getDisplayValue = (value: any, defaultValue: string = 'Không có') => {
    if (value === undefined || value === null || value === '') {
      return defaultValue;
    }
    return value.toString();
  };

  // Render PCB details with new fields
  const renderPcbDetails = (details: any) => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-500 mb-1">Kích thước board</div>
            <div className="font-bold text-gray-900">
              {order?.boardHeight || 0} × {order?.boardWidth || 0} cm
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-500 mb-1">Số lượng</div>
            <div className="font-bold text-gray-900">
              {order?.quantity || 0} boards
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-500 mb-1">Số mạch khác nhau</div>
            <div className="font-bold text-gray-900">
              {getDisplayValue(details.differentCircuits, '1')}
            </div>
          </div>
        </div>

        <Collapse defaultActiveKey={['specs', 'processing', 'delivery']} ghost>
          <Panel header={
            <div className="font-semibold flex items-center">
              <SettingOutlined className="mr-2" />
              Thông số kỹ thuật PCB
            </div>
          } key="specs">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Cột 1 */}
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Số lớp</div>
                  <div className="font-medium">{getDisplayValue(details.layerCount, '2')}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Vật liệu</div>
                  <div className="font-medium">{getDisplayValue(details.material, 'FR-4')}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Độ dày phíp</div>
                  <div className="font-medium">{getDisplayValue(details.thickness, '1.6')} mm</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Độ dày đồng</div>
                  <div className="font-medium">{getDisplayValue(details.copperThickness, '1oz')}</div>
                </div>
              </div>

              {/* Cột 2 */}
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Gia công bán lỗ</div>
                  <div className="font-medium">{getDisplayValue(details.halfHoleMachining, 'Không')}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Lỗ khoan nhỏ nhất</div>
                  <div className="font-medium">{getDisplayValue(details.minDrillHole, '≥ 0.3 mm')}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Độ rộng đường mạch nhỏ nhất</div>
                  <div className="font-medium">{getDisplayValue(details.minTraceWidth, '≥ 0.3 mm')}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Chip BGA</div>
                  <div className="font-medium">{getDisplayValue(details.chipBGA, 'Không')}</div>
                </div>
              </div>

              {/* Cột 3 */}
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Màu PCB</div>
                  <div className="font-medium flex items-center">
                    <span className="w-4 h-4 rounded-full mr-2 border border-gray-300" style={{
                      backgroundColor: 
                        details.pcbColor === 'Xanh lá' ? '#10B981' :
                        details.pcbColor === 'Đỏ' ? '#EF4444' :
                        details.pcbColor === 'Vàng' ? '#F59E0B' :
                        details.pcbColor === 'Xanh da trời' ? '#3B82F6' :
                        details.pcbColor === 'Đen' ? '#000000' :
                        details.pcbColor === 'Trắng' ? '#FFFFFF' : '#10B981'
                    }}></span>
                    {getDisplayValue(details.pcbColor, 'Xanh lá')}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Màu silkscreen</div>
                  <div className="font-medium">{getDisplayValue(details.silkscreenColor, 'Trắng')}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Hoàn thiện bề mặt</div>
                  <div className="font-medium">{getDisplayValue(details.surfaceFinish, 'Thiếc chì')}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Hình dạng board</div>
                  <div className="font-medium">{getDisplayValue(details.boardShape, 'Chữ nhật')}</div>
                </div>
              </div>
            </div>
          </Panel>

          <Panel header={
            <div className="font-semibold flex items-center">
              <CheckSquareOutlined className="mr-2" />
              Kiểm tra & Ghép mạch
            </div>
          } key="processing">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Phương thức test</div>
                <div className="font-medium">{getDisplayValue(details.testMethod, 'Mắt thường (đạt>90%)')}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Yêu cầu ghép mạch</div>
                <div className="font-medium">{getDisplayValue(details.assemblyRequired, 'Không yêu cầu ghép')}</div>
              </div>
            </div>
          </Panel>

          <Panel header={
            <div className="font-semibold flex items-center">
              <CarOutlined className="mr-2" />
              Giao hàng & Thanh toán
            </div>
          } key="delivery">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-500">Thời gian giao hàng</div>
                <div className="font-medium">{getDisplayValue(details.deliveryTime, 'Bình thường')}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Phương thức giao hàng</div>
                <div className="font-medium">{getDisplayValue(details.deliveryMethod, 'Chuyển phát nhanh trả sau')}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Tỷ lệ thanh toán</div>
                <div className="font-medium">{getDisplayValue(details.paymentRatio, '50% đơn hàng')}</div>
              </div>
            </div>
          </Panel>
        </Collapse>
      </div>
    );
  };

  // Render Assembly details
  const renderAssemblyDetails = (details: any) => {
    return (
      <div className="space-y-4">
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Số điểm hàn SMD">
            {details.smdPoints || 0}
          </Descriptions.Item>
          <Descriptions.Item label="Số điểm hàn DIP">
            {details.dipPoints || 0}
          </Descriptions.Item>
          <Descriptions.Item label="Mặt lắp ráp">
            {details.assemblySides === 'one_side' ? '1 mặt' : '2 mặt'}
          </Descriptions.Item>
          <Descriptions.Item label="Nguồn linh kiện">
            {details.componentSource === 'customer' ? 'Khách hàng cung cấp' : 'Nhà cung cấp'}
          </Descriptions.Item>
          <Descriptions.Item label="Loại linh kiện">
            {details.componentTypes || 'Không có'}
          </Descriptions.Item>
          <Descriptions.Item label="Tổng linh kiện">
            {details.totalComponents || 'Không có'}
          </Descriptions.Item>
          <Descriptions.Item label="Đóng gói">
            {details.packaging || 'standard'}
          </Descriptions.Item>
          <Descriptions.Item label="Xác nhận PCBA">
            {details.pcbaConfirmation ? 'Có' : 'Không'}
          </Descriptions.Item>
        </Descriptions>
      </div>
    );
  };

  // Render Stencil details
  const renderStencilDetails = (details: any) => {
    return (
      <div className="space-y-4">
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Loại Stencil">
            {details.stencilType === 'framed' ? 'Có khung' : 'Không khung'}
          </Descriptions.Item>
          <Descriptions.Item label="Đánh bóng điện">
            {details.electropolishing === 'yes' ? 'Có' : 'Không'}
          </Descriptions.Item>
          <Descriptions.Item label="Mặt stencil">
            {details.stencilSide === 'top' ? 'Mặt trên' : 
             details.stencilSide === 'both_same' ? '2 mặt giống nhau' : 
             '2 mặt riêng biệt'}
          </Descriptions.Item>
          <Descriptions.Item label="Điểm định vị">
            {details.fiducials === 'none' ? 'Không có' : 'Có'}
          </Descriptions.Item>
        </Descriptions>
      </div>
    );
  };

  // Render details based on order type
  const renderOrderDetails = () => {
    if (!order) return null;

    const detailsMap = {
      [PcbOrderType.PCB]: order.pcbDetails,
      [PcbOrderType.ASSEMBLY]: order.assemblyDetails,
      [PcbOrderType.STENCIL]: order.stencilDetails,
    };

    const details = detailsMap[order.pcbOrderType];

    if (!details) return null;

    switch (order.pcbOrderType) {
      case PcbOrderType.PCB:
        return (
          <Card title="Thông tin PCB" size="small" className="mb-4">
            {renderPcbDetails(details)}
          </Card>
        );

      case PcbOrderType.ASSEMBLY:
        return (
          <Card title="Thông tin lắp ráp" size="small" className="mb-4">
            {renderAssemblyDetails(details)}
          </Card>
        );

      case PcbOrderType.STENCIL:
        return (
          <Card title="Thông tin Stencil" size="small" className="mb-4">
            {renderStencilDetails(details)}
          </Card>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Modal
        title="Đang tải..."
        open={open}
        onCancel={onClose}
        footer={null}
        width={800}
      >
        <div className="text-center py-8">Đang tải thông tin đơn hàng...</div>
      </Modal>
    );
  }

  if (!order) {
    return (
      <Modal
        title="Không tìm thấy đơn hàng"
        open={open}
        onCancel={onClose}
        footer={null}
        width={600}
      >
        <div className="text-center py-8 text-red-500">
          Không tìm thấy thông tin đơn hàng. Vui lòng thử lại.
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title={
        <div>
          <Title level={4} className="!mb-0">
            <FileTextOutlined className="mr-2" />
            Chi tiết đơn hàng PCB
          </Title>
          <Text type="secondary" className="text-sm">
            {order.pcbOrderId}
          </Text>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
        <Button 
          key="print" 
          type="primary" 
          onClick={() => window.print()}
          icon={<PrinterOutlined />}
        >
          In đơn hàng
        </Button>
      ]}
      width={900}
    >
      {/* Header - Order Info */}
      <Card size="small" className="mb-4">
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Space direction="vertical" size="small">
              <Text type="secondary">
                <CalendarOutlined className="mr-2" />
                Ngày tạo
              </Text>
              <Text strong>{formatDate(order.createdAt)}</Text>
            </Space>
          </Col>
          <Col span={8}>
            <Space direction="vertical" size="small">
              <Text type="secondary">
                <UserOutlined className="mr-2" />
                Khách hàng
              </Text>
              <Text strong>
                {order.user?.name} ({order.user?.email})
              </Text>
            </Space>
          </Col>
          <Col span={8}>
            <Space direction="vertical" size="small">
              <Text type="secondary">
                <DollarOutlined className="mr-2" />
                Loại đơn hàng
              </Text>
              <Tag color="blue">{getOrderTypeVietnamese(order.pcbOrderType)}</Tag>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Status & Payment */}
      <Card size="small" className="mb-4">
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Space direction="vertical" size="small">
              <Text type="secondary">Trạng thái đơn hàng</Text>
              <Tag color={getStatusColor(order.status)} style={{ fontSize: '14px', padding: '4px 8px' }}>
                {getStatusVietnamese(order.status)}
              </Tag>
            </Space>
          </Col>
         
        </Row>
      </Card>

      {/* Product Info */}
      <Card title="Thông tin sản phẩm" size="small" className="mb-4">
        <Descriptions bordered column={3} size="small">
          <Descriptions.Item label="Số lượng">
            <Text strong>{order.quantity} cái</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Kích thước board">
            <Text strong>{order.boardWidth || 0} × {order.boardHeight || 0} cm</Text>
          </Descriptions.Item>
         
          <Descriptions.Item label="Giao hàng nhanh">
            <Tag color={order.fastDelivery ? 'green' : 'default'}>
              {order.fastDelivery ? 'Có' : 'Không'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày đặt hàng">
            {formatDate(order.orderDate || order.createdAt)}
          </Descriptions.Item>
          {order.estimatedCompleteDate && (
            <Descriptions.Item label="Dự kiến hoàn thành">
              {formatDate(order.estimatedCompleteDate)}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* Order Type Specific Details */}
      {renderOrderDetails()}

      {/* Pricing Info */}
      <Card title="Thông tin giá" size="small" className="mb-4">
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Đơn giá">
            <Text strong>{order.unitPrice > 0 ? formatVND(order.unitPrice) : 'Chờ báo giá'}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Tổng tiền hàng">
            <Text strong>{order.totalPrice > 0 ? formatVND(order.totalPrice) : 'Chờ báo giá'}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Phí giao hàng nhanh">
            <Text type={order.fastDelivery ? undefined : 'secondary'}>
              {order.fastDeliveryFee ? formatVND(order.fastDeliveryFee) : '0 VND'}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Tổng thanh toán">
            <Title level={4} type="danger" className="!mb-0 !mt-0">
              {order.finalTotal > 0 ? formatVND(order.finalTotal) : 'Chờ báo giá'}
            </Title>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Notes */}
      {order.notes && (
        <Card title="Ghi chú" size="small" className="mb-4">
          <div className="bg-yellow-50 p-3 rounded">
            <Paragraph className="whitespace-pre-wrap">{order.notes}</Paragraph>
          </div>
        </Card>
      )}

      {/* File Info */}
      {(order.gerberFileName || order.gerberFileUrl) && (
        <Card title="File đính kèm" size="small">
          <Space direction="vertical">
            {order.gerberFileName && (
              <Text>
                <FileTextOutlined className="mr-2" />
                File: {order.gerberFileName}
                {order.gerberFileSize && (
                  <Text type="secondary" className="ml-2">
                    ({Math.round(order.gerberFileSize / 1024)} KB)
                  </Text>
                )}
              </Text>
            )}
            {order.gerberFileUrl && (
              <Button 
                type="link" 
                href={order.gerberFileUrl}
                target="_blank"
                icon={<FileTextOutlined />}
              >
                Tải file Gerber
              </Button>
            )}
          </Space>
        </Card>
      )}
    </Modal>
  );
}