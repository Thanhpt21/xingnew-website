'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Input, Select, Pagination, Button, Spin, Empty } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

import { useAllBlogs } from '@/hooks/blog/useAllBlogs';
import BlogCard from '@/components/layout/blog/BlogCard';
import { Blog } from '@/types/blog.type';

export default function NewsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const pageSize = 12;

  // Fetch blogs
  const { data: blogs, isLoading, isError } = useAllBlogs();

  // Get URL params
  useEffect(() => {
    const searchParam = searchParams.get('search') || '';
    const pageParam = searchParams.get('page') || '1';
    const sortParam = searchParams.get('sort') || 'newest';
    
    setSearch(searchParam);
    setPage(parseInt(pageParam));
    setSortBy(sortParam);
  }, [searchParams]);

  // Update URL when filters change
  const updateUrl = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (page > 1) params.set('page', page.toString());
    if (sortBy !== 'newest') params.set('sort', sortBy);
    
    router.push(`/tin-tuc${params.toString() ? '?' + params.toString() : ''}`);
  };

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      updateUrl();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [search]);

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    setPage(1);
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    params.set('page', '1');
    router.push(`/tin-tuc?${params.toString()}`);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/tin-tuc?${params.toString()}`);
    window.scrollTo(0, 0);
  };

  // Filter and sort blogs
  const filteredBlogs = useMemo(() => {
    if (!blogs) return [];
    
    let result = blogs.filter((blog: Blog) => blog.isPublished);
    
    // Search filter
    if (search) {
      const searchTerm = search.toLowerCase();
      result = result.filter((blog: any) => 
        blog.title?.toLowerCase().includes(searchTerm) ||
        blog.content?.toLowerCase().includes(searchTerm) ||
        blog.description?.toLowerCase().includes(searchTerm)
      );
    }
    
    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        result.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'popular':
        result.sort((a: any, b: any) => (b.numberViews || 0) - (a.numberViews || 0));
        break;
    }
    
    return result;
  }, [blogs, search, sortBy]);

  // Pagination
  const totalBlogs = filteredBlogs.length;
  const paginatedBlogs = filteredBlogs.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Reset filters
  const resetFilters = () => {
    setSearch('');
    setSortBy('newest');
    setPage(1);
    router.push('/tin-tuc');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold mb-2">Đã xảy ra lỗi</h2>
        <p className="text-gray-600 mb-4">Không thể tải danh sách tin tức</p>
        <Button
          onClick={() => window.location.reload()}
          icon={<ReloadOutlined />}
        >
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-gray-600">Tin tức</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Tin tức & Blog
          </h1>
          <p className="text-gray-600">
            Cập nhật thông tin mới nhất về sản phẩm và kiến thức hữu ích
          </p>
        </div>

       

        {/* Blog Grid */}
        {paginatedBlogs.length === 0 ? (
          <Empty
            description={
              search ? `Không tìm thấy bài viết cho "${search}"` : 'Chưa có bài viết nào'
            }
            className="py-12"
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {paginatedBlogs.map((blog: Blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>

            {/* Pagination */}
            {totalBlogs > pageSize && (
              <div className="flex justify-center mt-8">
                <Pagination
                  current={page}
                  total={totalBlogs}
                  pageSize={pageSize}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  showQuickJumper
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}