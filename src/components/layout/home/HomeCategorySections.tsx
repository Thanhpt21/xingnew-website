"use client";

import { useLevel1CategoriesWithProducts } from "@/hooks/category/useLevel1CategoriesWithProducts";
import Link from "next/link";
import ProductCard from "../product/ProductCard";

export default function HomeCategorySections() {
  const { data, isLoading, isError } =
    useLevel1CategoriesWithProducts({ limit: 5 });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 mt-8 space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="h-[280px] bg-gray-100 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError || !data) return null;

  return (
    <div className="space-y-8 md:space-y-10 px-4">
      {data.map((category) => {
        if (!category.topProducts || category.topProducts.length === 0)
          return null;

        return (
          <section
            key={category.id}
            className="max-w-7xl mx-auto"
          >
            {/* HEADER - Đơn giản hóa */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-blue-800 text-white px-4 py-2 rounded-t">
              {/* Category name */}
              <div className="flex items-center gap-2 font-semibold mb-2 sm:mb-0">
                <span className="text-lg">▶</span>
                <span className="text-base sm:text-lg">{category.name}</span>
              </div>

              {/* Level 3 categories - Hiển thị đơn giản */}
              <div className="flex items-center gap-3 text-sm overflow-x-auto">
                {category.level3Categories?.slice(0, 4).map((lv3) => (
                  <Link
                    key={lv3.id}
                    href={`/san-pham?categoryId=${lv3.id}`}
                    className="text-blue-100 hover:text-yellow-300 transition-colors whitespace-nowrap"
                  >
                    {lv3.name.trim()}
                  </Link>
                ))}
                
                {/* View all - Đơn giản */}
                <Link
                  href={`/san-pham?categoryId=${category.id}`}
                  className="font-medium hover:underline whitespace-nowrap ml-2"
                >
                  Xem tất cả
                </Link>
              </div>
            </div>

            {/* PRODUCT LIST - Grid responsive đơn giản */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 border border-t-0 p-3 md:p-4 bg-white rounded-b">
              {category.topProducts.slice(0, 5).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={0}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}