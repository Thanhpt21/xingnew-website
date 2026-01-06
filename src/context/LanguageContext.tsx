'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'vi' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations = {
  vi: {
    // Banner
    "banner.title": "KINH NGHIỆM & CHỨNG CHỈ",
    "banner.experience": "🏭 KINH NGHIỆM: 15 năm sản xuất dây đai công nghiệp",
    "banner.certificate1": "✅ CHỨNG CHỈ: Đạt tiêu chuẩn REACH xuất khẩu Châu Âu",
    "banner.certificate2": "📜 CHỨNG CHỈ: Hệ thống quản lý chất lượng ISO 9001:2015",
    "banner.certificate3": "🔬 KIỂM ĐỊNH: Sản phẩm đạt chuẩn RoHS, không chứa chất độc hại",
    "banner.export": "🌍 XUẤT KHẨU: Trên 20 quốc gia toàn thế giới",
    
    // Menu
    "menu.home": "Trang chủ",
    "menu.products": "Sản phẩm",
    "menu.about": "Về chúng tôi",
    "menu.news": "Tin tức",
    "menu.contact": "Liên hệ",
    "menu.account": "Tài khoản",
    "menu.admin": "Quản trị",
    "menu.login": "Đăng nhập",
    "menu.logout": "Đăng xuất",
    "menu.loginRegister": "Đăng nhập / Đăng ký",
    "menu.title": "Menu",
    
    // Common
    "common.viewProducts": "Xem sản phẩm",
    "common.noCategories": "Không có danh mục nào",
    "user.defaultName": "Người dùng",
    
    // Search
    "search.placeholder": "Tìm kiếm sản phẩm...",
    "search.suggestions": "Gợi ý tìm kiếm",
    
    // Language
    "language.title": "Ngôn ngữ",
    
    // Cart
    "cart.title": "Giỏ hàng",
  },
  en: {
    // Banner
    "banner.title": "EXPERIENCE & CERTIFICATES",
    "banner.experience": "🏭 EXPERIENCE: 15 years of industrial webbing manufacturing",
    "banner.certificate1": "✅ CERTIFICATE: REACH standard for European export",
    "banner.certificate2": "📜 CERTIFICATE: ISO 9001:2015 Quality Management System",
    "banner.certificate3": "🔬 TESTING: Products meet RoHS standard, free from toxic substances",
    "banner.export": "🌍 EXPORT: Over 20 countries worldwide",
    
    // Menu
    "menu.home": "Home",
    "menu.products": "Products",
    "menu.about": "About Us",
    "menu.news": "News",
    "menu.contact": "Contact",
    "menu.account": "Account",
    "menu.admin": "Admin",
    "menu.login": "Login",
    "menu.logout": "Logout",
    "menu.loginRegister": "Login / Register",
    "menu.title": "Menu",
    
    // Common
    "common.viewProducts": "View products",
    "common.noCategories": "No categories",
    "user.defaultName": "User",
    
    // Search
    "search.placeholder": "Search products...",
    "search.suggestions": "Search suggestions",
    
    // Language
    "language.title": "Language",
    
    // Cart
    "cart.title": "Shopping Cart",
  }
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('vi');

  // Load language from localStorage on initial render
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when changed
  useEffect(() => {
    localStorage.setItem('language', language);
    // Update HTML lang attribute
    document.documentElement.lang = language;
  }, [language]);

  // Translation function
  const t = (key: string, fallback: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || fallback;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};