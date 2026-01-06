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
    desc: "Nguồn gốc rõ ràng",
  },
  {
    icon: <CreditCardOutlined />,
    title: "Thanh toán linh hoạt",
    desc: "COD, chuyển khoản",
  },
  {
    icon: <CustomerServiceOutlined />,
    title: "Hỗ trợ kỹ thuật",
    desc: "Tư vấn 24/7",
  },
];

export default function HomeFeatures() {
  return (
    <section className="px-4 py-6 md:py-8">
      <div className="max-w-7xl mx-auto">
        {/* CHỈ GIỮ LẠI MỘT LAYOUT DUY NHẤT - XÓA ALTERNATIVE LAYOUT */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className={`
                flex items-center gap-3 sm:gap-4
                border border-blue-600 rounded-lg sm:rounded-xl
                p-3 sm:p-4
                bg-white
                hover:shadow-md hover:shadow-blue-100
                transition-all duration-300
                hover:scale-[1.02] active:scale-[0.98]
              `}
            >
              {/* Icon */}
              <div
                className="
                  text-blue-700 
                  text-2xl sm:text-3xl
                  flex-shrink-0
                  w-10 h-10 sm:w-12 sm:h-12
                  flex items-center justify-center
                  bg-blue-50
                  rounded-full
                "
              >
                {f.icon}
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <p className="
                  font-semibold 
                  text-sm sm:text-base
                  text-gray-800
                  mb-1
                  line-clamp-1
                ">
                  {f.title}
                </p>
                <p className="
                  text-xs sm:text-sm
                  text-gray-500
                  line-clamp-1
                ">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* XÓA HOÀN TOÀN PHẦN ALTERNATIVE LAYOUT */}
        {/* <div className="block sm:hidden mt-4">...</div> */}
      </div>
    </section>
  );
}