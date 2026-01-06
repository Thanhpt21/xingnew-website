'use client';

import PcbOrderTable from '@/components/admin/pcb-order/PcbOrderTable';
import { Typography } from 'antd';

const { Title } = Typography;

export default function AdminPcbOrderPage() {
  return (
    <div className="p-4">
      <Title level={5} className="!mb-4">Danh sách đơn hàng PCB</Title>
      <PcbOrderTable />
    </div>
  );
}