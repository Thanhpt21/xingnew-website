'use client'

import React, { useState, useMemo } from 'react'
import { useAllCategories } from '@/hooks/category/useAllCategories'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Factory, 
  ChevronRight, 
  Grid3X3,
  Package,
  TrendingUp,
  Layers,
  Hash,
  Award,
  Shield,
  Globe,
  Leaf,
  Zap,
  Filter,
  ArrowRight,
  Tag
} from 'lucide-react'

interface Category {
  id: number
  name: string
  thumb?: string
  productCount?: number
}

// Kích thước cố định cho tất cả ảnh
const IMAGE_SIZE = {
  width: 96,   // 96px cho desktop
  height: 96,  // 96px cho desktop (vuông 1:1)
  mobile: {
    width: 80,  // 80px cho mobile
    height: 80  // 80px cho mobile
  }
}

// Skeleton loading component với kích thước cố định
const CategorySkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="group flex flex-col items-center"
  >
    <div 
      className="mb-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"
      style={{
        width: `${IMAGE_SIZE.width}px`,
        height: `${IMAGE_SIZE.height}px`
      }}
    />
    <div className="h-4 w-16 bg-gray-200 rounded"></div>
  </motion.div>
)

// Fallback image component với kích thước cố định
const CategoryImage = ({ 
  thumb, 
  name, 
  index 
}: { 
  thumb?: string; 
  name: string; 
  index: number 
}) => {
  // Container style cố định
  const containerStyle = {
    width: '100%',
    height: '100%',
    position: 'relative' as const
  }

  // Image style cố định
  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    objectPosition: 'center' as const
  }

  if (thumb) {
    return (
      <img
        src={thumb.startsWith('http') ? thumb : `${process.env.NEXT_PUBLIC_API_URL}${thumb}`}
        alt={name}
        style={imageStyle}
        className="transition-transform duration-500 group-hover:scale-105"
        loading={index < 12 ? "eager" : "lazy"}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          const fallbackDiv = e.currentTarget.parentElement?.querySelector('.fallback-image');
          if (fallbackDiv) {
            (fallbackDiv as HTMLDivElement).style.display = 'flex';
          }
        }}
      />
    )
  }

  // Fallback với màu gradient công nghiệp
  const gradients = [
    'from-emerald-500 to-teal-600',
    'from-cyan-500 to-blue-600',
    'from-teal-500 to-emerald-600',
    'from-blue-500 to-indigo-600',
    'from-green-500 to-emerald-600',
    'from-sky-500 to-cyan-600',
    'from-lime-500 to-green-600',
    'from-blue-400 to-cyan-500'
  ]
  
  const gradient = gradients[index % gradients.length]
  const initials = name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 3)
  
  return (
    <div 
      className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${gradient} text-white font-bold text-sm fallback-image`}
    >
      {initials}
    </div>
  )
}

// Icon cho danh mục dựa trên tên
const getCategoryIcon = (categoryName: string, index: number) => {
  const name = categoryName.toLowerCase()
  
  if (name.includes('pp') || name.includes('poly') || name.includes('cẩu')) {
    return <Package size={16} className="text-emerald-600" />
  } else if (name.includes('cotton') || name.includes('vải') || name.includes('thun')) {
    return <Layers size={16} className="text-blue-600" />
  } else if (name.includes('nylon') || name.includes('dây') || name.includes('đai')) {
    return <Hash size={16} className="text-cyan-600" />
  } else if (name.includes('in') || name.includes('chữ') || name.includes('dệt')) {
    return <Tag size={16} className="text-teal-600" />
  } else if (name.includes('ống') || name.includes('string') || name.includes('ruy')) {
    return <Zap size={16} className="text-green-600" />
  } else {
    const defaultIcons = [Factory, Package, Layers, Hash, Tag, Zap]
    const Icon = defaultIcons[index % defaultIcons.length]
    return <Icon size={16} className="text-gray-600" />
  }
}

export default function IndustrialCategories() {
  const { data: categories, isLoading } = useAllCategories()
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  const displayedCategories = useMemo(() => {
    if (!categories) return []
    
    return [...categories].sort((a, b) => {
      const aHasImage = a.thumb ? 1 : 0
      const bHasImage = b.thumb ? 1 : 0
      return bHasImage - aHasImage
    }).slice(0, 20)
  }, [categories])

  if (isLoading) {
    return (
      <section className="py-12 md:py-16 bg-gradient-to-b from-white to-gray-50/20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-4 border border-emerald-200">
              <Factory className="text-emerald-600" size={24} />
            </div>
            <div className="h-8 w-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-2 animate-pulse"></div>
            <div className="h-4 w-80 bg-gray-200 rounded"></div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 md:gap-5">
            {[...Array(14)].map((_, i) => (
              <CategorySkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!categories || categories.length === 0) {
    return null
  }

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-white to-gray-50/20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-10 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-full mb-4 border border-emerald-200 shadow-sm">
            <Layers size={16} className="text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">DANH MỤC SẢN PHẨM</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
              SẢN PHẨM
            </span>
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent ml-2">
              CHUYÊN DỤNG
            </span>
          </h2>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1 w-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
            <div className="h-1 w-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
            <div className="h-1 w-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
          </div>
          
          <p className="text-gray-600 text-center max-w-2xl mb-8 text-base md:text-lg">
            Khám phá đầy đủ các loại dây đai, dây dệt công nghiệp với đa dạng chất liệu và ứng dụng
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg">
              <Shield size={14} className="text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Chất lượng ISO</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
              <Globe size={14} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Xuất khẩu Châu Âu</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 rounded-lg">
              <Leaf size={14} className="text-teal-600" />
              <span className="text-sm font-medium text-teal-700">REACH/ROHS</span>
            </div>
          </div>
        </motion.div>

        {/* Categories grid với kích thước cố định */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 md:gap-5">
          {displayedCategories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                transition: {
                  delay: index * 0.02,
                  duration: 0.3
                }
              }}
              whileHover={{ 
                y: -4,
                transition: { duration: 0.2 }
              }}
              className="group flex flex-col items-center"
              onMouseEnter={() => setSelectedCategory(cat.id)}
              onMouseLeave={() => setSelectedCategory(null)}
            >
              <Link
                href={`/san-pham?categoryId=${cat.id}`}
                className="flex flex-col items-center w-full"
                prefetch={false}
              >
                {/* Image container với kích thước cố định */}
                <div 
                  className="relative mb-3"
                  style={{
                    width: `${IMAGE_SIZE.width}px`,
                    height: `${IMAGE_SIZE.height}px`
                  }}
                >
                  {/* Main image frame - cùng kích thước cho tất cả */}
                  <div className={`relative w-full h-full rounded-lg overflow-hidden border transition-all duration-300 ${
                    selectedCategory === cat.id
                      ? 'border-emerald-500 shadow-lg shadow-emerald-500/20'
                      : 'border-gray-200 group-hover:border-emerald-300'
                  } bg-white`}>
                    <CategoryImage 
                      thumb={cat.thumb} 
                      name={cat.name} 
                      index={index}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Top corner icon */}
                    <div className="absolute top-2 left-2 w-6 h-6 rounded bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
                      {getCategoryIcon(cat.name, index)}
                    </div>
                  </div>
                  
                  {/* Product count badge */}
                  {cat.productCount && cat.productCount > 0 && (
                    <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold flex items-center justify-center shadow-lg border border-white ${
                      cat.productCount > 50 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                    }`}>
                      {cat.productCount > 99 ? '99+' : cat.productCount}
                    </div>
                  )}

                  {/* No-image badge */}
                  {!cat.thumb && (
                    <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 text-white text-xs flex items-center justify-center shadow-md">
                      <Hash size={10} />
                    </div>
                  )}
                </div>

                {/* Category name - độ rộng cố định */}
                <div className="w-full text-center max-w-[96px]">
                  <span className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-emerald-700 transition-colors line-clamp-2 px-1">
                    {cat.name.toUpperCase()}
                  </span>
                  {cat.productCount && cat.productCount > 0 && (
                    <div className="text-[11px] text-gray-500 mt-1 font-medium">
                      {cat.productCount} SẢN PHẨM
                    </div>
                  )}
                  
                  {/* Mini indicator line */}
                  <div className="mt-2 h-0.5 w-6 mx-auto bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Info panel */}
        {categories.length > displayedCategories.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-8 p-5 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 rounded-xl border border-emerald-100 shadow-sm"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Factory size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800">
                    Hiển thị {displayedCategories.length}/{categories.length} danh mục sản phẩm
                  </p>
                  <p className="text-sm text-gray-600">
                    Còn {categories.length - displayedCategories.length} danh mục khác
                  </p>
                </div>
              </div>
              
              <Link 
                href="/danh-muc" 
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-lg hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
              >
                <Filter size={16} />
                XEM TẤT CẢ DANH MỤC
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Top categories cho mobile */}
        <div className="lg:hidden mt-8">

          
          {/* Mobile categories với kích thước cố định */}
          <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {displayedCategories
              .filter(cat => cat.productCount && cat.productCount > 30)
              .slice(0, 6)
              .map((cat, idx) => (
              <Link
                key={cat.id}
                href={`/san-pham?categoryId=${cat.id}`}
                className="flex-shrink-0 flex flex-col items-center min-w-[110px]"
              >
                <div 
                  className="relative mb-2"
                  style={{
                    width: `${IMAGE_SIZE.mobile.width}px`,
                    height: `${IMAGE_SIZE.mobile.height}px`
                  }}
                >
                  <div className="w-full h-full rounded-lg overflow-hidden border border-emerald-200 bg-white">
                    <CategoryImage 
                      thumb={cat.thumb} 
                      name={cat.name} 
                      index={idx}
                    />
                  </div>
                  
                  {cat.productCount && cat.productCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm border border-white">
                      {cat.productCount > 99 ? '99+' : cat.productCount}
                    </div>
                  )}
                </div>
                
                <span className="text-xs font-semibold text-emerald-800 text-center line-clamp-2 px-1">
                  {cat.name.split(' ')[0]}
                </span>
                <div className="text-[10px] text-gray-600 text-center mt-0.5">
                  {cat.productCount} sp
                </div>
              </Link>
            ))}
          </div>
        </div>

       
      </div>
    </section>
  )
}