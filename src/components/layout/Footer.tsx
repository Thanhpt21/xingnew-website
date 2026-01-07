"use client";

import Image from "next/image";
import Link from "next/link";
import {
  YoutubeFilled,
  FacebookFilled,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  MessageOutlined,
} from "@ant-design/icons";

interface FooterProps {
  config: any;
}

export default function Footer({ config }: FooterProps) {
  if (!config) return null;

  return (
    <footer className="bg-white border-t border-gray-300 mt-12">
      {/* ===== MAIN FOOTER CONTENT ===== */}
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          
          {/* ===== COLUMN 1: LOGO & DESCRIPTION ===== */}
          <div className="space-y-6">
            {config.logo && (
              <div className="w-56 md:w-64">
                <Image
                  src={config.logo}
                  alt={config.name || "Xing New"}
                  width={300}
                  height={120}
                  className="object-contain w-full h-auto"
                  priority
                />
              </div>
            )}

            <h3 className="font-bold text-2xl text-gray-900">
              {config.name || "Xing New"}
            </h3>

            <p className="text-gray-800 leading-relaxed text-base font-medium">
              Công ty TNHH Xing New chuyên phân phối giấy in nhiệt, giấy in mã vạch, băng keo công nghiệp và các vật tư in ấn chất lượng cao, nguồn gốc rõ ràng, giá cả cạnh tranh.
            </p>

            {/* SOCIAL LINKS - Hiển thị cả mobile & desktop */}
            <div className="flex gap-4 pt-4">
              {config.youtube && (
                <Link
                  href={config.youtube}
                  target="_blank"
                  className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-all duration-300 group border border-gray-300"
                >
                  <YoutubeFilled className="text-2xl text-gray-900 group-hover:text-red-600" />
                </Link>
              )}

              {config.facebook && (
                <Link
                  href={config.facebook}
                  target="_blank"
                  className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-all duration-300 group border border-gray-300"
                >
                  <FacebookFilled className="text-2xl text-gray-900 group-hover:text-blue-600" />
                </Link>
              )}
            </div>
          </div>

          {/* ===== COLUMN 2: CONTACT INFO ===== */}
          <div className="space-y-6">
            <h3 className="font-bold text-xl text-gray-900 uppercase tracking-wide">
              Thông tin liên hệ
            </h3>

            <div className="space-y-4">
              {(config.showAddress ?? true) && (
                <div className="flex items-start gap-4">
                  <EnvironmentOutlined className="text-gray-800 text-lg mt-0.5 flex-shrink-0 font-semibold" />
                  <span className="text-gray-800 font-medium">
                    {config.address || "269/20 Lý Thường Kiệt, Phường Phú Thọ, TP. Thủ Dầu Một, Bình Dương"}
                  </span>
                </div>
              )}

              {(config.showEmail ?? true) && (
                <div className="flex items-center gap-4">
                  <MailOutlined className="text-gray-800 text-lg flex-shrink-0 font-semibold" />
                  <a href={`mailto:${config.email}`} className="text-gray-800 font-medium hover:text-gray-900 transition-colors">
                    {config.email || "contact@xingnew.vn"}
                  </a>
                </div>
              )}

              {(config.showMobile ?? true) && (
                <div className="flex items-center gap-4">
                  <PhoneOutlined className="text-gray-800 text-lg flex-shrink-0 font-semibold" />
                  <a href={`tel:${config.mobile}`} className="text-gray-900 font-bold hover:text-gray-700 transition-colors">
                    {config.mobile || "0903 776 456"}
                  </a>
                </div>
              )}

              <div className="flex items-center gap-4">
                <MessageOutlined className="text-gray-800 text-lg flex-shrink-0 font-semibold" />
                <span className="text-gray-800 font-medium">
                  Zalo OA: <strong className="text-gray-900">XingNew</strong>
                </span>
              </div>

              <div className="pt-4 border-t border-gray-300">
                <p className="text-sm text-gray-700 font-medium italic">
                  Ưu tiên liên hệ qua Zalo/Facebook để được hỗ trợ nhanh nhất.
                </p>
              </div>
            </div>
          </div>

          {/* ===== COLUMN 3: QUICK LINKS & INFO ===== */}
          <div className="space-y-6">
            <h3 className="font-bold text-xl text-gray-900 uppercase tracking-wide">
              Liên kết nhanh
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <Link href="/san-pham" className="text-gray-800 font-medium hover:text-gray-900 transition-colors hover:underline">
                Sản phẩm
              </Link>
              <Link href="/tin-tuc" className="text-gray-800 font-medium hover:text-gray-900 transition-colors hover:underline">
                Tin tức
              </Link>
              <Link href="/gioi-thieu" className="text-gray-800 font-medium hover:text-gray-900 transition-colors hover:underline">
                Giới thiệu
              </Link>
              <Link href="/lien-he" className="text-gray-800 font-medium hover:text-gray-900 transition-colors hover:underline">
                Liên hệ
              </Link>
              <Link href="/chinh-sach-doi-tra" className="text-gray-800 font-medium hover:text-gray-900 transition-colors hover:underline">
                Chính sách đổi trả
              </Link>
              <Link href="/chinh-sach-bao-mat" className="text-gray-800 font-medium hover:text-gray-900 transition-colors hover:underline">
                Bảo mật thông tin
              </Link>
            </div>

            <div className="pt-6 border-t border-gray-300">
              <p className="text-sm text-gray-800 font-medium">
                <strong className="text-gray-900 font-bold">Giờ làm việc:</strong> Thứ 2 - Thứ 7: 8:00 - 17:30
              </p>
              <p className="text-sm text-gray-800 font-medium mt-2">
                Chủ nhật & Lễ: Nghỉ
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM BAR ===== */}
      <div className="border-t border-gray-300 bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-gray-800 font-medium">
              © {new Date().getFullYear()} {config.name || "Xing New"}. Tất cả quyền được bảo lưu.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/dieu-khoan-dich-vu" className="text-gray-800 font-medium hover:text-gray-900 transition-colors hover:underline">
                Điều khoản dịch vụ
              </Link>
              <Link href="/chinh-sach-bao-mat" className="text-gray-800 font-medium hover:text-gray-900 transition-colors hover:underline">
                Chính sách bảo mật
              </Link>
              <Link href="/chinh-sach-doi-tra" className="text-gray-800 font-medium hover:text-gray-900 transition-colors hover:underline">
                Chính sách đổi trả
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}