// app/admin/categories/[parentId]/[parentId2]/page.tsx
'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, Descriptions, Button, Breadcrumb, message, Spin } from 'antd'
import { ArrowLeftOutlined, HomeOutlined, RightOutlined } from '@ant-design/icons'
import { useCategoryOne } from '@/hooks/category/useCategoryOne'
import CategoryTable from '@/components/admin/category/CategoryTable'



export default function CategoryGrandChildrenPage() {
  const params = useParams()
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [breadcrumbs, setBreadcrumbs] = useState<any[]>([])
  
  // Lấy params từ URL
  const parentId1 = params.parentId as string  // Level 2 parent
  const parentId2 = params.parentId2 as string // Level 3 parent
  
  // Lấy thông tin các cấp
  const { 
    data: grandParentCategory, 
    isLoading: grandParentLoading,
    error: grandParentError 
  } = useCategoryOne(parseInt(parentId1))
  
  const { 
    data: parentCategory, 
    isLoading: parentLoading,
    error: parentError 
  } = useCategoryOne(parseInt(parentId2))

  // Build breadcrumb
  useEffect(() => {
    const buildBreadcrumbs = async () => {
      const crumbs = []
      
      // Level 1
      crumbs.push({ id: 0, name: 'Danh mục gốc', path: '/admin/categories' })
      
      // Level 2
      if (grandParentCategory) {
        crumbs.push({ 
          id: grandParentCategory.id, 
          name: grandParentCategory.name, 
          path: `/admin/categories/${grandParentCategory.id}` 
        })
      }
      
      // Level 3
      if (parentCategory) {
        crumbs.push({ 
          id: parentCategory.id, 
          name: parentCategory.name, 
          path: `/admin/categories/${grandParentCategory?.id}/${parentCategory.id}` 
        })
      }
      
      setBreadcrumbs(crumbs)
    }
    
    if (grandParentCategory && parentCategory) {
      buildBreadcrumbs()
    }
  }, [grandParentCategory, parentCategory])

  const handleRowClick = (category: any) => {
    // Level 3 là cấp cuối, không đi sâu hơn
    // Có thể redirect đến sản phẩm hoặc action khác
    message.info('Đây là cấp cuối cùng của danh mục')
  }

  const handleBack = () => {
    // Quay lại level 2
    router.push(`/admin/categories/${parentId1}`)
  }

  if (grandParentError || parentError) {
    message.error('Không tìm thấy danh mục')
    router.push('/admin/categories')
    return null
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb separator={<RightOutlined />}>
          {breadcrumbs.map((crumb, index) => (
            <Breadcrumb.Item key={crumb.id}>
              {index < breadcrumbs.length - 1 ? (
                <a 
                  onClick={() => router.push(crumb.path)}
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  {crumb.name}
                </a>
              ) : (
                <span className="font-semibold">{crumb.name}</span>
              )}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      </div>

      {/* Category Hierarchy Info */}
      <Card className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button 
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
          >
            Quay lại cấp 2
          </Button>
          <Button 
            icon={<HomeOutlined />}
            onClick={() => router.push('/admin/categories')}
          >
            Về danh mục gốc
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Grand Parent Info */}
          <Card title="Danh mục cấp 1" size="small" loading={grandParentLoading}>
            {grandParentCategory && (
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Tên">{grandParentCategory.name}</Descriptions.Item>
                <Descriptions.Item label="Slug">{grandParentCategory.slug}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <span className={`px-2 py-1 text-xs rounded ${
                    grandParentCategory.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {grandParentCategory.status}
                  </span>
                </Descriptions.Item>
              </Descriptions>
            )}
          </Card>

          {/* Parent Info */}
          <Card title="Danh mục cấp 2" size="small" loading={parentLoading}>
            {parentCategory && (
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Tên">{parentCategory.name}</Descriptions.Item>
                <Descriptions.Item label="Slug">{parentCategory.slug}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <span className={`px-2 py-1 text-xs rounded ${
                    parentCategory.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {parentCategory.status}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Mô tả">
                  {parentCategory.description || 'Không có mô tả'}
                </Descriptions.Item>
              </Descriptions>
            )}
          </Card>
        </div>
      </Card>

      {/* Grand Children Table */}
      <Card title={`Danh mục cấp 3`}>
        {parentLoading ? (
          <div className="flex justify-center py-8">
            <Spin />
          </div>
        ) : (
          <CategoryTable
            level={3}
            parentId={parentId2}
            onRowClick={handleRowClick}
            showNavigateToChildren={false} // Level 3 là cuối cùng
            parentCategory={parentCategory}
            grandParentCategory={grandParentCategory}
            page={page}
            onPageChange={setPage}
          />
        )}
      </Card>
    </div>
  )
}