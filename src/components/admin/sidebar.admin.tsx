'use client';

import { Image, Layout, Menu } from 'antd';
import { 
  AppleOutlined, 
  AppstoreOutlined, 
  BgColorsOutlined, 
  BranchesOutlined, 
  BuildOutlined, 
  BulbOutlined, 
  DashboardOutlined, 
  DollarOutlined, 
  FileProtectOutlined, 
  GiftOutlined, 
  GoldOutlined, 
  HomeOutlined, 
  MessageOutlined, 
  PicLeftOutlined, 
  PicRightOutlined, 
  ProductOutlined, 
  ScissorOutlined, 
  SettingOutlined, 
  SkinOutlined, 
  SolutionOutlined, 
  ToolOutlined, 
  TruckOutlined, 
  UnorderedListOutlined, 
  UserOutlined, 
  UserSwitchOutlined,
  // ✅ THÊM ICON MỚI
  FileDoneOutlined // Icon cho PCB Orders
} from '@ant-design/icons';
import Link from 'next/link';

interface SidebarAdminProps {
  collapsed: boolean;
}

export default function SidebarAdmin({ collapsed }: SidebarAdminProps) {
  return (
    <Layout.Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className="!bg-white shadow"
      style={{ backgroundColor: '#fff' }}
    >
      <div className=" text-center py-4">
        <Image
          src="https://www.sfdcpoint.com/wp-content/uploads/2019/01/Salesforce-Admin-Interview-questions.png"
          alt="Admin Logo"
          width={collapsed ? 40 : 80}
          preview={false}
        />
      </div>
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        items={[
          {
            key: 'Dashboard',
            icon: <DashboardOutlined />,
            label: <Link href="/admin">Thống kê</Link>,
          },
        
          {
            key: 'users',
            icon: <UserOutlined />,
            label: <Link href="/admin/users">Khách hàng</Link>,
          },
          {
            key: 'staff',
            icon: <UserSwitchOutlined />,
            label: <Link href="/admin/staff">Nhân viên</Link>,
          },
          {
            key: 'product',
            icon: <ProductOutlined />,
            label: <Link href="/admin/product">Sản phẩm</Link>,
          },
          { key: 'attribute', icon: <ScissorOutlined />, label: <Link href="/admin/attribute">Thuộc tính</Link> },
          { key: 'categories', icon: <BuildOutlined />, label: <Link href="/admin/categories">Danh mục</Link> },
          { key: 'brand', icon: <AppleOutlined />, label: <Link href="/admin/brand">Thương hiệu</Link> },
          
          // ✅ THÊM MENU "ĐƠN HÀNG PCB" - đặt cùng nhóm với Order
          {
            key: 'pcb-orders',
            icon: <FileDoneOutlined />, // Icon PCB Orders
            label: <Link href="/admin/pcb-orders">Đơn hàng PCB</Link>,
          },
          
          {
            key: 'order',
            icon: <FileProtectOutlined />,
            label: <Link href="/admin/order">Đơn hàng</Link>,
          },
         
          {
            key: '7',
            icon: <SolutionOutlined />,
            label: <Link href="/admin/payout">Phiếu chi</Link>,
          },
          {
            key: 'payment',
            icon: <DollarOutlined />,
            label: <Link href="/admin/payment">Thanh toán</Link>,
          },
          {
            key: 'blog',
            icon: <BulbOutlined  />,
            label: <Link href="/admin/blog">Tin tức</Link>,
          },
         
          {
            key: 'contact',
            icon: <MessageOutlined />,
            label: <Link href="/admin/contact">Liên hệ</Link>,
          },
          {
            key: 'sub4',
            icon: <BranchesOutlined />,
            label: 'Cấu hình',
            children: [
              { key: 'config', icon: <SettingOutlined />, label: <Link href="/admin/config">Cấu hình</Link> },
            ],
          },
        ]}
      />
    </Layout.Sider>
  );
}