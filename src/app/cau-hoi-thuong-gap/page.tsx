'use client';

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Định nghĩa Type và Dữ liệu (có thể tách ra file riêng sau) ---
type FAQItem = {
  id: number;
  question: string;
  answer: string;
  category?: string; // Để mở rộng phân loại FAQ nếu cần
};

// --- Component Skeleton Loading ---
const FAQSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      {/* Skeleton cho tiêu đề */}
      <div className="h-8 w-48 bg-gray-200 rounded-lg mx-auto mb-10 animate-pulse"></div>
      
      {/* Skeleton cho các câu hỏi */}
      <div className="space-y-4">
        {[...Array(5)].map((_, idx) => (
          <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
            {/* Skeleton cho câu hỏi */}
            <div className="p-5 flex justify-between items-center">
              <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Component FAQ Item riêng biệt để tối ưu render ---
const FAQListItem = React.memo(({ 
  item, 
  isOpen, 
  onClick 
}: { 
  item: FAQItem; 
  isOpen: boolean; 
  onClick: () => void;
}) => {
  return (
    <motion.div 
      layout 
      className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200 bg-white"
    >
      <motion.button
        onClick={onClick}
        className="w-full text-left p-5 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-gray-800 pr-4 text-lg">{item.question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 ml-2"
        >
          <svg 
            className={`w-6 h-6 transition-colors ${isOpen ? 'text-blue-600' : 'text-gray-400'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.span>
      </motion.button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key={`answer-${item.id}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-2 text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});
FAQListItem.displayName = 'FAQListItem';

// --- Component chính FAQ ---
const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Mở sẵn câu đầu tiên
  const [isLoading, setIsLoading] = useState(true);
  const [faqData, setFaqData] = useState<FAQItem[]>([]);

  // Giả lập fetch data (trong thực tế sẽ thay bằng API call)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Đây là dữ liệu mẫu, bạn có thể thay thế bằng fetch API
      const sampleData: FAQItem[] = [
        {
          id: 1,
          question: 'Làm thế nào để đăng ký chương trình khách hàng thân thiết?',
          answer: 'Bạn có thể đăng ký trực tiếp tại cửa hàng hoặc trên website của chúng tôi bằng cách điền vào mẫu đăng ký khách hàng thân thiết. Sau khi đăng ký, bạn sẽ nhận được thẻ thành viên và có thể tích điểm ngay trong lần mua hàng đầu tiên.',
        },
        {
          id: 2,
          question: 'Tôi có thể tích điểm như thế nào?',
          answer: 'Mỗi đơn hàng bạn mua sẽ được tích điểm dựa trên giá trị thanh toán. Cứ 10,000 VNĐ sẽ được tích 1 điểm. Điểm sẽ được cập nhật tự động vào tài khoản của bạn trong vòng 24 giờ sau khi giao dịch hoàn tất.',
        },
        {
          id: 3,
          question: 'Điểm tích lũy có thời hạn sử dụng không?',
          answer: 'Có, điểm tích lũy sẽ có hiệu lực trong vòng 12 tháng kể từ ngày ghi nhận điểm. Bạn có thể kiểm tra hạn sử dụng điểm trong mục "Tài khoản" trên website hoặc ứng dụng của chúng tôi.',
        },
        {
          id: 4,
          question: 'Tôi có thể đổi điểm lấy quà gì?',
          answer: 'Bạn có thể đổi điểm lấy nhiều phần quà hấp dẫn hoặc phiếu giảm giá tùy theo chương trình hiện tại. Danh mục quà tặng được cập nhật thường xuyên và hiển thị tại quầy lễ tân hoặc trong mục "Đổi quà" trên ứng dụng.',
        },
        {
          id: 5,
          question: 'Làm sao để liên hệ bộ phận chăm sóc khách hàng?',
          answer: 'Bạn có thể gọi hotline 1800-xxxx (miễn phí) từ 8:00 đến 17:00 các ngày trong tuần, hoặc gửi email tới địa chỉ support@company.com. Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.',
        },
      ];
      setFaqData(sampleData);
      setIsLoading(false);
    }, 800); // Giả lập thời gian tải

    return () => clearTimeout(timer);
  }, []);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Hiển thị Skeleton khi đang tải
  if (isLoading) {
    return <FAQSkeleton />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 my-8 md:my-12">
      {/* Tiêu đề với animation */}
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-800"
      >
        Câu hỏi thường gặp (FAQ)
      </motion.h2>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-gray-600 text-center mb-10 max-w-2xl mx-auto text-lg"
      >
        Tìm câu trả lời cho những thắc mắc phổ biến nhất về sản phẩm, dịch vụ và chính sách của chúng tôi.
      </motion.p>

      {/* Danh sách FAQ */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4"
      >
        <AnimatePresence initial={false}>
          {faqData.map((item) => (
            <FAQListItem
              key={item.id}
              item={item}
              isOpen={openIndex === item.id}
              onClick={() => toggleIndex(item.id)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Phần hỗ trợ thêm */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 text-center"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Vẫn chưa tìm thấy câu trả lời?</h3>
        <p className="text-gray-600 mb-4">Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Liên hệ hỗ trợ
          </button>
          <button className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
            Xem Hướng dẫn sử dụng
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Component Wrapper với Suspense ---
const FAQWrapper: React.FC = () => {
  return (
    <Suspense fallback={<FAQSkeleton />}>
      <FAQ />
    </Suspense>
  );
};

export default FAQWrapper;