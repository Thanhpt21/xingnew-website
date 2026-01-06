// app/dieu-khoan/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const TermsSkeleton = () => (
  <div className="max-w-4xl mx-auto p-4 md:p-8 animate-pulse">
    <div className="h-10 bg-gray-200 rounded-lg mb-8"></div>
    {[...Array(8)].map((_, idx) => (
      <div key={idx} className="mb-6">
        <div className="h-6 bg-gray-200 rounded w-64 mb-3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    ))}
  </div>
);

const TermsOfService = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    // Giả lập loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      setLastUpdated(new Date().toLocaleDateString('vi-VN'));
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const sections = [
    {
      id: 1,
      title: "1. Giới thiệu",
      content: "Chào mừng bạn đến với website của chúng tôi. Bằng việc truy cập và sử dụng website này, bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và điều kiện sử dụng được nêu dưới đây."
    },
    {
      id: 2,
      title: "2. Định nghĩa",
      content: "'Website' đề cập đến webbinggreenvina.com và tất cả các trang con. 'Người dùng', 'bạn', 'khách hàng' đề cập đến bất kỳ cá nhân hoặc tổ chức nào truy cập và sử dụng website."
    },
    {
      id: 3,
      title: "3. Quyền sở hữu trí tuệ",
      content: "Toàn bộ nội dung trên website bao gồm nhưng không giới hạn ở văn bản, hình ảnh, logo, biểu tượng, phần mềm đều là tài sản của chúng tôi và được bảo vệ bởi luật bản quyền. Mọi sao chép, phân phối đều cần có sự cho phép bằng văn bản.",
      items: [
        "Tất cả hình ảnh sản phẩm được bảo vệ bản quyền",
        "Nội dung mô tả sản phẩm không được sao chép",
        "Logo và thương hiệu là tài sản độc quyền"
      ]
    },
    {
      id: 4,
      title: "4. Sử dụng website",
      content: "Bạn được phép sử dụng website cho mục đích hợp pháp. Bạn không được:",
      items: [
        "Sử dụng robot, spider hoặc công cụ tự động để truy cập website",
        "Can thiệp vào hệ thống bảo mật của website",
        "Đăng tải nội dung vi phạm pháp luật",
        "Gửi spam hoặc nội dung độc hại"
      ]
    },
    {
      id: 5,
      title: "5. Đăng ký tài khoản",
      content: "Khi đăng ký tài khoản, bạn cam kết:",
      items: [
        "Cung cấp thông tin chính xác và đầy đủ",
        "Bảo mật thông tin đăng nhập",
        "Thông báo ngay khi phát hiện vi phạm bảo mật",
        "Chịu trách nhiệm cho mọi hoạt động từ tài khoản của bạn"
      ]
    },
    {
      id: 6,
      title: "6. Mua hàng và thanh toán",
      content: "Các điều khoản liên quan đến mua hàng:",
      items: [
        "Giá sản phẩm có thể thay đổi mà không cần báo trước",
        "Chúng tôi có quyền từ chối đơn hàng bất kỳ lúc nào",
        "Thanh toán phải được hoàn tất trước khi giao hàng",
        "Phí vận chuyển được tính riêng tùy khu vực"
      ]
    },
    {
      id: 7,
      title: "7. Bảo hành và trả hàng",
      content: "Chính sách bảo hành và trả hàng:",
      items: [
        "Sản phẩm được bảo hành theo quy định của nhà sản xuất",
        "Thời gian xử lý đổi trả: 7 ngày làm việc",
        "Sản phẩm trả lại phải còn nguyên tem mác",
        "Chi phí vận chuyển đổi trả do khách hàng chịu"
      ]
    },
    {
      id: 8,
      title: "8. Giới hạn trách nhiệm",
      content: "Chúng tôi không chịu trách nhiệm cho:",
      items: [
        "Thiệt hại gián tiếp hoặc hậu quả phát sinh",
        "Lỗi kỹ thuật ngoài tầm kiểm soát",
        "Hành vi sử dụng trái phép của người dùng",
        "Thông tin do bên thứ ba cung cấp"
      ]
    },
    {
      id: 9,
      title: "9. Thay đổi điều khoản",
      content: "Chúng tôi có quyền thay đổi các điều khoản này bất kỳ lúc nào. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải trên website. Bạn nên thường xuyên kiểm tra trang này để cập nhật."
    },
    {
      id: 10,
      title: "10. Luật áp dụng",
      content: "Các điều khoản này được điều chỉnh bởi luật pháp Việt Nam. Mọi tranh chấp sẽ được giải quyết tại tòa án có thẩm quyền tại Việt Nam."
    }
  ];

  if (isLoading) return <TermsSkeleton />;

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
            <li className="font-medium text-gray-900">Điều khoản dịch vụ</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Điều Khoản Dịch Vụ
            </h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              Văn bản pháp lý
            </span>
          </div>
          
          <p className="text-gray-600 mb-4">
            Vui lòng đọc kỹ các điều khoản trước khi sử dụng dịch vụ của chúng tôi
          </p>
          
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Cập nhật lần cuối: {lastUpdated}
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
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                {section.title}
              </h2>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                {section.content}
              </p>
              
              {section.items && (
                <ul className="space-y-3 ml-6">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start">
                      <svg className="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.section>
          ))}
        </div>

        {/* Acceptance Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Đồng ý với điều khoản?</h3>
              <p className="text-gray-600">
                Bằng việc sử dụng website, bạn đã đồng ý với tất cả các điều khoản trên
              </p>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Tôi đồng ý
              </button>
              <Link href="/lien-he">
                <button className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                  Liên hệ hỏi đáp
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Related Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/chinh-sach-bao-mat">
            <div className="p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
              <div className="text-blue-600 font-medium mb-2">→ Chính sách bảo mật</div>
              <p className="text-sm text-gray-600">Tìm hiểu cách chúng tôi bảo vệ thông tin của bạn</p>
            </div>
          </Link>
          <Link href="/cookies">
            <div className="p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
              <div className="text-blue-600 font-medium mb-2">→ Chính sách Cookies</div>
              <p className="text-sm text-gray-600">Hiểu cách chúng tôi sử dụng cookies</p>
            </div>
          </Link>
          <Link href="/lien-he">
            <div className="p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
              <div className="text-blue-600 font-medium mb-2">→ Liên hệ hỗ trợ</div>
              <p className="text-sm text-gray-600">Cần hỗ trợ thêm? Liên hệ với chúng tôi</p>
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default TermsOfService;