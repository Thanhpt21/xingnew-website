// components/CompanyInfo.tsx
"use client";

import { motion } from "framer-motion";
import { 
  InfoCircleOutlined, 
  YoutubeFilled, 
  FacebookFilled,
  ShopOutlined,
  UserOutlined,
  CheckCircleOutlined,
  GiftOutlined
} from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";

export default function CompanyInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-gray-50 rounded-xl p-6 border border-gray-200"
    >
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
          <ShopOutlined className="text-white text-xl" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">ECO Electronics</h3>
          <p className="text-sm text-gray-600">Công Ty TNHH Điện Tử ECO</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Mô tả công ty */}
        <p className="text-sm text-gray-700 leading-relaxed">
          Cửa hàng chuyên cung cấp các sản phẩm phần cứng Điện tử & Robot: 
          Mạch lập trình, Module chức năng, Cảm biến, động cơ, Bánh xe, Khung Robot,...
        </p>

        {/* Social Media */}
        <div className="flex gap-3 pt-2">
          <Link
            href="https://youtube.com"
            target="_blank"
            className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors flex-1 justify-center"
          >
            <YoutubeFilled className="text-lg" />
            <span className="font-medium text-sm">YouTube</span>
          </Link>

          <Link
            href="https://facebook.com"
            target="_blank"
            className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors flex-1 justify-center"
          >
            <FacebookFilled className="text-lg" />
            <span className="font-medium text-sm">Facebook</span>
          </Link>
        </div>

      </div>
    </motion.div>
  );
}