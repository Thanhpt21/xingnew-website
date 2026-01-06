// app/chinh-sach-bao-mat/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const PrivacySkeleton = () => (
  <div className="max-w-4xl mx-auto p-4 md:p-8 animate-pulse">
    <div className="h-10 bg-gray-200 rounded-lg mb-8"></div>
    {[...Array(6)].map((_, idx) => (
      <div key={idx} className="mb-6">
        <div className="h-6 bg-gray-200 rounded w-56 mb-3"></div>
        <div className="space-y-2 ml-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    ))}
  </div>
);

const PrivacyPolicy = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setLastUpdated(new Date().toLocaleDateString('vi-VN'));
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const sections = [
    {
      id: 1,
      title: "1. Thông tin chúng tôi thu thập",
      content: "Chúng tôi thu thập các loại thông tin sau:",
      items: [
        "Thông tin cá nhân: Họ tên, email, số điện thoại, địa chỉ",
        "Thông tin giao dịch: Lịch sử mua hàng, phương thức thanh toán",
        "Thông tin kỹ thuật: Địa chỉ IP, loại trình duyệt, thiết bị truy cập",
        "Cookie và dữ liệu theo dõi"
      ]
    },
    {
      id: 2,
      title: "2. Mục đích thu thập thông tin",
      content: "Thông tin được thu thập nhằm mục đích:",
      items: [
        "Cung cấp và cải thiện dịch vụ",
        "Xử lý đơn hàng và thanh toán",
        "Gửi thông tin khuyến mãi và cập nhật",
        "Phân tích và nghiên cứu thị trường",
        "Đảm bảo an ninh và phòng chống gian lận"
      ]
    },
    {
      id: 3,
      title: "3. Chia sẻ thông tin",
      content: "Chúng tôi có thể chia sẻ thông tin với:",
      items: [
        "Đối tác vận chuyển để giao hàng",
        "Nhà cung cấp dịch vụ thanh toán",
        "Đơn vị phân tích dữ liệu (dưới dạng ẩn danh)",
        "Cơ quan pháp luật khi được yêu cầu hợp pháp"
      ]
    },
    {
      id: 4,
      title: "4. Bảo mật thông tin",
      content: "Chúng tôi áp dụng các biện pháp bảo mật:",
      items: [
        "Mã hóa SSL cho tất cả giao dịch trực tuyến",
        "Hệ thống tường lửa và chống xâm nhập",
        "Kiểm soát truy cập nghiêm ngặt",
        "Đào tạo nhân viên về bảo mật dữ liệu",
        "Sao lưu dữ liệu định kỳ"
      ]
    },
    {
      id: 5,
      title: "5. Quyền của người dùng",
      content: "Bạn có quyền:",
      items: [
        "Truy cập thông tin cá nhân của mình",
        "Yêu cầu chỉnh sửa thông tin không chính xác",
        "Yêu cầu xóa thông tin cá nhân",
        "Từ chối nhận thông tin tiếp thị",
        "Khiếu nại về việc xử lý dữ liệu"
      ]
    },
    {
      id: 6,
      title: "6. Cookie và công nghệ theo dõi",
      content: "Chúng tôi sử dụng cookies để:",
      items: [
        "Ghi nhớ tùy chọn người dùng",
        "Phân tích lưu lượng truy cập",
        "Cải thiện trải nghiệm người dùng",
        "Hiển thị quảng cáo phù hợp"
      ]
    },
    {
      id: 7,
      title: "7. Lưu trữ dữ liệu",
      content: "Thời gian lưu trữ dữ liệu:",
      items: [
        "Thông tin cá nhân: 5 năm sau lần tương tác cuối",
        "Dữ liệu giao dịch: 10 năm theo quy định pháp luật",
        "Dữ liệu cookie: Tối đa 2 năm",
        "Log hệ thống: 1 năm"
      ]
    },
    {
      id: 8,
      title: "8. Liên hệ về bảo mật",
      content: "Nếu có thắc mắc về chính sách bảo mật, vui lòng liên hệ:",
      items: [
        "Email: privacy@webbinggreenvina.com",
        "Điện thoại: 028 1234 5678",
        "Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM",
        "Thời gian làm việc: 8:00 - 17:00 từ Thứ 2 đến Thứ 6"
      ]
    }
  ];

  if (isLoading) return <PrivacySkeleton />;

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
            <li className="font-medium text-gray-900">Chính sách bảo mật</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Chính Sách Bảo Mật
              </h1>
              <p className="text-gray-600">
                Cam kết bảo vệ thông tin cá nhân của bạn
              </p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              GDPR Compliant
            </span>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Cập nhật: {lastUpdated}
            </div>
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Dữ liệu được mã hóa SSL
            </div>
          </div>
        </div>

        {/* Security Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">SSL</div>
            <div className="text-xs text-gray-600">Mã hóa 256-bit</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">GDPR</div>
            <div className="text-xs text-gray-600">Tuân thủ Châu Âu</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">24/7</div>
            <div className="text-xs text-gray-600">Giám sát an ninh</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">2FA</div>
            <div className="text-xs text-gray-600">Xác thực 2 lớp</div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
          {sections.map((section, idx) => (
            <motion.section
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="mb-10 last:mb-0"
            >
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-blue-800 font-bold">{idx + 1}</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  {section.title}
                </h2>
              </div>
              
              {section.content && (
                <p className="text-gray-700 mb-4 ml-12 leading-relaxed">
                  {section.content}
                </p>
              )}
              
              {section.items && (
                <ul className="space-y-3 ml-12">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.section>
          ))}
        </div>

        {/* Data Control Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
            Kiểm Soát Dữ Liệu Của Bạn
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Tải xuống dữ liệu</h4>
              <p className="text-gray-600 text-sm mb-4">Xuất tất cả thông tin cá nhân của bạn</p>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Xuất dữ liệu
              </button>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Xóa tài khoản</h4>
              <p className="text-gray-600 text-sm mb-4">Xóa vĩnh viễn tất cả dữ liệu cá nhân</p>
              <button className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                Xóa tài khoản
              </button>
            </div>
          </div>
        </motion.div>

        {/* Related Links */}
        <div className="mt-8">
          <h4 className="font-medium text-gray-900 mb-4">Tài liệu liên quan</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dieu-khoan">
              <div className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
                <div className="text-blue-600 font-medium">Điều khoản dịch vụ</div>
              </div>
            </Link>
            <Link href="/cookies">
              <div className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
                <div className="text-blue-600 font-medium">Chính sách Cookies</div>
              </div>
            </Link>
            <Link href="/lien-he">
              <div className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
                <div className="text-blue-600 font-medium">Liên hệ DPO</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicy;