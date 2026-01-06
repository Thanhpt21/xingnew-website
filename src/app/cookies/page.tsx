// app/cookies/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const CookiesSkeleton = () => (
  <div className="max-w-4xl mx-auto p-4 md:p-8 animate-pulse">
    <div className="h-10 bg-gray-200 rounded-lg mb-8"></div>
    <div className="h-24 bg-gray-200 rounded-lg mb-6"></div>
    {[...Array(4)].map((_, idx) => (
      <div key={idx} className="mb-6">
        <div className="h-6 bg-gray-200 rounded w-48 mb-3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    ))}
  </div>
);

const CookiesPolicy = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [cookieSettings, setCookieSettings] = useState({
    necessary: true,
    preferences: false,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Load saved cookie preferences
      const saved = localStorage.getItem('cookiePreferences');
      if (saved) {
        setCookieSettings(JSON.parse(saved));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleCookieToggle = (type: keyof typeof cookieSettings) => {
    const newSettings = {
      ...cookieSettings,
      [type]: !cookieSettings[type]
    };
    setCookieSettings(newSettings);
    localStorage.setItem('cookiePreferences', JSON.stringify(newSettings));
  };

  const saveCookiePreferences = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(cookieSettings));
    alert('Cài đặt cookies đã được lưu!');
  };

  const cookieTypes = [
    {
      id: 'necessary',
      name: 'Cookies cần thiết',
      description: 'Bắt buộc cho website hoạt động. Không thể tắt.',
      required: true,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'preferences',
      name: 'Cookies tùy chỉnh',
      description: 'Ghi nhớ cài đặt ngôn ngữ, vị trí và tùy chọn.',
      required: false,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'analytics',
      name: 'Cookies phân tích',
      description: 'Giúp chúng tôi hiểu cách bạn sử dụng website.',
      required: false,
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 'marketing',
      name: 'Cookies tiếp thị',
      description: 'Để hiển thị quảng cáo phù hợp với sở thích.',
      required: false,
      color: 'bg-yellow-100 text-yellow-800'
    }
  ];

  const cookieList = [
    {
      name: '_session_id',
      purpose: 'Duy trì phiên đăng nhập người dùng',
      duration: 'Phiên làm việc',
      type: 'Necessary'
    },
    {
      name: '_ga',
      purpose: 'Phân tích lượt truy cập Google Analytics',
      duration: '2 năm',
      type: 'Analytics'
    },
    {
      name: '_gid',
      purpose: 'Phân tích hành vi người dùng',
      duration: '24 giờ',
      type: 'Analytics'
    },
    {
      name: '_fbp',
      purpose: 'Theo dõi chuyển đổi Facebook',
      duration: '3 tháng',
      type: 'Marketing'
    },
    {
      name: 'language',
      purpose: 'Lưu tùy chọn ngôn ngữ',
      duration: '1 năm',
      type: 'Preferences'
    }
  ];

  if (isLoading) return <CookiesSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Trang chủ
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="font-medium text-gray-900">Chính sách Cookies</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Chính Sách Cookies
              </h1>
              <p className="text-gray-600">
                Hiểu cách chúng tôi sử dụng cookies để cải thiện trải nghiệm của bạn
              </p>
            </div>
            <div className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
              ePrivacy Directive
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Cookies là gì?</h3>
                <p className="text-gray-700 text-sm">
                  Cookies là các tệp tin nhỏ được lưu trữ trên thiết bị của bạn khi bạn truy cập website. 
                  Chúng giúp website hoạt động hiệu quả hơn và cung cấp thông tin cho chủ sở hữu website.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cookie Settings */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cài Đặt Cookies</h2>
          
          <div className="space-y-6">
            {cookieTypes.map((cookie) => (
              <div key={cookie.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${cookie.color} mr-3`}>
                      {cookie.name}
                    </span>
                    {cookie.required && (
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                        Bắt buộc
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{cookie.description}</p>
                </div>
                <div className="ml-4">
                  {cookie.required ? (
                    <span className="text-gray-500 text-sm">Luôn bật</span>
                  ) : (
                    <button
                      onClick={() => handleCookieToggle(cookie.id as keyof typeof cookieSettings)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        cookieSettings[cookie.id as keyof typeof cookieSettings] 
                          ? 'bg-blue-600' 
                          : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        cookieSettings[cookie.id as keyof typeof cookieSettings] 
                          ? 'translate-x-6' 
                          : 'translate-x-1'
                      }`} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={() => {
                setCookieSettings({
                  necessary: true,
                  preferences: true,
                  analytics: true,
                  marketing: true
                });
              }}
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
            >
              Chấp nhận tất cả
            </button>
            <button
              onClick={saveCookiePreferences}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Lưu cài đặt
            </button>
          </div>
        </div>

        {/* Cookie Details */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Danh sách Cookies chi tiết</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên Cookie
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mục đích
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời hạn
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cookieList.map((cookie, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {cookie.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {cookie.purpose}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {cookie.duration}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        cookie.type === 'Necessary' ? 'bg-blue-100 text-blue-800' :
                        cookie.type === 'Analytics' ? 'bg-green-100 text-green-800' :
                        cookie.type === 'Marketing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {cookie.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* How to Manage Cookies */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quản lý Cookies trên trình duyệt</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Google Chrome</h3>
              <ol className="list-decimal ml-4 space-y-2 text-sm text-gray-600">
                <li>Nhấp vào menu Chrome → Cài đặt</li>
                <li>Chọn "Bảo mật và Quyền riêng tư"</li>
                <li>Chọn "Cookies và dữ liệu trang web khác"</li>
                <li>Điều chỉnh cài đặt theo ý muốn</li>
              </ol>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Mozilla Firefox</h3>
              <ol className="list-decimal ml-4 space-y-2 text-sm text-gray-600">
                <li>Nhấp vào menu Firefox → Tùy chọn</li>
                <li>Chọn "Quyền riêng tư & Bảo mật"</li>
                <li>Tìm mục "Cookies và Dữ liệu Trang web"</li>
                <li>Chọn cài đặt phù hợp</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/dieu-khoan">
            <div className="p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
              <div className="text-blue-600 font-medium mb-2">→ Điều khoản dịch vụ</div>
              <p className="text-sm text-gray-600">Điều khoản sử dụng website</p>
            </div>
          </Link>
          <Link href="/chinh-sach-bao-mat">
            <div className="p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
              <div className="text-blue-600 font-medium mb-2">→ Chính sách bảo mật</div>
              <p className="text-sm text-gray-600">Bảo vệ thông tin cá nhân</p>
            </div>
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem('cookiePreferences');
              setCookieSettings({
                necessary: true,
                preferences: false,
                analytics: false,
                marketing: false
              });
            }}
            className="p-6 bg-white rounded-xl border border-gray-200 hover:border-red-300 hover:shadow-sm transition-all cursor-pointer text-left"
          >
            <div className="text-red-600 font-medium mb-2">→ Xóa tất cả cookies</div>
            <p className="text-sm text-gray-600">Xóa cài đặt hiện tại</p>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CookiesPolicy;