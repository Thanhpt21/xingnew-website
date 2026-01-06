"use client";

import Link from "next/link";
import Image from "next/image";
import { Avatar, Badge, Dropdown, Spin } from "antd";
import type { MenuProps } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  MenuOutlined,
  LoadingOutlined,
  SearchOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import { useAuth } from "@/context/AuthContext";
import { getImageUrl } from "@/utils/getImageUrl";
import SearchBar from "../common/SearchBar";
import { useState } from "react";

interface TopBarProps {
  config: any;
  cartItemCount: number;
  isAuthLoading: boolean;
  isLogoutPending: boolean;
  isAdmin?: boolean;
  onLogout: () => void;
  onOpenMobileMenu: () => void;
  onOpenTabletMenu?: () => void;
}

const TopBar = ({
  config,
  cartItemCount,
  isAuthLoading,
  isLogoutPending,
  isAdmin,
  onLogout,
  onOpenMobileMenu,
  onOpenTabletMenu,
}: TopBarProps) => {
  const { currentUser } = useAuth();
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // ================= USER DROPDOWN MENU =================
  const userMenuItems: MenuProps["items"] = currentUser
    ? [
        {
          key: "account",
          label: <Link href="/tai-khoan">Tài khoản</Link>,
          icon: <UserOutlined />,
        },
        ...(isAdmin
          ? [
              {
                key: "admin",
                label: <Link href="/admin">Quản trị</Link>,
                icon: <SettingOutlined />,
              },
            ]
          : []),
        {
          type: "divider",
        },
        {
          key: "logout",
          label: (
            <button onClick={onLogout} className="text-red-600">
              {isLogoutPending ? (
                <Spin indicator={<LoadingOutlined />} size="small" />
              ) : (
                "Đăng xuất"
              )}
            </button>
          ),
          icon: <LogoutOutlined />,
        },
      ]
    : [
        {
          key: "login",
          label: <Link href="/login">Đăng nhập</Link>,
          icon: <UserOutlined />,
        },
      ];

  return (
    <div className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 md:h-16 lg:h-20 gap-3">
          {/* ================= MOBILE HAMBURGER MENU ================= */}
          <button
            className="lg:hidden flex-shrink-0"
            onClick={onOpenMobileMenu}
            aria-label="Open menu"
          >
            <MenuOutlined className="text-lg sm:text-xl text-gray-700" />
          </button>

          {/* ================= LOGO ================= */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src={getImageUrl(config?.logo) || "/images/logo.png"}
              alt="logo"
              width={0}
              height={0}
              sizes="100vw"
              className="object-contain h-10 sm:h-10 md:h-8 lg:h-16 w-auto max-w-[200px] sm:max-w-[140px] md:max-w-none"
              priority
              style={{ width: 'auto' }}
            />
          </Link>

          {/* ================= SEARCH BAR (Desktop) ================= */}
          <div className="flex-1 max-w-xl hidden md:block">
            <SearchBar />
          </div>

          {/* ================= MOBILE SEARCH TOGGLE ================= */}
          <button
            className="md:hidden flex-shrink-0"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            aria-label="Search"
          >
            <SearchOutlined className="text-lg sm:text-xl text-gray-700" />
          </button>

          {/* ================= RIGHT ACTIONS ================= */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5">
            {/* USER - Hiển thị trên tablet/desktop */}
            <div className="hidden md:block">
              <Dropdown
                menu={{ items: userMenuItems }}
                trigger={["click"]}
                placement="bottomRight"
                disabled={isAuthLoading}
              >
                <div className="flex items-center gap-2 cursor-pointer select-none min-w-0 group">
                  {isAuthLoading ? (
                    <Spin indicator={<LoadingOutlined />} size="small" />
                  ) : (
                    <>
                      <Avatar
                        size="small"
                        src={
                          currentUser?.avatar
                            ? getImageUrl(currentUser.avatar)
                            : undefined
                        }
                        icon={<UserOutlined />}
                        className={`flex-shrink-0 ${
                          currentUser 
                            ? "!bg-blue-600 !text-white" 
                            : "bg-gray-200 text-gray-600"
                        }`}
                      />
                      <span className="text-sm text-gray-700 truncate max-w-[80px] lg:max-w-[100px] group-hover:text-blue-600 transition-colors">
                        {currentUser?.name?.split(" ").pop() || "Tài khoản"}
                      </span>
                    </>
                  )}
                </div>
              </Dropdown>
            </div>

            {/* USER - Mobile chỉ hiển thị icon */}
            <div className="md:hidden">
              <Dropdown
                menu={{ items: userMenuItems }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <button className="p-1">
                  {currentUser ? (
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-600 rounded-full opacity-20"></div>
                      <UserOutlined className="text-lg sm:text-xl text-blue-600 relative" />
                    </div>
                  ) : (
                    <UserOutlined className="text-lg sm:text-xl text-gray-700" />
                  )}
                </button>
              </Dropdown>
            </div>

            {/* CART */}
            <Link
              href="/gio-hang"
              className="relative flex items-center gap-1 flex-shrink-0 group"
            >
              <ShoppingCartOutlined className="text-lg sm:text-xl text-[#0B3A8F] group-hover:text-blue-600 transition-colors" />
              <span className="text-xs sm:text-sm hidden md:inline group-hover:text-blue-600 transition-colors">
                Giỏ hàng
              </span>
              {cartItemCount > 0 && (
                <Badge
                  count={cartItemCount}
                  className="absolute -top-2 -right-2 sm:-top-2 sm:-right-3 md:-top-1 md:-right-2"
                  size="small"
                />
              )}
            </Link>

            {/* TABLET MENU BUTTON (chỉ hiển thị trên tablet) */}
            {onOpenTabletMenu && (
              <button
                className="hidden md:block lg:hidden"
                onClick={onOpenTabletMenu}
                aria-label="Tablet menu"
              >
                <MenuOutlined className="text-xl" />
              </button>
            )}
          </div>
        </div>

        {/* ================= MOBILE SEARCH BAR ================= */}
        {showMobileSearch && (
          <div className="md:hidden py-3 border-t">
            <SearchBar />
            <button
              onClick={() => setShowMobileSearch(false)}
              className="text-xs sm:text-sm text-gray-500 mt-2 block ml-auto"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;