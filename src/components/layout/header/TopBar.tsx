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
            <button onClick={onLogout} className="text-gray-700">
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
    <div className="border-b border-gray-200 bg-white will-change-transform">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16 lg:h-20 gap-3">
          {/* MOBILE HAMBURGER MENU */}
          <button
            className="lg:hidden flex-shrink-0"
            onClick={onOpenMobileMenu}
            aria-label="Open menu"
          >
            <MenuOutlined className="text-lg sm:text-xl text-gray-700" />
          </button>

          {/* LOGO - TO HƠN TRÊN MOBILE */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src={getImageUrl(config?.logo) || "/images/logo.png"}
              alt="logo"
              width={0}
              height={0}
              sizes="100vw"
              className="object-contain h-12 sm:h-12 md:h-8 lg:h-16 w-auto max-w-[220px] sm:max-w-[160px] md:max-w-none"
              priority
              style={{ width: 'auto' }}
            />
          </Link>

          {/* SEARCH BAR (Desktop) */}
          <div className="flex-1 max-w-xl hidden md:block">
            <SearchBar />
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5">
            {/* MOBILE SEARCH TOGGLE - ĐÃ DI CHUYỂN VÀO ĐÂY */}
            <button
              className="md:hidden flex-shrink-0"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              aria-label="Search"
            >
              <SearchOutlined className="text-lg sm:text-xl text-gray-700" />
            </button>

            {/* USER - Desktop/Tablet */}
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
                            ? "!bg-gray-800 !text-white" 
                            : "bg-gray-200 text-gray-600"
                        }`}
                      />
                      <span className="text-sm text-gray-700 truncate max-w-[80px] lg:max-w-[100px] group-hover:text-gray-900 transition-colors">
                        {currentUser?.name?.split(" ").pop() || "Tài khoản"}
                      </span>
                    </>
                  )}
                </div>
              </Dropdown>
            </div>

            {/* USER - Mobile - KHÔNG CẦN BACKGROUND */}
            <div className="md:hidden">
              <Dropdown
                menu={{ items: userMenuItems }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <button className="p-1">
                  <UserOutlined className="text-lg sm:text-xl text-gray-700" />
                </button>
              </Dropdown>
            </div>

            {/* CART */}
            <Link
              href="/gio-hang"
              className="relative flex items-center gap-1 flex-shrink-0 group"
            >
              <ShoppingCartOutlined className="text-lg sm:text-xl text-gray-700 group-hover:text-gray-900 transition-colors" />
              <span className="text-xs sm:text-sm hidden md:inline group-hover:text-gray-900 transition-colors">
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

            {/* TABLET MENU BUTTON */}
            {onOpenTabletMenu && (
              <button
                className="hidden md:block lg:hidden"
                onClick={onOpenTabletMenu}
                aria-label="Tablet menu"
              >
                <MenuOutlined className="text-xl text-gray-700" />
              </button>
            )}
          </div>
        </div>

        {/* MOBILE SEARCH BAR */}
        {showMobileSearch && (
          <div className="md:hidden py-3 border-t border-gray-200">
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