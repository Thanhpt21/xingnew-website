'use client';

import React from 'react';
import Link from 'next/link';
import { Image } from 'antd';
import { CalendarOutlined, ArrowRightOutlined, EyeOutlined } from '@ant-design/icons';

import { Blog } from '@/types/blog.type';
import { getImageUrl } from '@/utils/getImageUrl';

interface BlogCardProps {
  blog: Blog;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const imageSrc = getImageUrl(blog.thumb ?? '') || '/images/no-image.png';

  return (
    <Link href={`/tin-tuc/${blog.slug}`} className="block group">
      <div className="relative h-full bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-300">
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden bg-gray-100">
          <Image
            src={imageSrc}
            alt={blog.title}
            preview={false}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            fallback="/images/no-image.png"
          />
          
          {/* Date Badge */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5">
            <div className="flex items-center gap-2">
              <CalendarOutlined className="text-gray-600" />
              <span className="text-xs font-medium text-gray-800">
                {new Date(blog.createdAt).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: 'short',
                })}
              </span>
            </div>
          </div>

          {/* View Count */}
          {blog.numberViews && blog.numberViews > 0 && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5">
              <div className="flex items-center gap-2">
                <EyeOutlined className="text-gray-600" />
                <span className="text-xs font-medium text-gray-800">
                  {blog.numberViews.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-base font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-800 transition-colors duration-200">
            {blog.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
            {blog.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            {/* Read Time (Optional) */}
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <span className="bg-gray-100 px-2 py-1 rounded">
                Tin tức
              </span>
            </div>

            {/* Read More Button */}
            <div className="flex items-center gap-1 text-gray-600 text-sm font-medium group-hover:text-gray-900 transition-colors duration-200">
              <span className="text-xs">Xem chi tiết</span>
              <ArrowRightOutlined className="text-xs" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;