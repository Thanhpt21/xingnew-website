'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useConfigs } from '@/hooks/config/useConfigs';

interface AppContentProps {
  children: ReactNode;
}

export default function AppContent({ children }: AppContentProps) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');
  const isHomePage = pathname === '/';

  // ✅ GỌI API CONFIG
  const {
    data: configs,
    isLoading,
    isError,
  } = useConfigs({ page: 1, limit: 1 });

  // ✅ LẤY PHẦN TỬ ĐẦU TIÊN
  const configData = configs?.data?.[0];


  // ⏳ LOADING
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        <div className="mt-4 text-gray-700 text-lg">
          Đang tải website
        </div>
      </div>
    );
  }

  // ❌ ERROR
  if (isError || !configData) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <div className="text-red-500 text-lg font-semibold mb-2">
          Lỗi: Không thể tải cấu hình website
        </div>
        <p className="text-gray-600">
          Vui lòng thử lại sau
        </p>
      </div>
    );
  }

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        {!isAdminPage && <Header config={configData} />}

        <main className="flex-grow">
          <div
            className={
              isAdminPage || isHomePage
                ? 'w-full'
                : 'max-w-7xl mx-auto px-4'
            }
          >
            {children}
          </div>
        </main>

        {!isAdminPage && <Footer config={configData} />}
      </div>
    </AuthProvider>
  );
}
