// app/admin/categories/[parentId]/page.tsx
'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Card, Descriptions, Button, message, Spin } from 'antd'
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons'
import { useCategoryOne } from '@/hooks/category/useCategoryOne'
import { useCategoryChildren } from '@/hooks/category/useCategoryChildren'
import CategoryTable from '@/components/admin/category/CategoryTable'


export default function CategoryChildrenPage() {
  const params = useParams()
  const router = useRouter()
  const [page, setPage] = useState(1)
  
  // Lấy parentId từ params
  const parentId = params.parentId as string
  
  // Lấy thông tin parent category
  const { 
    data: parentCategory, 
    isLoading: parentLoading,
    error: parentError 
  } = useCategoryOne(parseInt(parentId))
  
  // Lấy siblings của parent (để hiển thị navigation)
  const { data: siblings } = useCategoryChildren(parentCategory?.parentId || 0)
  
  const handleRowClick = (category: any) => {
    // Đi đến level 3
    router.push(`/admin/categories/${parentId}/${category.id}`)
  }

  const handleBack = () => {
    if (parentCategory?.parentId) {
      // Nếu có parent, quay lại level của parent
      router.push(`/admin/categories/${parentCategory.parentId}`)
    } else {
      // Quay lại level 1
      router.push('/admin/categories')
    }
  }

  if (parentError) {
    message.error('Không tìm thấy danh mục')
    router.push('/admin/categories')
    return null
  }

  return (
    <div>
      {/* Parent Category Info */}
      <Card className="mb-6" loading={parentLoading}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Button 
                icon={<ArrowLeftOutlined />}
                onClick={handleBack}
                size="small"
              />
              <Button 
                icon={<HomeOutlined />}
                onClick={() => router.push('/admin/categories')}
                size="small"
              />
            </div>
            
            <Descriptions title="Thông tin danh mục cha" column={2} bordered>
              <Descriptions.Item label="Tên">{parentCategory?.name}</Descriptions.Item>
              <Descriptions.Item label="Slug">{parentCategory?.slug}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <span className={`px-2 py-1 rounded ${
                  parentCategory?.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                  parentCategory?.status === 'INACTIVE' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {parentCategory?.status}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Vị trí">{parentCategory?.position}</Descriptions.Item>
              <Descriptions.Item label="Mô tả" span={2}>
                {parentCategory?.description || 'Không có mô tả'}
              </Descriptions.Item>
            </Descriptions>
          </div>
          
          {/* Siblings navigation */}
          {siblings && siblings.length > 0 && (
            <div className="ml-6">
              <h4 className="font-medium mb-2">Các danh mục cùng cấp:</h4>
              <div className="flex flex-wrap gap-2">
                {siblings.slice(0, 5).map((sibling: any) => (
                  <Button
                    key={sibling.id}
                    type={sibling.id === parseInt(parentId) ? 'primary' : 'default'}
                    size="small"
                    onClick={() => router.push(`/admin/categories/${sibling.id}`)}
                  >
                    {sibling.name}
                  </Button>
                ))}
                {siblings.length > 5 && (
                  <Button size="small">+{siblings.length - 5} khác</Button>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Children Table */}
      <Card title={`Danh mục cấp 2 (Con của "${parentCategory?.name}")`}>
        {parentLoading ? (
          <div className="flex justify-center py-8">
            <Spin />
          </div>
        ) : (
          <CategoryTable
            level={2}
            parentId={parentId}
            onRowClick={handleRowClick}
            showNavigateToChildren={true}
            parentCategory={parentCategory}
            page={page}
            onPageChange={setPage}
          />
        )}
      </Card>
    </div>
  )
}