// components/layout/account/PcbOrders.tsx
'use client';

import { useState } from 'react';
import { 
  Card, 
  Input, 
  Select, 
  Pagination, 
  Button,
  Modal,
  Tabs,
  Descriptions,
  Tag,
  Collapse
} from 'antd';
import { 
  SearchOutlined, 
  EyeOutlined,
  PrinterOutlined,
  SettingOutlined,
  FileOutlined,
  CarOutlined,
  CheckSquareOutlined,
} from '@ant-design/icons';
import { useUserPcbOrders } from '@/hooks/pcb-order/useUserPcbOrders';
import { formatVND, formatDate } from '@/utils/helpers';
import { PcbOrderStatus, PcbOrderType } from '@/types/pcb-order.type';

const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
const { Panel } = Collapse;

interface PcbOrdersProps {
  userId: number;
}

export default function PcbOrders({ userId }: PcbOrdersProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PcbOrderStatus | undefined>();
  const [typeFilter, setTypeFilter] = useState<PcbOrderType | undefined>();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError } = useUserPcbOrders(userId, {
    page,
    limit: pageSize,
    search: search || undefined,
    status: statusFilter,
    pcbOrderType: typeFilter,
  });

  const getStatusVietnamese = (status: string) => {
    const statusMap: Record<string, string> = {
      'NEW': 'Mới',
      'QUOTATION_SENT': 'Đã gửi báo giá',
      'CONFIRMED': 'Đã xác nhận',
      'IN_PRODUCTION': 'Đang sản xuất',
      'QUALITY_CHECK': 'Kiểm tra chất lượng',
      'READY_FOR_SHIP': 'Sẵn sàng giao',
      'SHIPPED': 'Đã gửi hàng',
      'DELIVERED': 'Đã giao',
      'COMPLETED': 'Hoàn thành',
      'CANCELLED': 'Đã hủy',
      'ON_HOLD': 'Tạm hoãn',
    };
    return statusMap[status] || status;
  };

  const getTypeVietnamese = (type: string) => {
    const typeMap: Record<string, string> = {
      'PCB': 'PCB Gia công',
      'ASSEMBLY': 'PCB Lắp ráp',
      'STENCIL': 'SMT Stencil',
    };
    return typeMap[type] || type;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'NEW': 'blue',
      'CONFIRMED': 'green',
      'IN_PRODUCTION': 'orange',
      'DELIVERED': 'purple',
      'COMPLETED': 'green',
      'CANCELLED': 'red',
      'PENDING': 'gold',
    };
    return colorMap[status] || 'default';
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: string | undefined) => {
    setStatusFilter(value as PcbOrderStatus | undefined);
    setPage(1);
  };

  const handleTypeChange = (value: string | undefined) => {
    setTypeFilter(value as PcbOrderType | undefined);
    setPage(1);
  };

  const handleViewDetail = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter(undefined);
    setTypeFilter(undefined);
    setPage(1);
  };

  const renderOrderDetails = (order: any) => {
    const { pcbOrderType } = order;
    
    if (pcbOrderType === 'pcb' || pcbOrderType === 'PCB') {
      return renderPcbDetails(order);
    } else if (pcbOrderType === 'assembly' || pcbOrderType === 'ASSEMBLY') {
      return renderAssemblyDetails(order);
    } else if (pcbOrderType === 'stencil' || pcbOrderType === 'STENCIL') {
      return renderStencilDetails(order);
    }
    
    return null;
  };

