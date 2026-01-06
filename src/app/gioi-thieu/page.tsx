"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  PhoneOutlined, 
  MailOutlined, 
  EnvironmentOutlined, 
  BankOutlined, 
  CheckCircleOutlined, 
  TrophyOutlined, 
  TeamOutlined, 
  BuildOutlined, // Thay thế FactoryOutlined
  AppstoreOutlined,
  SafetyOutlined,
  RocketOutlined,
  GlobalOutlined
} from "@ant-design/icons";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Skeleton loading components
const SkeletonText = ({ lines = 3 }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
    ))}
  </div>
);

const SkeletonImage = () => (
  <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-lg overflow-hidden bg-gray-200 animate-pulse" />
);

const SkeletonVideo = () => (
  <div className="relative w-full pb-[56.25%] rounded-lg overflow-hidden bg-gray-200 animate-pulse" />
);

export default function AboutUsPage() {
  const [mounted, setMounted] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleImageLoad = () => {
    setImagesLoaded(prev => prev + 1);
  };

  const companyFeatures = [
    {
      icon: <BuildOutlined className="text-2xl" />, // Sử dụng BuildOutlined thay cho FactoryOutlined
      title: "Máy móc hiện đại",
      description: "Nhập khẩu 100% từ Hàn Quốc"
    },
    {
      icon: <TrophyOutlined className="text-2xl" />,
      title: "Chất lượng cao",
      description: "Tiêu chuẩn quốc tế"
    },
    {
      icon: <TeamOutlined className="text-2xl" />,
      title: "Tư vấn miễn phí",
      description: "Thiết kế mẫu theo yêu cầu"
    },
    {
      icon: <AppstoreOutlined className="text-2xl" />, // Icon mới cho đa dạng sản phẩm
      title: "Đa dạng sản phẩm",
      description: "Màu sắc, kích thước phong phú"
    }
  ];

  const contactInfo = [
    {
      icon: <EnvironmentOutlined />,
      title: "Văn phòng",
      content: "206/24 Tân xuân 2, Ấp Chánh 1, Xã Tân Xuân, Huyện Hóc Môn, TP.HCM"
    },
    {
      icon: <BuildOutlined />, // Sử dụng BuildOutlined
      title: "Nhà máy",
      content: "Số 122 Nguyễn Thị Lắng, Tân Phú Trung, Huyện Củ Chi, TP.HCM"
    },
    {
      icon: <BankOutlined />,
      title: "Tài khoản",
      content: "941818 - Ngân hàng ACB, chi nhánh HCM"
    },
    {
      icon: <PhoneOutlined />,
      title: "Điện thoại",
      content: "+84.28.3636.1435 - Fax: +84.28.3636.7418"
    },
    {
      icon: <MailOutlined />,
      title: "Email",
      content: "johnny@webbinggreenvina.com - webbinggreenvina@gmail.com"
    },
    {
      icon: <PhoneOutlined />,
      title: "Hotline",
      content: "0903.776.456 - Mr. Johnny Khanh"
    }
  ];

  const coreValues = [
    {
      icon: <SafetyOutlined />,
      title: "Chất Lượng",
      description: "Đảm bảo tiêu chuẩn cao nhất"
    },
    {
      icon: <CheckCircleOutlined />,
      title: "Uy Tín",
      description: "Cam kết trách nhiệm"
    },
    {
      icon: <TeamOutlined />,
      title: "Tận Tâm",
      description: "Phục vụ khách hàng 24/7"
    },
    {
      icon: <RocketOutlined />,
      title: "Đổi Mới",
      description: "Công nghệ hiện đại"
    }
  ];

  const videos = [
    {
      id: "M4iTg7SPzCk",
      title: "Sản xuất dây đai, dây niềng | dây đai PP | dây đai Cotton | Dây đai Polyester"
    },
    {
      id: "i3ySx-uCEDE",
      title: "Sản xuất dây đai, dây niềng | dây đai Cotton | dây đai dệt Spun| Dây đai Polyester"
    },
    {
      id: "8avR8JORTeE",
      title: "Sản xuất dây đai, dây niềng | dây đai PP | dây đai Cotton | dây đai dệt Spun"
    },
    {
      id: "CkY_62z1Ux0",
      title: "Quá trình sản xuất dây đai - dây niềng"
    }
  ];

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Breadcrumb Skeleton */}
        <div className="border-b border-gray-200">
          <div className="max-w-[1400px] mx-auto px-4 py-4">
            <div className="flex items-center gap-2">
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="max-w-[1400px] mx-auto px-4 py-12">
          {/* Header Skeleton */}
          <div className="bg-gray-200 rounded-lg p-8 mb-8 animate-pulse">
            <div className="h-10 bg-gray-300 rounded mb-6 w-48 animate-pulse" />
            <SkeletonText lines={8} />
          </div>

          {/* Features Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="bg-gray-200 rounded-xl p-6 animate-pulse h-32" />
            ))}
          </div>

          {/* Images Skeleton */}
          <div className="space-y-8">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <SkeletonImage key={num} />
            ))}
          </div>

          {/* Contact Skeleton */}
          <div className="mt-12 bg-gray-200 rounded-2xl p-8 animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-6 w-48 mx-auto animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div key={num} className="bg-gray-300 rounded-lg p-4 animate-pulse h-24" />
              ))}
            </div>
          </div>

          {/* Videos Skeleton */}
          <div className="mt-12 space-y-8">
            <div className="h-8 bg-gray-200 rounded mb-8 w-48 mx-auto animate-pulse" />
            {[1, 2, 3, 4].map((num) => (
              <SkeletonVideo key={num} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="border-b border-gray-200 bg-white/80 backdrop-blur-sm"
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline"
            >
              Trang chủ
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 font-semibold">Giới thiệu</span>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-12"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl transform -rotate-1 scale-105 opacity-10" />
          <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-8 md:p-12 shadow-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 text-center"
            >
              GIỚI THIỆU CÔNG TY
            </motion.h1>
            
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-6 text-white/95 text-base md:text-lg leading-relaxed"
            >
              <motion.p variants={fadeInUp}>
                <span className="font-semibold text-white">Công ty TNHH WEBBING GREEN VINA</span> chuyên sản xuất và cung cấp các loại dây đai dệt như: 
                Dây đai, dây cầu, dây giày, dây thun rằn, dây thun y tế, v.v.. phục vụ cho các ngành phụ liệu may mặc, ba lô, túi xách, giày dép...
              </motion.p>
              
              <motion.p variants={fadeInUp}>
                Sản phẩm đa dạng về màu sắc, kích thước, mẫu mã đáp ứng mọi yêu cầu của khách hàng.
              </motion.p>
              
              <motion.p variants={fadeInUp} className="font-medium bg-white/10 p-4 rounded-lg border-l-4 border-white">
                <BuildOutlined className="mr-2" />
                Tất cả máy móc sản xuất nhập khẩu 100% từ Hàn Quốc, cam kết mang đến sản phẩm chất lượng cao cho Quý khách hàng.
              </motion.p>
              
              <motion.p variants={fadeInUp}>
                Chúng tôi sẵn sàng tư vấn thiết kế mẫu miễn phí về các loại dây dệt và đưa ra những giải pháp lựa chọn sản phẩm phù hợp, 
                đem lại hiệu quả cao nhất cho khách hàng.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="bg-white/20 p-6 rounded-xl">
                <h3 className="font-bold text-xl mb-3 text-white flex items-center gap-2">
                  <TrophyOutlined />
                  Phương châm hoạt động
                </h3>
              
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-white/10 p-4 rounded-lg">
                    <div className="font-semibold text-white flex items-center gap-2">
                      <SafetyOutlined />
                      CHẤT LƯỢNG
                    </div>
                    <div className="text-white/90 text-sm">Tiêu chuẩn quốc tế</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <div className="font-semibold text-white flex items-center gap-2">
                      <TeamOutlined />
                      TẬN TÌNH
                    </div>
                    <div className="text-white/90 text-sm">Phục vụ 24/7</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Core Values */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Giá trị cốt lõi
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Những nguyên tắc định hướng mọi hoạt động của chúng tôi
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {coreValues.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-white rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white mb-3 mx-auto">
                  {value.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-center mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm text-center">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Company Images Gallery */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-8"
        >
          {[1, 2, 3, 4, 5, 6, 7].map((num, index) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="group"
            >
              <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                <Image
                  src={`/image/gt${num}.jpg`}
                  alt={`Công ty Webbing Green Vina ${num}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1400px"
                  style={{ objectFit: "contain" }}
                  className="bg-white group-hover:scale-105 transition-transform duration-700"
                  onLoad={handleImageLoad}
                  priority={num <= 2}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-xl border border-gray-200"
        >
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Thông tin liên hệ
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Mọi chi tiết vui lòng liên hệ với chúng tôi qua các kênh sau:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contactInfo.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3 + index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-200"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="mt-10 pt-8 border-t border-gray-200"
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 mb-4">
                Rất mong nhận được sự quan tâm và hợp tác của Quý khách hàng!
              </p>
              <div className="inline-flex items-center gap-2 bg-blue-50 px-6 py-3 rounded-lg">
                <BankOutlined className="text-blue-600" />
                <span className="text-gray-700 font-semibold">MST: 0314974846</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Video Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-16"
        >
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Video giới thiệu sản xuất
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Khám phá quy trình sản xuất hiện đại của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 + index * 0.1 }}
                className="group"
              >
                <div className="relative w-full pb-[56.25%] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full group-hover:scale-105 transition-transform duration-700"
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <p className="mt-3 text-gray-700 font-medium text-center">{video.title}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-10 md:p-12 shadow-2xl">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Bạn cần tư vấn về sản phẩm?
            </h3>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ 24/7
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="tel:0903776456"
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-lg text-lg inline-flex items-center justify-center gap-2"
              >
                <PhoneOutlined />
                Gọi ngay: 0903.776.456
              </a>
              <a
                href="mailto:johnny@webbinggreenvina.com"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl transition-all duration-300 text-lg inline-flex items-center justify-center gap-2"
              >
                <MailOutlined />
                Gửi email
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}