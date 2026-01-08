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
  BuildOutlined, 
  AppstoreOutlined, 
  SafetyOutlined, 
  RocketOutlined, 
  GlobalOutlined, 
  CalendarOutlined, 
  LineChartOutlined, 
  SyncOutlined 
} from "@ant-design/icons";

// Skeleton components
const SkeletonText = ({ lines = 3 }: { lines?: number }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
    ))}
  </div>
);

const SkeletonTimelineItem = () => (
  <div className="flex gap-4">
    <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse flex-shrink-0" />
    <div className="flex-1">
      <div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse" />
      <SkeletonText lines={2} />
    </div>
  </div>
);

const developmentTimeline = [
  {
    year: "2008",
    date: "08/08/2008",
    title: "Thành lập công ty",
    description: "Công ty được thành lập, vận hành dây chuyền sản xuất đầu tiên và xây dựng nền tảng công nghệ.",
    achievements: ["Thành lập công ty", "Vận hành dây chuyền sản xuất đầu tiên"],
  },
  {
    year: "2010",
    title: "Mở rộng sản xuất",
    description: "Thành lập dây chuyền sản xuất thứ hai, bắt đầu xây dựng mô hình kinh doanh chuỗi.",
    achievements: ["Dây chuyền sản xuất thứ hai", "Mô hình kinh doanh chuỗi"],
  },
  {
    year: "2013",
    title: "Đầu tư mạnh mẽ",
    description: "Nhận đầu tư lớn, bổ sung 4 dây chuyền sản xuất mới, mở rộng đối tác thương mại nội địa.",
    achievements: ["Thêm 4 dây chuyền sản xuất", "Mở rộng đối tác thương mại"],
  },
  {
    year: "2015",
    title: "Tăng trưởng nhanh",
    description: "Phát triển mạnh mẽ mảng kinh doanh logistics, tái cấu trúc chuỗi cung ứng.",
    achievements: ["Tăng trưởng kinh doanh nhanh", "Tái cấu trúc chuỗi cung ứng"],
  },
  {
    year: "2017",
    title: "Chuyển đổi số",
    description: "Chuyển đổi sang sản xuất dịch vụ điện tử, trở thành nhà cung cấp cho các hãng chuyển phát nhanh lớn.",
    achievements: ["Chuyển đổi dịch vụ điện tử", "Hợp tác với các hãng logistics lớn"],
  },
  {
    year: "2019",
    title: "Đầu tư công nghệ",
    description: "Đầu tư mạnh vào công nghệ sản xuất hiện đại, hợp tác với các doanh nghiệp vận tải lớn.",
    achievements: ["Đầu tư công nghệ mới", "Hợp tác doanh nghiệp vận tải"],
  },
  {
    year: "2020",
    title: "Hoàn thiện hệ thống",
    description: "Hoàn thiện quy trình sản xuất, xây dựng văn hóa doanh nghiệp logistics cao cấp.",
    achievements: ["Hoàn thiện quy trình", "Xây dựng văn hóa doanh nghiệp"],
  },
  {
    year: "2021",
    title: "Mở rộng thị trường",
    description: "Mở rộng đa kênh, phát triển thị trường nội địa, hợp tác với nhiều hãng chuyển phát nhanh.",
    achievements: ["Mở rộng đa kênh", "Phát triển thị trường nội địa"],
  },
];

// SỨ MỆNH & TẦM NHÌN
const missionVision = {
  mission: {
    title: "Sứ mệnh",
    description: "Chúng tôi cam kết mang đến sản phẩm vật tư in ấn chất lượng cao, giúp khách hàng nâng cao hiệu quả vận hành và duy trì lợi thế cạnh tranh trên thị trường.",
  },
  vision: {
    title: "Tầm nhìn",
    description: "Trở thành nhà phân phối vật tư in ấn hàng đầu tại Việt Nam, cung cấp giải pháp bền vững, thân thiện môi trường và không ngừng đổi mới công nghệ để phục vụ khách hàng tốt nhất.",
  },
};

export default function CompanyHistoryPage() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2">
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-200 rounded mb-4 w-48 mx-auto animate-pulse" />
            <div className="h-6 bg-gray-200 rounded mb-8 w-64 mx-auto animate-pulse" />
          </div>
          <div className="space-y-12 mb-12">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <SkeletonTimelineItem key={num} />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-100 rounded-xl p-8 animate-pulse">
              <div className="h-8 bg-gray-300 rounded mb-4 w-24 animate-pulse" />
              <SkeletonText lines={6} />
            </div>
            <div className="bg-gray-100 rounded-xl p-8 animate-pulse">
              <div className="h-8 bg-gray-300 rounded mb-4 w-24 animate-pulse" />
              <SkeletonText lines={6} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="border-b border-gray-200 bg-white/80 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium transition-colors hover:underline">
              Trang chủ
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800 font-semibold">Giới thiệu</span>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8">
        {/* Timeline Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative mb-20"
        >
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-300 hidden md:block" />
          <div className="space-y-16 md:space-y-24">
            {developmentTimeline.map((item, index) => {
              const isReverse = index % 2 === 1;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isReverse ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className={`relative flex flex-col ${isReverse ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-8 md:gap-12`}
                >
                  {/* Year Badge */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 md:relative md:left-auto md:transform-none z-10">
                    <div className="bg-gray-800 text-white w-20 h-20 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                      <span className="text-xl font-bold">{item.year}</span>
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className={`w-full md:w-1/2 ${isReverse ? "md:pl-12" : "md:pr-12"} mt-12 md:mt-0`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-700">
                          <RocketOutlined className="text-xl" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
                      </div>
                      {item.date && (
                        <p className="text-sm text-gray-500 mb-4 font-medium">
                          <CalendarOutlined className="mr-2" />
                          {item.date}
                        </p>
                      )}
                      <p className="text-gray-700 mb-6 leading-relaxed">{item.description}</p>
                      {item.achievements && (
                        <div>
                          <p className="font-semibold text-gray-900 mb-3">Thành tựu chính:</p>
                          <ul className="space-y-2">
                            {item.achievements.map((ach, i) => (
                              <li key={i} className="flex items-start gap-3 text-gray-700">
                                <CheckCircleOutlined className="text-gray-600 mt-1 flex-shrink-0" />
                                <span>{ach}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Mission & Vision */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20"
        >
          <div className="bg-gray-50 rounded-3xl p-10 shadow-lg border border-gray-200">
            <div className="flex items-center gap-5 mb-6">
              <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center text-white">
                <TrophyOutlined className="text-2xl" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">{missionVision.mission.title}</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">{missionVision.mission.description}</p>
          </div>

          <div className="bg-gray-50 rounded-3xl p-10 shadow-lg border border-gray-200">
            <div className="flex items-center gap-5 mb-6">
              <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center text-white">
                <GlobalOutlined className="text-2xl" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">{missionVision.vision.title}</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">{missionVision.vision.description}</p>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center py-16"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Sẵn sàng hợp tác cùng Xing New?
          </h3>
          <p className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto px-4">
            Với kinh nghiệm và sự phát triển không ngừng, chúng tôi tự tin mang đến giải pháp vật tư in ấn chất lượng cao nhất cho doanh nghiệp của bạn.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a
              href="tel:0903776456"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <PhoneOutlined />
              Liên hệ ngay
            </a>
            <Link
              href="/san-pham"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-800 font-semibold rounded-xl border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
            >
              <AppstoreOutlined />
              Xem sản phẩm
            </Link>
          </div>
        </motion.div>

        
      </div>
    </div>
  );
}