const renderPcbDetails = (order: any) => {
  const details = order.pcbDetails || {};
  
  // Format các giá trị từ form
  const getDisplayValue = (value: any, defaultValue: string = 'Không có') => {
    return value && value !== '' ? value.toString() : defaultValue;
  };

  return (
    <div className="space-y-6">
      {/* Thông tin cơ bản */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-500 mb-1">Kích thước board</div>
          <div className="font-bold text-gray-900 text-lg">
            {getDisplayValue(order.boardHeight, '0')} × {getDisplayValue(order.boardWidth, '0')} cm
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-500 mb-1">Số lượng</div>
          <div className="font-bold text-gray-900 text-lg">
            {getDisplayValue(order.quantity, '0')} boards
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-500 mb-1">Số mạch khác nhau</div>
          <div className="font-bold text-gray-900 text-lg">
            {getDisplayValue(details.differentCircuits, '1')}
          </div>
        </div>
      </div>

      {/* Thông số kỹ thuật chính */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h4 className="font-bold text-gray-900 flex items-center">
            <SettingOutlined className="mr-2" />
            Thông số kỹ thuật PCB
          </h4>
        </div>
        
        <div className="p-4">
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
                  <span className="w-3 h-3 rounded-full mr-2" style={{
                    backgroundColor: 
                      details.pcbColor === 'Xanh lá' ? '#10B981' :
                      details.pcbColor === 'Đỏ' ? '#EF4444' :
                      details.pcbColor === 'Vàng' ? '#F59E0B' :
                      details.pcbColor === 'Xanh da trời' ? '#3B82F6' :
                      details.pcbColor === 'Đen' ? '#000000' :
                      details.pcbColor === 'Trắng' ? '#FFFFFF' : '#10B981',
                    border: details.pcbColor === 'Trắng' ? '1px solid #D1D5DB' : 'none'
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
        </div>
      </div>

      {/* Thông tin kiểm tra & giao hàng */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
            <CheckSquareOutlined className="mr-2 text-blue-500" />
            Kiểm tra & Xác minh
          </h5>
          <div className="space-y-2">
            <div>
              <div className="text-sm text-gray-500">Phương thức test</div>
              <div className="font-medium">{getDisplayValue(details.testMethod, 'Mắt thường (đạt>90%)')}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Yêu cầu ghép mạch</div>
              <div className="font-medium">{getDisplayValue(details.assemblyRequired, 'Không yêu cầu ghép')}</div>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
            <CarOutlined className="mr-2 text-green-500" />
            Giao hàng & Thanh toán
          </h5>
          <div className="space-y-2">
            <div>
              <div className="text-sm text-gray-500">Thời gian giao hàng</div>
              <div className="font-medium">{getDisplayValue(details.deliveryTime, 'Bình thường')}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Phương thức giao hàng</div>
              <div className="font-medium">{getDisplayValue(details.deliveryMethod, 'Chuyển phát nhanh trả trước')}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Tỷ lệ thanh toán</div>
              <div className="font-medium">{getDisplayValue(details.paymentRatio, '50% đơn hàng')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Ghi chú */}
      {details.notes && (
        <div className="border border-gray-200 rounded-lg p-4 bg-yellow-50">
          <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
            <FileOutlined className="mr-2 text-yellow-500" />
            Ghi chú đặc biệt
          </h5>
          <p className="text-gray-700 whitespace-pre-wrap">{details.notes}</p>
        </div>
      )}

      
    </div>
  );
};

  const renderAssemblyDetails = (order: any) => {
    const details = order.assemblyDetails || {};
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Kích thước board</div>
            <div className="font-medium">
              {order.boardWidth} × {order.boardHeight} mm
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Số lượng</div>
            <div className="font-medium">{order.quantity} boards</div>
          </div>
        </div>

        <Collapse defaultActiveKey={['1']} ghost>
          <Panel header="Thông tin lắp ráp" key="1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-sm text-gray-500">Mặt lắp ráp</div>
                <div className="font-medium">
                  {details.assemblySides === 'one_side' ? 'Một mặt' : 'Hai mặt'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Nguồn linh kiện</div>
                <div className="font-medium">
                  {details.componentSource === 'customer' ? 'Khách hàng cung cấp' : 'Nhà cung cấp'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Số loại linh kiện</div>
                <div className="font-medium">{details.componentTypes || '1'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Tổng linh kiện</div>
                <div className="font-medium">{details.totalComponents || '1'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Điểm SMD</div>
                <div className="font-medium">{details.smdPoints || 1}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Điểm DIP</div>
                <div className="font-medium">{details.dipPoints || 1}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Loại đóng gói</div>
                <div className="font-medium">{details.packaging || 'standard'}</div>
              </div>
            </div>
          </Panel>
        </Collapse>
      </div>
    );
  };

  const renderStencilDetails = (order: any) => {
    const details = order.stencilDetails || {};
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Kích thước stencil</div>
            <div className="font-medium">
              {order.boardWidth} × {order.boardHeight} mm
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Số lượng</div>
            <div className="font-medium">{order.quantity} cái</div>
          </div>
        </div>

        <Collapse defaultActiveKey={['1']} ghost>
          <Panel header="Thông số stencil" key="1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-sm text-gray-500">Loại stencil</div>
                <div className="font-medium">
                  {details.stencilType === 'framed' ? 'Có khung' : 'Không khung'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Mặt stencil</div>
                <div className="font-medium">
                  {details.stencilSide === 'both_separate' ? 'Hai mặt riêng' : 
                   details.stencilSide === 'both_combined' ? 'Hai mặt chung' : 'Một mặt'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Đánh bóng điện</div>
                <div className="font-medium">
                  {details.electropolishing === 'yes' ? 'Có' : 'Không'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Điểm chuẩn (Fiducials)</div>
                <div className="font-medium">
                  {details.fiducials === 'none' ? 'Không có' : 
                   details.fiducials === 'global' ? 'Toàn cục' : 'Cục bộ'}
                </div>
              </div>
            </div>
          </Panel>
        </Collapse>
      </div>
    );
  };

  const OrderPreview: React.FC<{ order: any }> = ({ order }) => {
    const getOrderIcon = () => {
      switch (order.pcbOrderType?.toLowerCase()) {
        case 'pcb':
          return <SettingOutlined className="text-blue-500" />;
        case 'assembly':
          return <SettingOutlined className="text-green-500" />;
        case 'stencil':
          return <SettingOutlined className="text-purple-500" />;
        default:
          return <PrinterOutlined />;
      }
    };

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-50 rounded-lg">
              {getOrderIcon()}
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-gray-900">
                  #{order.pcbOrderId}
                </span>
                <Tag color={getStatusColor(order.status)}>
                  {getStatusVietnamese(order.status)}
                </Tag>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  {getTypeVietnamese(order.pcbOrderType)}
                </span>
                <span>•</span>
                <span>{formatDate(order.createdAt)}</span>
                <span>•</span>
                <span>{order.quantity} cái</span>
              </div>

              <div className="mt-2 text-sm">
                <span className="text-gray-500">Kích thước: </span>
                <span className="font-medium">
                  {order.boardWidth} × {order.boardHeight} mm
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            {order.totalPrice > 0 && order.unitPrice > 0 ? (
              <>
                <div className="font-semibold text-gray-900">
                  {formatVND(order.totalPrice)}
                </div>
                <div className="text-sm text-gray-500">
                  {formatVND(order.unitPrice)}/cái
                </div>
              </>
            ) : (
              <div className="text-sm font-medium text-orange-600">
                Đang chờ báo giá
              </div>
            )}
          </div>

        </div>

        <div className="flex gap-2 pt-3 mt-3 border-t">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(order)}
            className="flex-1"
          >
            Xem chi tiết
          </Button>
        </div>
      </div>
    );
  };

  const orders = data?.data?.orders || [];
  const totalOrders = data?.data?.pagination?.total || 0;

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-8">
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-red-600 font-medium mb-2">Lỗi khi tải đơn hàng PCB</div>
          <p className="text-gray-600">Vui lòng thử lại sau.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Đơn hàng PCB Online
        </h2>
        <p className="text-gray-600">
          Quản lý và theo dõi tất cả đơn hàng PCB của bạn
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center">
          <div className="flex-1 w-full">
            <Search
              placeholder="Tìm kiếm theo mã đơn hàng..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              className="w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select
              placeholder="Trạng thái"
              allowClear
              style={{ width: 150 }}
              value={statusFilter}
              onChange={handleStatusChange}
              size="large"
            >
              <Option value="NEW">Mới</Option>
              <Option value="CONFIRMED">Đã xác nhận</Option>
              <Option value="IN_PRODUCTION">Đang sản xuất</Option>
              <Option value="READY_FOR_SHIP">Sẵn sàng giao</Option>
              <Option value="SHIPPED">Đã gửi hàng</Option>
              <Option value="DELIVERED">Đã giao</Option>
              <Option value="COMPLETED">Hoàn thành</Option>
              <Option value="CANCELLED">Đã hủy</Option>
            </Select>

            <Select
              placeholder="Loại đơn hàng"
              allowClear
              style={{ width: 150 }}
              value={typeFilter}
              onChange={handleTypeChange}
              size="large"
            >
              <Option value="PCB">PCB Gia công</Option>
              <Option value="ASSEMBLY">PCB Lắp ráp</Option>
              <Option value="STENCIL">SMT Stencil</Option>
            </Select>

            {(search || statusFilter || typeFilter) && (
              <Button onClick={handleResetFilters} size="large">
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Orders List */}
      {orders.length > 0 ? (
        <>
          <div>
            {orders.map((order: any) => (
              <OrderPreview key={order.id} order={order} />
            ))}
          </div>
          
          {/* Pagination */}
          <div className="mt-6 flex justify-center">
            <Pagination
              current={page}
              total={totalOrders}
              pageSize={pageSize}
              onChange={(newPage, newPageSize) => {
                setPage(newPage);
                if (newPageSize) setPageSize(newPageSize);
              }}
              showSizeChanger
              pageSizeOptions={[5, 10, 20]}
            />
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="text-gray-400 text-5xl mb-4">📄</div>
          <p className="text-gray-500 font-medium mb-2">
            {search || statusFilter || typeFilter ? 
              "Không tìm thấy đơn hàng phù hợp" : 
              "Bạn chưa có đơn hàng PCB nào"
            }
          </p>
          {search || statusFilter || typeFilter ? (
            <Button 
              onClick={handleResetFilters}
              className="mt-4"
              size="large"
            >
              Xóa bộ lọc
            </Button>
          ) : (
            <Button 
              type="primary" 
              href="/pcb-order"
              className="mt-4"
              size="large"
            >
              Đặt PCB mới
            </Button>
          )}
        </div>
      )}

      {/* Order Detail Modal */}
      <Modal
        title={`Chi tiết đơn hàng #${selectedOrder?.pcbOrderId}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-sm text-gray-500">Trạng thái</div>
                <div className="font-medium">
                  <Tag color={getStatusColor(selectedOrder.status)}>
                    {getStatusVietnamese(selectedOrder.status)}
                  </Tag>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-sm text-gray-500">Loại đơn hàng</div>
                <div className="font-medium">{getTypeVietnamese(selectedOrder.pcbOrderType)}</div>
              </div>

              <div className="bg-gray-50 p-3 rounded">
                <div className="text-sm text-gray-500">Ngày tạo</div>
                <div className="font-medium">{formatDate(selectedOrder.createdAt)}</div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-sm text-gray-500">Cập nhật</div>
                <div className="font-medium">{formatDate(selectedOrder.updatedAt)}</div>
              </div>
            </div>

            {/* Order Specific Details */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-gray-900 mb-3">Thông tin đơn hàng</h3>
              {renderOrderDetails(selectedOrder)}
            </div>


          </div>
        )}
      </Modal>
    </div>
  );
}