'use client';

import React, { useMemo, memo, Suspense } from 'react';
import Link from 'next/link';
import { useAllBlogs } from '@/hooks/blog/useAllBlogs';
import { BlogCard } from '@/components/layout/blog/BlogCard';
import { Blog } from '@/types/blog.type';
import { Skeleton, Button } from 'antd';
import { RightOutlined, FireOutlined } from '@ant-design/icons';

// Memoize BlogCard để tránh re-render không cần thiết
const MemoizedBlogCard = memo(BlogCard);

// Component Skeleton cho loading state - RESPONSIVE
const BlogSkeletonGrid = () => (
  <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="bg-white rounded-lg md:rounded-xl overflow-hidden shadow-sm border border-gray-100">
        <div className="relative h-40 xs:h-36 sm:h-44 md:h-48 bg-gray-200 animate-pulse" />
        <div className="p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-3">
          <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-1/4" />
          <div className="h-4 sm:h-5 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="flex items-center justify-between pt-2 sm:pt-3">
            <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-1/3" />
            <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-1/4" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Error boundary component
const BlogErrorFallback = () => (
  <div className="text-center py-8 sm:py-10 md:py-12 px-4">
    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-red-50 mb-3 sm:mb-4">
      <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h3 className="text-base sm:text-lg md:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Không thể tải tin tức</h3>
    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Vui lòng thử lại sau hoặc làm mới trang</p>
    <Button 
      type="primary" 
      onClick={() => window.location.reload()}
      className="bg-[#097761] hover:bg-[#086a57] h-9 sm:h-10 text-sm sm:text-base"
    >
      Thử lại
    </Button>
  </div>
);

// Empty state component
const BlogEmptyState = () => (
  <div className="text-center py-8 sm:py-10 md:py-12 px-4">
    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gray-100 mb-3 sm:mb-4">
      <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
    <h3 className="text-base sm:text-lg md:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Chưa có bài viết nào</h3>
    <p className="text-sm sm:text-base text-gray-600">Các bài viết mới sẽ được cập nhật sớm nhất</p>
  </div>
);

// Separate component để handle data fetching logic
const BlogContent = memo(({ blogs }: { blogs: Blog[] }) => {
  // Tối ưu: Sử dụng useMemo để tránh re-calc khi dependencies không thay đổi
  const latestBlogs = useMemo(() => {
    if (!blogs?.length) return [];
    return blogs
      .filter((blog) => blog.isPublished)
      .slice(0, 4);
  }, [blogs]);

  // Early return nếu không có blog
  if (latestBlogs.length === 0) {
    return <BlogEmptyState />;
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
      {latestBlogs.map((blog) => (
        <MemoizedBlogCard 
          key={blog.id} 
          blog={blog}
        />
      ))}
    </div>
  );
});

BlogContent.displayName = 'BlogContent';

export default function BlogHome() {
  const { data: blogs, isLoading, isError, error } = useAllBlogs();

  // Optimization: Tách logic xử lý state
  const renderContent = () => {
    if (isLoading) {
      return <BlogSkeletonGrid />;
    }

    if (isError) {
      console.error('Blog loading error:', error);
      return <BlogErrorFallback />;
    }

    return <BlogContent blogs={blogs || []} />;
  };

  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white py-10 sm:py-12 md:py-14 lg:py-16 xl:py-20">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8">
        {/* Header với animation và improved design */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <div className="mb-4 sm:mb-0">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1 bg-[#097761]/10 rounded-full mb-2 sm:mb-3">
              <FireOutlined className="text-[#097761] text-xs sm:text-sm" />
              <span className="text-xs sm:text-sm font-medium text-[#097761]">MỚI CẬP NHẬT</span>
            </div>
            
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
              Tin tức & Bài viết
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm md:text-base max-w-2xl">
              Cập nhật thông tin mới nhất về sản phẩm, xu hướng và kinh nghiệm sử dụng
            </p>
          </div>
          
          <Link 
            href="/tin-tuc" 
            className="group hidden sm:inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-[#097761] text-white text-sm font-semibold rounded-lg hover:bg-[#086a57] transition-all duration-300 hover:shadow-lg"
          >
            <span className="text-xs sm:text-sm">Xem tất cả</span>
            <RightOutlined className="text-xs sm:text-xs group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Blog Content với Suspense boundary */}
        <Suspense fallback={<BlogSkeletonGrid />}>
          {renderContent()}
        </Suspense>

        {/* View more link - Always show on mobile, hide on sm+ */}
        <div className="mt-6 sm:mt-8 md:mt-10 text-center sm:hidden">
          <Link 
            href="/tin-tuc" 
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#097761] text-white text-sm font-semibold rounded-lg hover:bg-[#086a57] transition-colors w-full justify-center"
          >
            <span>Xem tất cả bài viết</span>
            <RightOutlined className="text-xs" />
          </Link>
        </div>

       
      </div>
    </section>
  );
}