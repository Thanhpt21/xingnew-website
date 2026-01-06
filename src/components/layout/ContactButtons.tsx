'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface ContactButtonsProps {
  config: {
    mobile?: string;
    zalo?: string;
  };
}

const ContactButtons: React.FC<ContactButtonsProps> = ({ config }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  // Lấy thông tin từ config
  const zaloPhone = config?.zalo || '0909123456';
  const hotline = config?.mobile || '0909123456';
  const zaloLink = `https://zalo.me/${zaloPhone.replace(/\D/g, '')}`;

  return (
    <div className="fixed bottom-20 right-4 md:bottom-20 md:right-6 flex flex-col items-end space-y-2 z-50">
      <AnimatePresence>
        {/* Nút Zalo với tooltip */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative"
            onMouseEnter={() => setHoveredButton('zalo')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            {/* Tooltip */}
            <AnimatePresence>
              {hoveredButton === 'zalo' && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="absolute right-full mr-2 top-1/2 -translate-y-1/2"
                >
                  <div className="bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                      <span>Chat Zalo: {zaloPhone}</span>
                    </div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.a
              href={zaloLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ 
                scale: 1.15,
                rotate: 5,
                boxShadow: "0px 10px 25px rgba(0, 180, 42, 0.4)"
              }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center justify-center p-3 bg-gradient-to-br from-green-500 via-green-600 to-emerald-700 rounded-full shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
            >
              {/* Hiệu ứng glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Icon Zalo từ public */}
              <div className="relative z-10 w-6 h-6">
                <Image
                  src="/image/zalo-icon.png" // Đường dẫn tuyệt đối từ public
                  alt="Zalo"
                  width={24}
                  height={24}
                  className="object-contain"
                  unoptimized={true} // Thêm nếu cần
                />
              </div>
            </motion.a>
          </motion.div>
        )}

        {/* Nút Gọi điện với tooltip */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.05 }}
            className="relative"
            onMouseEnter={() => setHoveredButton('phone')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            {/* Tooltip */}
            <AnimatePresence>
              {hoveredButton === 'phone' && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="absolute right-full mr-2 top-1/2 -translate-y-1/2"
                >
                  <div className="bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                      <span>Gọi ngay: {hotline}</span>
                    </div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.a
              href={`tel:${hotline}`}
              whileHover={{ 
                scale: 1.15,
                rotate: -5,
                boxShadow: "0px 10px 25px rgba(37, 99, 235, 0.4)"
              }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center justify-center p-3 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-full shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
            >
              {/* Hiệu ứng glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Icon Phone từ public */}
              <div className="relative z-10 w-6 h-6">
                <Image
                  src="/image/phone-icon.png" // Đường dẫn tuyệt đối từ public
                  alt="Gọi điện"
                  width={24}
                  height={24}
                  className="object-contain"
                  unoptimized={true} // Thêm nếu cần
                />
              </div>
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nút chính để mở/đóng */}
      <motion.div
        onMouseEnter={() => setHoveredButton('main')}
        onMouseLeave={() => setHoveredButton(null)}
        className="relative"
      >
        {/* Tooltip cho nút chính */}
        <AnimatePresence>
          {hoveredButton === 'main' && !isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="absolute right-full mr-2 top-1/2 -translate-y-1/2"
            >
              <div className="bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                <span>Liên hệ nhanh</span>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="flex items-center justify-center p-3.5 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-full shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group"
        >
          {/* Hiệu ứng gradient động */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-pink-500/30 to-rose-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
          
          {/* Icon +/x với animation mượt hơn */}
          <div className="relative z-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              {isExpanded ? (
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              )}
            </svg>
          </div>
        </motion.button>
      </motion.div>

      {/* Hiệu ứng nền lan tỏa tinh tế hơn */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 0.6, scale: 2 }}
          exit={{ opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-xl"
        />
      )}
    </div>
  );
};

export default ContactButtons;