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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-gray-800 hidden lg:block border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex items-center h-14 gap-12 text-gray-300 text-base font-medium">
          <Link
            href="/"
            className={`py-4 transition-all duration-200 ${
              isActive("/")
                ? "text-white border-b-3 border-silver-400"
                : "hover:text-white hover:border-b-3 hover:border-gray-500"
            }`}
          >
            Trang chủ
          </Link>

          <Link
            href="/gioi-thieu"
            className={`py-4 transition-all duration-200 ${
              isActive("/gioi-thieu")
                ? "text-white border-b-3 border-silver-400"
                : "hover:text-white hover:border-b-3 hover:border-gray-500"
            }`}
          >
            Giới thiệu
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              onMouseEnter={() => setOpen(true)}
              className={`flex items-center gap-1 py-4 transition-all duration-200 ${
                isActive("/san-pham")
                  ? "text-white border-b-3 border-silver-400"
                  : "hover:text-white hover:border-b-3 hover:border-gray-500"
              }`}
            >
              Sản phẩm
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5 7l5 5 5-5" />
              </svg>
            </button>

            {open && (
              <div
                className="absolute left-0 top-full mt-3 z-50"
                onMouseLeave={() => setOpen(false)}
              >
                <div className="bg-white text-gray-800 rounded-xl shadow-2xl min-w-[850px] border border-gray-200 overflow-hidden">
                  <CategoryThreeLevelMenu />
                </div>
              </div>
            )}
          </div>

          <Link
            href="/tin-tuc"
            className={`py-4 transition-all duration-200 ${
              isActive("/tin-tuc")
                ? "text-white border-b-3 border-silver-400"
                : "hover:text-white hover:border-b-3 hover:border-gray-500"
            }`}
          >
            Tin tức
          </Link>

          <Link
            href="/lien-he"
            className={`py-4 transition-all duration-200 ${
              isActive("/lien-he")
                ? "text-white border-b-3 border-silver-400"
                : "hover:text-white hover:border-b-3 hover:border-gray-500"
            }`}
          >
            Liên hệ
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;