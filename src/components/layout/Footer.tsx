"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  Youtube, 
  Facebook, 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle,
  Instagram 
} from "lucide-react";

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
              <div className="w-80 md:w-200">
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
                  <Youtube className="w-6 h-6 text-gray-900 group-hover:text-red-600" />
                </Link>
              )}

              {config.facebook && (
                <Link
                  href={config.facebook}
                  target="_blank"
                  className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-all duration-300 group border border-gray-300"
                >
                  <Facebook className="w-6 h-6 text-gray-900 group-hover:text-blue-600" />
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
                  <MapPin className="w-5 h-5 text-gray-800 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-800 font-medium">
                    {config.address || "269/20 Lý Thường Kiệt, Phường Phú Thọ, TP. Thủ Dầu Một, Bình Dương"}
                  </span>
                </div>
              )}

              {(config.showEmail ?? true) && (
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-gray-800 flex-shrink-0" />
                  <a href={`mailto:${config.email}`} className="text-gray-800 font-medium hover:text-gray-900 transition-colors">
                    {config.email || "contact@xingnew.vn"}
                  </a>
                </div>
              )}

              {(config.showMobile ?? true) && (
                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-gray-800 flex-shrink-0" />
                  <a href={`tel:${config.mobile}`} className="text-gray-900 font-bold hover:text-gray-700 transition-colors">
                    {config.mobile || "0903 776 456"}
                  </a>
                </div>
              )}

              <div className="flex items-center gap-4">
                <MessageCircle className="w-5 h-5 text-gray-800 flex-shrink-0" />
                <span className="text-gray-800 font-medium">
                  Zalo: <strong className="text-gray-900">(XingNew) {config.mobile || "0903 776 456"}</strong>
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
            </div>

            <div className="pt-6 border-t border-gray-300">
              <p className="text-sm text-gray-800 font-medium">
                <strong className="text-gray-900 font-bold">Giờ làm việc:</strong> Thứ 2 - Thứ 7: 8:00 - 17:30
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

            <div className="flex flex-wrap justify-center gap-4">
              {/* Facebook */}
              {config.facebook && (
                <Link
                  href={config.facebook}
                  target="_blank"
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-200 transition"
                >
                  <Facebook className="w-5 h-5 text-blue-600" />
                </Link>
              )}

              {/* TikTok */}
              {config.tiktok && (
                <Link
                  href={config.tiktok}
                  target="_blank"
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-200 transition"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 text-black"
                  >
                    <path d="M21 8.5c-1.5 0-3-.5-4.2-1.4v7.3c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6c.4 0 .8 0 1.2.1v3.1c-.4-.1-.8-.2-1.2-.2-1.6 0-2.9 1.3-2.9 2.9s1.3 2.9 2.9 2.9 3-1.3 3-2.9V2h3.2c.3 2.3 2.2 4.1 4.6 4.3v2.2z" />
                  </svg>
                </Link>
              )}

              {/* Instagram */}
              {config.instagram && (
                <Link
                  href={config.instagram}
                  target="_blank"
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-200 transition"
                >
                  <Instagram className="w-5 h-5 text-pink-600" />
                </Link>
              )}

              {/* YouTube */}
              {config.youtube && (
                <Link
                  href={config.youtube}
                  target="_blank"
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-200 transition"
                >
                  <Youtube className="w-5 h-5 text-red-600" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}