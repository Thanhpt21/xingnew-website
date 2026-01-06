'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';

// ========== COMPONENT SKELETON LOADING ==========
const LoyaltyPolicySkeleton: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 my-8 md:my-12 animate-pulse">
      {/* Skeleton tiêu đề */}
      <div className="h-10 w-64 bg-gray-200 rounded-lg mx-auto mb-8"></div>
      
      {/* Skeleton các phần */}
      {[...Array(4)].map((_, idx) => (
        <div key={idx} className="mb-8">
          {/* Skeleton tiêu đề phần */}
          <div className="h-7 w-48 bg-gray-200 rounded mb-4"></div>
          
          {/* Skeleton nội dung */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
          
          {/* Skeleton danh sách */}
          {idx >= 1 && idx <= 2 && (
            <div className="mt-4 space-y-2 ml-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="h-2 w-2 bg-gray-200 rounded-full mr-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ========== COMPONENT CHÍNH ==========
const LoyaltyPolicy: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Giả lập loading (thực tế có thể là fetch data)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Dữ liệu cấu trúc để dễ quản lý
  const policySections = [
    {
      id: 1,
      title: "1. Giới thiệu",
      content: "Chương trình khách hàng thân thiết của chúng tôi được thiết kế để tri ân và giữ gìn mối quan hệ lâu dài với khách hàng. Khách hàng thân thiết sẽ được hưởng nhiều ưu đãi hấp dẫn và dịch vụ chăm sóc đặc biệt.",
      isList: false,
    },
    {
      id: 2,
      title: "2. Cách thức tham gia",
      content: null,
      isList: true,
      items: [
        "Đăng ký trở thành khách hàng thân thiết tại cửa hàng hoặc qua website.",
        "Mỗi lần mua hàng, khách hàng sẽ được tích điểm dựa trên giá trị đơn hàng.",
        "Điểm tích lũy có thể sử dụng để đổi quà hoặc giảm giá trong các lần mua tiếp theo.",
        "Điểm sẽ được tích tự động sau khi đơn hàng được xác nhận thành công."
      ]
    },
    {
      id: 3,
      title: "3. Quyền lợi khách hàng thân thiết",
      content: null,
      isList: true,
      items: [
        "Ưu đãi giảm giá đặc biệt cho các sản phẩm chọn lọc.",
        "Quà tặng sinh nhật và các dịp lễ tết đặc biệt.",
        "Thông báo sớm về các chương trình khuyến mãi và sự kiện độc quyền.",
        "Dịch vụ chăm sóc khách hàng ưu tiên 24/7.",
        "Quyền truy cập sớm vào các sản phẩm mới trước khi ra mắt chính thức.",
        "Miễn phí vận chuyển cho đơn hàng từ 500.000 VNĐ trở lên."
      ]
    },
    {
      id: 4,
      title: "4. Điều khoản và điều kiện",
      content: "Điểm tích lũy có giá trị trong vòng 12 tháng kể từ ngày được ghi nhận. Chúng tôi có quyền thay đổi các điều khoản của chương trình mà không cần báo trước. Mọi quyết định của công ty là cuối cùng. Nếu có thắc mắc hoặc cần hỗ trợ, vui lòng liên hệ với bộ phận chăm sóc khách hàng của chúng tôi.",
      isList: false,
    }
  ];

  if (isLoading) {
    return <LoyaltyPolicySkeleton />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-4 md:p-8 my-8 md:my-12"
    >
      {/* Header với badge */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center mb-4">
          <span className="px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold rounded-full">
            CHƯƠNG TRÌNH ƯU ĐÃI
          </span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Chính Sách Khách Hàng Thân Thiết
        </h1>
        
        <p className="text-gray-600 max-w-2xl mx-auto">
          Tham gia chương trình để nhận nhiều ưu đãi đặc biệt và trải nghiệm dịch vụ tốt nhất
        </p>
        
        {/* Stats hoặc highlights */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">1:1</div>
            <div className="text-sm text-gray-600">Tỷ lệ tích điểm</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-sm text-gray-600">Tháng hiệu lực</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">24/7</div>
            <div className="text-sm text-gray-600">Hỗ trợ ưu tiên</div>
          </div>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
        {policySections.map((section, idx) => (
          <motion.section 
            key={section.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="mb-8 last:mb-0"
          >
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-4 mt-1">
                <span className="text-white font-bold">{idx + 1}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                {section.title}
              </h2>
            </div>
            
            {section.isList ? (
              <ul className="space-y-3 ml-12">
                {section.items?.map((item, itemIdx) => (
                  <motion.li 
                    key={itemIdx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: itemIdx * 0.05 }}
                    className="flex items-start"
                  >
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-gray-700 ml-12 leading-relaxed"
              >
                {section.content}
              </motion.p>
            )}
          </motion.section>
        ))}
      </div>

      {/* Call to action */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100"
      >
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Sẵn sàng tham gia?</h3>
            <p className="text-gray-600">
              Đăng ký ngay để bắt đầu tích điểm và nhận ưu đãi
            </p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Đăng ký ngay
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-white transition-all focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Xem thêm FAQ
            </motion.button>
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
};

// ========== WRAPPER COMPONENT VỚI SUSPENSE ==========
const LoyaltyPolicyWrapper: React.FC = () => {
  return (
    <Suspense fallback={<LoyaltyPolicySkeleton />}>
      <LoyaltyPolicy />
    </Suspense>
  );
};

export default LoyaltyPolicyWrapper;