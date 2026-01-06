"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FacebookFilled,
  YoutubeFilled,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  MessageOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";

interface FooterProps {
  config: any;
}

export default function Footer({ config }: FooterProps) {
  if (!config) return null;

  return (
    <footer className="bg-[#3f3f3f] text-gray-300 mt-6">
      {/* ===== MAIN FOOTER CONTENT ===== */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-8 md:gap-10 lg:gap-12">
          
          {/* ===== COLUMN 1: LOGO & DESCRIPTION ===== */}
          <div className="md:w-1/3 lg:w-2/5 space-y-4 md:space-y-6">
            {config.logo && (
              <div className="w-48 md:w-60 lg:w-72">
                <Image
                  src={config.logo}
                  alt={config.name}
                  width={280}
                  height={120}
                  className="object-contain w-full h-auto"
                  priority
                />
              </div>
            )}

            <h3 className="font-semibold text-white text-lg md:text-xl">
              {config.name || "ECO Electronics"}
            </h3>

            <p className="text-sm md:text-base leading-relaxed">
              Công Ty TNHH Điện Tử ECO là cửa hàng chuyên cung cấp các sản phẩm
              phần cứng Điện tử & Robot: Mạch lập trình, Module chức năng,
              Cảm biến, động cơ, Bánh xe, Khung Robot,...
            </p>

            {/* SOCIAL LINKS - Mobile hiển thị ở đây */}
            <div className="flex flex-col gap-3 pt-4 md:hidden">
              <Link
                href={config.youtube || "#"}
                target="_blank"
                className="flex items-center justify-center gap-3 bg-white text-black px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition-colors"
              >
                <YoutubeFilled className="text-red-600 text-lg" />
                <span className="font-medium">YouTube</span>
              </Link>

              <Link
                href={config.facebook || "#"}
                target="_blank"
                className="flex items-center justify-center gap-3 bg-[#1877F2] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors"
              >
                <FacebookFilled className="text-lg" />
                <span className="font-medium">Facebook</span>
              </Link>
            </div>
          </div>

          {/* ===== COLUMN 2: CONTACT INFO ===== */}
          <div className="md:w-1/2 lg:w-2/5 space-y-4 md:space-y-6">
            <h3 className="font-semibold text-white uppercase text-base md:text-lg mb-2 md:mb-4">
              Thông tin liên hệ
            </h3>

            <div className="space-y-3 md:space-y-4">
              {/* Địa chỉ */}
              {(config.showAddress ?? true) && (
                <div className="flex gap-3 items-start">
                  <EnvironmentOutlined className="mt-1 flex-shrink-0" />
                  <span className="text-sm md:text-base">
                    {config.address ??
                      "269/20 Lý Thường Kiệt, Phường Phú Thọ, TP.HCM"}
                  </span>
                </div>
              )}

              {/* Email */}
              {(config.showEmail ?? true) && (
                <div className="flex gap-3 items-center">
                  <MailOutlined className="flex-shrink-0" />
                  <span className="text-sm md:text-base break-all">
                    {config.email ?? "contact.hshopvn@gmail.com"}
                  </span>
                </div>
              )}

              {/* Hotline */}
              {(config.showMobile ?? true) && (
                <div className="flex gap-3 items-center">
                  <PhoneOutlined className="flex-shrink-0" />
                  <span className="text-sm md:text-base font-medium">
                    Hotline: {config.mobile ?? "028.6670.4455"}
                  </span>
                </div>
              )}

              {/* ZALO OA */}
              <div className="flex gap-3 items-center">
                <MessageOutlined className="flex-shrink-0" />
                <span className="text-sm md:text-base">
                  Zalo OA: <strong>Hshopvn</strong> – Điện tử và Robot
                </span>
              </div>

              {/* ZALO Bán hàng */}
              <div className="flex gap-3 items-center">
                <CustomerServiceOutlined className="flex-shrink-0" />
                <span className="text-sm md:text-base">
                  Zalo Bán Hàng: <strong>0938.022.500</strong> – <strong>0934.022.500</strong>
                </span>
              </div>

              {/* ZALO Kỹ thuật */}
              <div className="flex gap-3 items-center">
                <CustomerServiceOutlined className="flex-shrink-0" />
                <span className="text-sm md:text-base">
                  Zalo Kỹ Thuật: <strong>0968.022.500</strong> (nhắn tin)
                </span>
              </div>

              {/* Lưu ý */}
              <div className="pt-3 md:pt-4 border-t border-gray-600">
                <p className="text-xs md:text-sm text-gray-400 italic">
                  Xin Quý Khách ưu tiên nhắn tin qua Zalo/Facebook giúp Hshop
                  có thời gian tra cứu và trả lời chính xác.
                </p>
              </div>
            </div>
          </div>

          {/* ===== COLUMN 3: SOCIAL LINKS - Desktop ===== */}
          <div className="hidden md:flex flex-col gap-4 lg:gap-6 items-start md:w-1/3 lg:w-1/5">
            <Link
              href={config.youtube || "#"}
              target="_blank"
              className="flex items-center gap-3 bg-white text-black px-5 py-3 rounded-lg shadow hover:bg-gray-100 transition-colors w-full justify-center md:justify-start"
            >
              <YoutubeFilled className="text-red-600 text-xl" />
              <span className="font-medium">YouTube</span>
            </Link>

            <Link
              href={config.facebook || "#"}
              target="_blank"
              className="flex items-center gap-3 bg-[#1877F2] text-white px-5 py-3 rounded-lg shadow hover:bg-blue-700 transition-colors w-full justify-center md:justify-start"
            >
              <FacebookFilled className="text-xl" />
              <span className="font-medium">Facebook</span>
            </Link>

            {/* Quick Links */}
            <div className="pt-4 md:pt-6">
              <h4 className="font-semibold text-white mb-3">Liên kết nhanh</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/san-pham" className="text-gray-300 hover:text-white text-sm">
                    Sản phẩm
                  </Link>
                </li>
                <li>
                  <Link href="/tin-tuc" className="text-gray-300 hover:text-white text-sm">
                    Tin tức
                  </Link>
                </li>
                <li>
                  <Link href="/lien-he" className="text-gray-300 hover:text-white text-sm">
                    Liên hệ
                  </Link>
                </li>
                <li>
                  <Link href="/chinh-sach-bao-mat" className="text-gray-300 hover:text-white text-sm">
                    Chính sách bảo mật
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM BAR ===== */}
      <div className="border-t border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} {config.name || "ECO Electronics"}. All rights reserved.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link 
                href="/dieu-khoan-dich-vu" 
                className="text-gray-400 hover:text-white text-sm"
              >
                Điều khoản dịch vụ
              </Link>
              <Link 
                href="/chinh-sach-bao-mat" 
                className="text-gray-400 hover:text-white text-sm"
              >
                Chính sách bảo mật
              </Link>
              <Link 
                href="/chinh-sach-doi-tra" 
                className="text-gray-400 hover:text-white text-sm"
              >
                Chính sách đổi trả
              </Link>
              <Link 
                href="/lien-he" 
                className="text-gray-400 hover:text-white text-sm"
              >
                Liên hệ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}