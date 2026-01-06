// app/admin/categories/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Card, Statistic, Row, Col } from 'antd'
import { FolderOutlined, AppstoreOutlined } from '@ant-design/icons'
import { useCategoryTree } from '@/hooks/category/useCategoryTree'
import CategoryTable from '@/components/admin/category/CategoryTable'

export default function CategoriesPage() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  
  // Lấy tree để tính tổng số categories
  const { data: categoryTree, isLoading: treeLoading } = useCategoryTree()

  // Tính toán thống kê
  const totalCategories = categoryTree?.reduce((total: number, cat: any) => {
    const countChildren = (category: any) => {
      let count = 1 // Count self
      if (category.children && category.children.length > 0) {
        count += category.children.reduce((sum: number, child: any) => 
          sum + countChildren(child), 0)
      }
      return count
    }
    return total + countChildren(cat)
  }, 0) || 0

  const totalLevel1 = categoryTree?.length || 0
  const totalLevel2 = categoryTree?.reduce((sum: number, cat: any) => 
    sum + (cat.children?.length || 0), 0) || 0
  const totalLevel3 = categoryTree?.reduce((sum: number, cat: any) => 
    sum + (cat.children?.reduce((childSum: number, child: any) => 
      childSum + (child.children?.length || 0), 0) || 0), 0) || 0

  const handleRowClick = (category: any) => {
    // Đi đến level 2
    router.push(`/admin/categories/${category.id}`)
  }

  return (
    <div>
      {/* Statistics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng số danh mục"
              value={totalCategories}
              prefix={<FolderOutlined />}
              loading={treeLoading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Danh mục cấp 1"
              value={totalLevel1}
              prefix={<AppstoreOutlined />}
              loading={treeLoading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Danh mục cấp 2"
              value={totalLevel2}
              loading={treeLoading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Danh mục cấp 3"
              value={totalLevel3}
              loading={treeLoading}
            />
          </Card>
        </Col>
      </Row>

      {/* Main table */}
      <Card title="Danh mục cấp 1 (Gốc)" bordered={false}>
        <CategoryTable
          level={1}
          parentId={0}
          onRowClick={handleRowClick}
          showNavigateToChildren={true}
          page={page}
          onPageChange={setPage}
        />
      </Card>
    </div>
  )
}