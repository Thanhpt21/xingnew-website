"use client";

import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
  category: any;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/san-pham?categoryId=${category.id}`}
      className="group border border-gray-200 bg-white hover:shadow-md transition rounded-sm overflow-hidden"
    >
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        {category.thumb ? (
          <Image
            src={category.thumb}
            alt={category.name}
            width={200}
            height={200}
            className="object-contain"
          />
        ) : (
          <span className="text-gray-400 text-sm">No image</span>
        )}
      </div>

      <div className="p-3 text-center">
        <h3 className="text-sm font-medium text-gray-800 group-hover:text-black line-clamp-2">
          {category.name}
        </h3>
      </div>
    </Link>
  );
}
