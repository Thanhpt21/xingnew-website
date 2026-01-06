// components/ContactInfo.tsx
"use client";

import { motion } from "framer-motion";
import { 
  PhoneOutlined, 
  MessageOutlined, 
  CustomerServiceOutlined,
  EnvironmentOutlined,
  MailOutlined,
  ClockCircleOutlined 
} from "@ant-design/icons";

export default function ContactInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 shadow-md border border-blue-100"
    >
      <h3 className="text-lg font-bold text-gray-900 mb-4">Hỗ trợ trực tiếp</h3>
      <div className="space-y-4">
        {/* Địa chỉ */}
        <div className="flex items-start">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
            <EnvironmentOutlined className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Địa chỉ</p>
            <p className="font-semibold text-gray-900 text-sm">
              269/20 Lý Thường Kiệt, Phường Phú Thọ, TP.HCM
            </p>
          </div>
        </div>

        {/* Hotline */}
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
            <PhoneOutlined className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Hotline</p>
            <p className="font-semibold text-gray-900">028.6670.4455</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
            <MailOutlined className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-semibold text-gray-900">contact.hshopvn@gmail.com</p>
          </div>
        </div>

        {/* Zalo Bán hàng */}
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
            <CustomerServiceOutlined className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Zalo Bán Hàng</p>
            <p className="font-semibold text-gray-900">0938.022.500 - 0934.022.500</p>
          </div>
        </div>

        {/* Zalo Kỹ thuật */}
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
            <CustomerServiceOutlined className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Zalo Kỹ Thuật</p>
            <p className="font-semibold text-gray-900">0968.022.500 (nhắn tin)</p>
          </div>
        </div>

        {/* Zalo OA */}
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
            <MessageOutlined className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Zalo OA</p>
            <p className="font-semibold text-gray-900">Hshopvn - Điện tử và Robot</p>
          </div>
        </div>

        {/* Lưu ý */}
        <div className="pt-4 border-t border-blue-200">
          <p className="text-xs text-blue-600 italic">
            <span className="font-semibold">Lưu ý:</span> Ưu tiên nhắn tin qua Zalo/Facebook để được hỗ trợ nhanh chóng và chính xác.
          </p>
        </div>
      </div>
    </motion.div>
  );
}