"use client";

import {
  TruckOutlined,
  SafetyCertificateOutlined,
  CreditCardOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";

const features = [
  {
    icon: <TruckOutlined />,
    title: "Giao hàng nhanh",
    desc: "Toàn quốc – đúng hẹn",
  },
  {
    icon: <SafetyCertificateOutlined />,
    title: "Sản phẩm chất lượng",
    desc: "Nguồn gốc rõ ràng – chính hãng",
  },
  {
    icon: <CreditCardOutlined />,
    title: "Thanh toán linh hoạt",
    desc: "COD, chuyển khoản, thẻ",
  },
  {
    icon: <CustomerServiceOutlined />,
    title: "Hỗ trợ tận tâm",
    desc: "Tư vấn miễn phí 24/7",
  },
];

export default function HomeFeatures() {
  return (
    <section className="w-full bg-white py-8 md:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className={`
                group
                flex flex-col items-center text-center
                p-5 sm:p-6
                bg-white
                border border-gray-200
                rounded-2xl
                shadow-sm
                hover:shadow-xl hover:shadow-gray-200/50
                hover:border-gray-300
                transition-all duration-500 ease-out
                hover:-translate-y-2
              `}
            >
              {/* Icon Container */}
              <div
                className="
                  mb-4
                  w-14 h-14 sm:w-16 sm:h-16
                  flex items-center justify-center
                  bg-gray-100
                  rounded-full
                  text-gray-700
                  text-2xl sm:text-3xl
                  group-hover:bg-gray-200
                  group-hover:text-gray-900
                  group-hover:scale-110
                  transition-all duration-500
                "
              >
                {f.icon}
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="
                  font-bold
                  text-base sm:text-lg
                  text-gray-900
                  group-hover:text-gray-950
                  transition-colors duration-300
                ">
                  {f.title}
                </h3>
                <p className="
                  text-sm sm:text-base
                  text-gray-600
                  leading-relaxed
                  px-2
                ">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}