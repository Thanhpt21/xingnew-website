// app/admin/categories/layout.tsx
'use client'

import { ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button, Breadcrumb } from 'antd'
import { HomeOutlined, UnorderedListOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import Link from 'next/link'

interface CategoriesLayoutProps {
  children: ReactNode
}

export default function CategoriesLayout({ children }: CategoriesLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  
  // Phân tích path để tạo breadcrumb
  const segments = pathname.split('/').filter(Boolean)
  const isCategoriesPage = pathname === '/admin/categories'
  const isLevel2 = segments.length === 3 // /admin/categories/123
  const isLevel3 = segments.length === 4 // /admin/categories/123/456
  
  const getParentIdFromPath = () => {
    if (isLevel2) return segments[2] // parentId1
    if (isLevel3) return segments[2] // parentId1 (để quay lại level 2)
    return null
  }
  
  const getGrandParentIdFromPath = () => {
    if (isLevel3) return segments[3] // parentId2
    return null
  }

  return (
    <div className="container mx-auto py-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <Breadcrumb.Item>
          <Link href="/admin">Admin</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href="/admin/categories">Danh mục</Link>
        </Breadcrumb.Item>
        
        {/* Dynamic breadcrumb cho level 2, 3 */}
        {isLevel2 && <Breadcrumb.Item>Level 2</Breadcrumb.Item>}
        {isLevel3 && (
          <>
            <Breadcrumb.Item>Level 2</Breadcrumb.Item>
            <Breadcrumb.Item>Level 3</Breadcrumb.Item>
          </>
        )}
      </Breadcrumb>
      
      {/* Header với navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">
            Quản lý Danh mục
            {isLevel2 && <span className="text-lg font-normal text-gray-600 ml-2">(Cấp 2)</span>}
            {isLevel3 && <span className="text-lg font-normal text-gray-600 ml-2">(Cấp 3)</span>}
          </h1>
          
          {/* Navigation buttons */}
          <div className="flex gap-2">
            {!isCategoriesPage && (
              <Button 
                icon={<ArrowLeftOutlined />}
                onClick={() => {
                  if (isLevel3) {
                    // Quay lại level 2
                    router.push(`/admin/categories/${getParentIdFromPath()}`)
                  } else if (isLevel2) {
                    // Quay lại level 1
                    router.push('/admin/categories')
                  }
                }}
              >
                Quay lại
              </Button>
            )}
            
            <Button 
              icon={<HomeOutlined />}
              onClick={() => router.push('/admin/categories')}
              type={isCategoriesPage ? 'primary' : 'default'}
            >
              Danh mục gốc
            </Button>
            
         
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="bg-white rounded-lg shadow p-6">
        {children}
      </div>
    </div>
  )
}