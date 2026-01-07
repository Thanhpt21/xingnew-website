
// ==================== NavBar.tsx ====================
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CategoryThreeLevelMenu } from "./CategoryThreeLevelMenu";

const NavBar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Đóng menu khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div className="bg-gray-800 hidden lg:block border-b border-gray-700 will-change-transform">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex items-center h-14 gap-12 text-gray-300 text-base font-medium">
          <Link
            href="/"
            className={`py-4 transition-all duration-200 ${
              isActive("/")
                ? "text-white border-b-3 border-gray-400"
                : "hover:text-white hover:border-b-3 hover:border-gray-500"
            }`}
          >
            Trang chủ
          </Link>

          <Link
            href="/gioi-thieu"
            className={`py-4 transition-all duration-200 ${
              isActive("/gioi-thieu")
                ? "text-white border-b-3 border-gray-400"
                : "hover:text-white hover:border-b-3 hover:border-gray-500"
            }`}
          >
            Giới thiệu
          </Link>

          {/* SẢN PHẨM - CHỈ CLICK MỚI MỞ MENU */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={toggleDropdown}
              className={`flex items-center gap-1.5 py-4 transition-all duration-200 ${
                isActive("/san-pham") || open
                  ? "text-white border-b-3 border-gray-400"
                  : "hover:text-white hover:border-b-3 hover:border-gray-500"
              }`}
              aria-expanded={open}
              aria-haspopup="true"
            >
              Sản phẩm
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5 7l5 5 5-5" />
              </svg>
            </button>

            {/* Menu 3 cấp */}
            {open && (
              <div className="absolute left-0 top-full mt-3 z-50 w-screen max-w-[1200px]">
                <div className="bg-white text-gray-800 rounded-xl shadow-2xl min-w-[850px] border border-gray-200 overflow-hidden mx-auto animate-fade-in">
                  <CategoryThreeLevelMenu onItemClick={() => setOpen(false)} />
                </div>
              </div>
            )}
          </div>

          <Link
            href="/tin-tuc"
            className={`py-4 transition-all duration-200 ${
              isActive("/tin-tuc")
                ? "text-white border-b-3 border-gray-400"
                : "hover:text-white hover:border-b-3 hover:border-gray-500"
            }`}
          >
            Tin tức
          </Link>

          <Link
            href="/lien-he"
            className={`py-4 transition-all duration-200 ${
              isActive("/lien-he")
                ? "text-white border-b-3 border-gray-400"
                : "hover:text-white hover:border-b-3 hover:border-gray-500"
            }`}
          >
            Liên hệ
          </Link>
        </nav>
      </div>

      {/* CSS Animation cho dropdown menu */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default NavBar;