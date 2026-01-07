"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

const fakeCategories = [
  {
    id: 1,
    name: "Giấy in nhiệt",
    slug: "giay-in-nhiet",
    subtitle: "Chất lượng in ấn hoàn hảo",
    productExample: {
      name: "Giấy in nhiệt K80 Φ65 (80mm x 65mm)",
      slug: "giay-in-nhiet-k80-65",
      seoDescription: "Giấy in nhiệt chất lượng cao, in rõ nét, không kẹt giấy. Phù hợp máy in bill, máy POS, siêu thị, cửa hàng tiện lợi. Độ bền màu tốt, không phai theo thời gian.",
    },
    image: "/image/giay-in-nhiet.png",
  },
  {
    id: 2,
    name: "Băng keo công nghiệp",
    slug: "bang-keo-cong-nghiep",
    subtitle: "Giải pháp đóng gói chuyên nghiệp",
    productExample: {
      name: "Băng keo trong/dục dán thùng 100-200 yard",
      slug: "bang-keo-trong-duc-100-yard",
      seoDescription: "Băng keo dán thùng carton siêu dính, chịu lực tốt, không bung keo. Đa dạng kích thước và độ dày, phù hợp đóng gói hàng hóa nặng, xuất khẩu, kho vận và logistics.",
    },
    image: "/image/bang-keo.png",
  },
  {
    id: 3,
    name: "Giấy in mã vạch & Decal",
    slug: "giay-in-ma-vach-decal",
    subtitle: "Bền đẹp & chống nước hiệu quả",
    productExample: {
      name: "Decal mã vạch PVC chống nước",
      slug: "decal-ma-vach-pvc-chong-nuoc",
      seoDescription: "Giấy decal in mã vạch bền đẹp, chống nước, chống xước, bám mực tốt. Lý tưởng cho sản phẩm ngoài trời, kho lạnh, thực phẩm đông lạnh và môi trường ẩm ướt.",
    },
    image: "/image/in-ma-vach.png",
  },
];

export default function HomeCategorySections() {
  return (
    <section className="relative py-24 px-4 md:py-32 lg:py-40 bg-[#fafaf8] overflow-hidden">
      {/* Minimalist background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-gradient-radial from-gray-200/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-[500px] h-[500px] bg-gradient-radial from-gray-200/40 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 lg:mb-28"
        >
          <p className="text-sm tracking-[0.2em] uppercase text-gray-500 mb-4">
            Sản phẩm của chúng tôi
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 tracking-tight">
            Danh mục nổi bật
          </h2>
        </motion.div>

        <div className="space-y-32 lg:space-y-48">
          {fakeCategories.map((category, index) => {
            const isReverse = index % 2 === 1;

            return (
              <motion.article
                key={category.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
              >
                {/* IMAGE */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className={`lg:col-span-7 ${isReverse ? "lg:col-start-6" : ""}`}
                >
                  <div className="relative group">
                    <div className="relative aspect-[3/2] overflow-hidden bg-transparent">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain transition-all duration-700 group-hover:scale-105"
                        priority={index === 0}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* CONTENT */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className={`lg:col-span-5 ${isReverse ? "lg:col-start-1 lg:row-start-1" : ""}`}
                >
                  <div className="space-y-8 max-w-lg">
                    {/* Number badge */}
                    <div className="inline-flex items-center justify-center w-12 h-12 border border-gray-300 text-gray-600 text-sm font-light">
                      0{index + 1}
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 mb-3 tracking-tight leading-tight">
                        {category.name}
                      </h3>
                      <p className="text-base text-gray-500 italic font-light">
                        {category.subtitle}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-base text-gray-700 leading-relaxed font-light">
                      {category.productExample.seoDescription}
                    </p>
                  </div>
                </motion.div>
              </motion.article>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </section>
  );
}