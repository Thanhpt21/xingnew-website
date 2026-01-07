"use client";
import { Drawer, Menu, Spin } from "antd";
import {
  CloseOutlined,
  LoadingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useEffect, useMemo, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLogout } from "@/hooks/auth/useLogout";
import { useCartStore } from "@/stores/cartStore";
import TopBar from "./header/TopBar";
import NavBar from "./header/NavBar";

interface HeaderProps {
  config: any;
}

const Header = ({ config }: HeaderProps) => {
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTabletMenuOpen, setIsTabletMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartItems = useCartStore((s) => s.items);
  const cartItemCount = cartItems.reduce((t, i) => t + i.quantity, 0);
  const { currentUser, isLoading: isAuthLoading } = useAuth();
  const { logoutUser, isPending: isLogoutPending } = useLogout();
  const isAdmin = currentUser?.role === "admin";

  useEffect(() => setMounted(true), []);

  // Theo dõi scroll
  useEffect(() => {
    let ticking = false;
    const threshold = 50;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const shouldBeScrolled = currentScrollY > threshold;
          
          if (shouldBeScrolled !== scrolled) {
            setScrolled(shouldBeScrolled);
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const marqueeMessages = [
    "Xing New - Nhà phân phối giấy in nhiệt, giấy in mã vạch, băng keo chính hãng",
    "Giấy in nhiệt K57 • K80 • K110 - Chất lượng cao, giá tốt nhất",
    "Băng keo trong, đục, dán thùng - Đủ kích thước, giao hàng nhanh chóng",
    "Giấy decal mã vạch, ruy băng mực in barcode - Luôn sẵn hàng",
    "Miễn phí vận chuyển nội thành HN & HCM cho đơn từ 2.000.000đ",
    "Hotline: 0909.xxx.xxx - Tư vấn & báo giá nhanh 24/7",
  ];

  const mainMenuItems = useMemo(() => {
    const items = [
      { label: <a href="/">Trang chủ</a>, key: "home" },
      { label: <a href="/gioi-thieu">Giới thiệu</a>, key: "about" },
      { label: <a href="/san-pham">Sản phẩm</a>, key: "products" },
      { label: <a href="/tin-tuc">Tin tức</a>, key: "news" },
      { label: <a href="/lien-he">Liên hệ</a>, key: "contact" },
    ];

    if (currentUser) {
      items.push({ label: <a href="/tai-khoan">Tài khoản</a>, key: "account" });
      if (isAdmin) {
        items.push({ label: <a href="/admin">Quản trị</a>, key: "admin" });
      }
      items.push({
        label: (
          <button
            onClick={() => {
              logoutUser();
              setIsMobileMenuOpen(false);
              setIsTabletMenuOpen(false);
            }}
            className="text-red-600 w-full text-left flex items-center gap-2"
          >
            {isLogoutPending ? <Spin indicator={<LoadingOutlined />} size="small" /> : "Đăng xuất"}
          </button>
        ),
        key: "logout",
      });
    } else {
      items.push({ label: <a href="/login">Đăng nhập</a>, key: "login" });
    }

    return items;
  }, [currentUser, isAdmin, isLogoutPending, logoutUser]);

  return (
    <>
      {/* STICKY HEADER */}
      <div className="sticky top-0 z-40 bg-white shadow-sm">
        {/* Marquee container - smooth collapse */}
        <div 
          className="overflow-hidden transition-all duration-300 ease-out"
          style={{ 
            maxHeight: scrolled ? '0px' : '200px',
          }}
        >
          {/* MARQUEE Desktop */}
          <div className="hidden md:block bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 text-gray-700 py-2 overflow-hidden border-b border-gray-300">
            <div className="animate-marquee whitespace-nowrap inline-block">
              {marqueeMessages.map((msg, index) => (
                <span key={index} className="mx-12 text-sm font-medium inline-block">
                  {msg}
                  {index < marqueeMessages.length - 1 && <span className="mx-12 text-gray-400">···</span>}
                </span>
              ))}
              {marqueeMessages.map((msg, index) => (
                <span key={`dup-${index}`} className="mx-12 text-sm font-medium inline-block">
                  {msg}
                  {index < marqueeMessages.length - 1 && <span className="mx-12 text-gray-400">···</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Marquee Mobile */}
          <div className="md:hidden bg-gray-100 text-gray-700 py-1.5 px-4 overflow-hidden border-b border-gray-300">
            <div className="animate-marquee-mobile text-xs font-medium whitespace-nowrap">
              {marqueeMessages[0]} ··· {marqueeMessages[1]} ··· {marqueeMessages[4]}
            </div>
          </div>
        </div>

        {/* TOPBAR - luôn hiển thị */}
        <TopBar
          config={config}
          cartItemCount={cartItemCount}
          isAuthLoading={isAuthLoading}
          isLogoutPending={isLogoutPending}
          isAdmin={isAdmin}
          onLogout={logoutUser}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenTabletMenu={() => setIsTabletMenuOpen(true)}
        />

        {/* NAVBAR - CHỈ HIỂN THỊ TRÊN DESKTOP */}
        <div className="hidden lg:block bg-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <NavBar />
          </div>
        </div>
      </div>

      {/* CSS cho marquee */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 50s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }

        @keyframes marquee-mobile {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee-mobile {
          animation: marquee-mobile 35s linear infinite;
        }
      `}</style>

      {/* MOBILE MENU DRAWER */}
      {mounted && (
        <Drawer
          title={
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <CloseOutlined />
              </button>
            </div>
          }
          placement="right"
          width={300}
          open={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          closeIcon={null}
        >
          <div className="space-y-1">
            {mainMenuItems.map((item) => (
              <div key={item.key} className="py-3 border-b last:border-b-0 text-base">
                {item.label}
              </div>
            ))}
          </div>
          {currentUser && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserOutlined className="text-gray-600 text-xl" />
                </div>
                <div>
                  <p className="font-semibold">{currentUser.name || currentUser.email}</p>
                  <p className="text-sm text-gray-600">{currentUser.email}</p>
                </div>
              </div>
            </div>
          )}
        </Drawer>
      )}

      {/* TABLET MENU DRAWER - VẪN GIỮ ĐỂ DÙNG CHO TABLET */}
      {isTabletMenuOpen && mounted && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsTabletMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-800">Menu</h2>
                <button
                  onClick={() => setIsTabletMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <CloseOutlined className="text-lg" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <Menu mode="vertical" items={mainMenuItems} className="border-none text-base" />
              </div>
              <div className="pt-6 border-t mt-6 text-center text-sm text-gray-500">
                © 2026 Công ty TNHH Xing New
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;