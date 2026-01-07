"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useConfigs } from "@/hooks/config/useConfigs";
import Image from "next/image";
import { motion } from "framer-motion";
import { Variants } from "framer-motion";

export default function Banner() {
  const { data: configs, isLoading } = useConfigs({ page: 1, limit: 1 });
  const configData = configs?.data?.[0];
  const bannerImages: string[] = configData?.banner || [];

  const displayedImages = bannerImages.slice(0, 3);

  // Animation variants cho phần text
  const textVariants: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.8,
        type: "tween",
        ease: "easeOut",
      },
    }),
  };

  const listItemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        type: "tween",
      },
    }),
  };

  return (
    <section className="relative w-full bg-white overflow-hidden py-8 md:py-12 lg:py-20">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Phần nội dung bên trái */}
          <motion.div 
            className="space-y-4 sm:space-y-6 order-2 lg:order-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="space-y-2 sm:space-y-3">
              <motion.h1
                custom={0}
                variants={textVariants}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                Xing New
              </motion.h1>
              <motion.p
                custom={1}
                variants={textVariants}
                className="text-lg sm:text-xl md:text-2xl text-gray-600 font-medium"
              >
                Đối tác tin cậy trong lĩnh vực vật tư in ấn tại Việt Nam
              </motion.p>
            </div>

            <motion.p
              custom={2}
              variants={textVariants}
              className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed max-w-2xl"
            >
              Là thành viên của Tập đoàn với hơn 17 năm kinh nghiệm sản xuất và phân phối toàn cầu, 
              <strong className="text-gray-900"> Xing New </strong>
              tự hào mang đến thị trường Việt Nam các sản phẩm chất lượng cao, đạt chuẩn quốc tế với giá cả cạnh tranh và dịch vụ tận tâm.
            </motion.p>

            <motion.div custom={3} variants={textVariants} className="space-y-2 sm:space-y-3">
              <p className="text-xs sm:text-sm uppercase tracking-wider text-gray-500 font-semibold">
                Chúng tôi chuyên cung cấp
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-gray-800">
                {[
                  "Giấy in nhiệt K57, K80, K110",
                  "Giấy in mã vạch decal giấy & PVC",
                  "Ruy băng mực in barcode",
                  "Băng keo công nghiệp đa dạng",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    custom={i}
                    variants={listItemVariants}
                    className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
                  >
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-600 flex-shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              custom={4}
              variants={textVariants}
              className="pt-2 sm:pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <Link
                href="/san-pham"
                className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Xem sản phẩm
                <ChevronRight className="ml-1 sm:ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link
                href="/gioi-thieu"
                className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-medium text-gray-800 bg-white border-2 border-gray-300 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition-all duration-300"
              >
                Về chúng tôi
                <ChevronRight className="ml-1 sm:ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Phần hình ảnh bên phải - OPTION 2: GIẢM ẢNH CHÍNH NHỎ LẠI */}
          <motion.div 
            className="order-1 lg:order-2 relative h-[320px] sm:h-[400px] md:h-[480px] lg:h-[620px] w-full max-w-lg mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {isLoading ? (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl sm:rounded-3xl animate-pulse shadow-xl sm:shadow-2xl" />
            ) : displayedImages.length === 0 ? (
              <div className="absolute inset-0 bg-gray-200 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl flex items-center justify-center text-gray-500 text-sm sm:text-base">
                Chưa có hình ảnh banner
              </div>
            ) : (
              <>
                {/* Ảnh nền chính - GIẢM XUỐNG 75% */}
                {displayedImages[0] && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.9, delay: 0.1 }}
                    whileHover={{ scale: 1.04 }}
                    className="absolute inset-0 flex items-center justify-center z-0"
                  >
                    <div className="relative w-[75%] h-[75%] rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl overflow-hidden">
                      <Image
                        src={displayedImages[0]}
                        alt="Kho hàng Xing New"
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 640px) 75vw, (max-width: 768px) 60vw, 500px"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Ảnh góc trái trên - ĐIỀU CHỈNH LẠI VỊ TRÍ */}
                {displayedImages[1] && (
                  <motion.div
                    initial={{ opacity: 0, x: -50, y: -50 }}
                    animate={{ opacity: 1, x: -10, y: -10 }}
                    transition={{ duration: 0.9, delay: 0.3 }}
                    whileHover={{ scale: 1.08 }}
                    className="absolute top-6 left-6 sm:top-10 sm:left-10 md:top-14 md:left-14 w-[30%] h-[30%] sm:w-[35%] sm:h-[35%] z-10 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl overflow-hidden border-4 sm:border-6 border-white"
                  >
                    <Image
                      src={displayedImages[1]}
                      alt="Dây chuyền sản xuất"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100px, (max-width: 768px) 140px, 200px"
                    />
                  </motion.div>
                )}

                {/* Ảnh góc phải dưới - ĐIỀU CHỈNH LẠI VỊ TRÍ */}
                {displayedImages[2] && (
                  <motion.div
                    initial={{ opacity: 0, x: 50, y: 50 }}
                    animate={{ opacity: 1, x: 10, y: 10 }}
                    transition={{ duration: 0.9, delay: 0.5 }}
                    whileHover={{ scale: 1.08 }}
                    className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 md:bottom-14 md:right-14 w-[30%] h-[30%] sm:w-[35%] sm:h-[35%] z-20 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl overflow-hidden border-4 sm:border-6 border-white"
                  >
                    <Image
                      src={displayedImages[2]}
                      alt="Sản phẩm trưng bày"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100px, (max-width: 768px) 140px, 200px"
                    />
                  </motion.div>
                )}
              </>
            )}

            {/* Blur trang trí - chỉ hiện trên desktop */}
            <div className="hidden lg:block absolute -top-12 -left-12 w-48 h-48 bg-gray-300/30 rounded-full blur-3xl" />
            <div className="hidden lg:block absolute -bottom-12 -right-12 w-64 h-64 bg-gray-400/20 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}