// components/categories/CategoryTable.tsx
'use client'

import { Table, Tag, Space, Tooltip, Input, Button, Modal, message, Image, Select, Row, Col } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { EditOutlined, DeleteOutlined, PictureOutlined, RightOutlined, EyeOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { Category } from '@/types/category.type'
import { CategoryCreateModal } from './CategoryCreateModal'
import { CategoryUpdateModal } from './CategoryUpdateModal'
import { getImageUrl } from '@/utils/getImageUrl'
import { useRouter } from 'next/navigation'
import { useCategories } from '@/hooks/category/useCategories'
import { useDeleteCategory } from '@/hooks/category/useDeleteCategory'

interface CategoryTableProps {
  level: 1 | 2 | 3
  parentId?: string | number
  onRowClick?: (category: Category) => void
  showNavigateToChildren?: boolean
  parentCategory?: Category | null
  grandParentCategory?: Category | null
  page?: number
  onPageChange?: (page: number) => void
}

export default function CategoryTable({
  level,
  parentId,
  onRowClick,
  showNavigateToChildren = false,
  parentCategory,
  grandParentCategory,
  page = 1,
  onPageChange
}: CategoryTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [openCreate, setOpenCreate] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const { data, isLoading, refetch } = useCategories({ 
    page, 
    limit: 10, 
    search,
    parentId: parentId === 0 || parentId === '0' ? 0 : parentId,
    status: statusFilter || undefined
  })

  
  const { mutateAsync: deleteCategory } = useDeleteCategory()

  const columns: ColumnsType<Category> = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_text, _record, index) => (page - 1) * 10 + index + 1,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'thumb',
      key: 'thumb',
      width: 80,
      align: 'center',
      render: (thumb: string | null) => {
        const imageUrl = getImageUrl(thumb)
        if (!imageUrl) {
          return (
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded">
              <PictureOutlined style={{ fontSize: 20, color: '#d9d9d9' }} />
            </div>
          )
        }
        return (
          <Image
            src={imageUrl}
            alt="Category"
            width={40}
            height={40}
            className="object-cover rounded"
            preview={false}
          />
        )
      },
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Category) => (
        <div className="flex items-center">
          <span 
            className={`${showNavigateToChildren ? 'cursor-pointer hover:text-blue-600' : ''}`}
            onClick={() => onRowClick?.(record)}
          >
            {name}
          </span>
        
        </div>
      ),
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const color = status === 'ACTIVE' ? 'green' : status === 'INACTIVE' ? 'orange' : 'red'
        return <Tag color={color}>{status}</Tag>
      },
      filters: [
        { text: 'ACTIVE', value: 'ACTIVE' },
        { text: 'INACTIVE', value: 'INACTIVE' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết">
            <EyeOutlined
              style={{ color: '#52c41a', cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation() // Ngăn chặn event bubbling
                Modal.info({
                  title: record.name,
                  content: (
                    <div className="mt-4">
                      <p><strong>Slug:</strong> {record.slug}</p>
                      <p><strong>Mô tả:</strong> {record.description || 'Không có'}</p>
                      <p><strong>Trạng thái:</strong> {record.status}</p>
                      <p><strong>Vị trí:</strong> {record.position}</p>
                    </div>
                  ),
                  width: 600,
                })
              }}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <EditOutlined
              style={{ color: '#1890ff', cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation() // Ngăn chặn event bubbling
                setSelectedCategory(record)
                setOpenUpdate(true)
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <DeleteOutlined
              style={{ color: 'red', cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation() // Ngăn chặn event bubbling
                Modal.confirm({
                  title: 'Xác nhận xóa danh mục',
                  content: `Bạn có chắc chắn muốn xóa danh mục "${record.name}" không?`,
                  okText: 'Xóa',
                  okType: 'danger',
                  cancelText: 'Hủy',
                  onOk: async () => {
                    const result = await deleteCategory(record.id)
                    
                    // Kiểm tra response từ backend
                    if (result?.success === false) {
                      message.error(result?.message || 'Xóa thất bại')
                      throw new Error(result?.message) // Throw error để modal không tự hiển thị error
                    }
                    
                    message.success(result?.message || 'Xóa danh mục thành công')
                    refetch?.()
                  },
                })
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  const handleSearch = () => {
    onPageChange?.(1)
    setSearch(inputValue)
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
    onPageChange?.(1)
  }

  const levelTitles = {
    1: 'Danh mục cấp 1 (Gốc)',
    2: parentCategory ? `Danh mục cấp 2 (Con của "${parentCategory.name}")` : 'Danh mục cấp 2',
    3: parentCategory && grandParentCategory 
      ? `Danh mục cấp 3 (Cháu của "${grandParentCategory.name}" - Con của "${parentCategory.name}")`
      : 'Danh mục cấp 3'
  }

  return (
    <div>
      {/* Filters */}
      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} sm={12} md={8}>
          <Input
            placeholder="Tìm kiếm theo tên..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPressEnter={handleSearch}
            allowClear
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Select
            placeholder="Lọc theo trạng thái"
            style={{ width: '100%' }}
            value={statusFilter}
            onChange={handleStatusFilter}
            allowClear
            options={[
              { label: 'ACTIVE', value: 'ACTIVE' },
              { label: 'INACTIVE', value: 'INACTIVE' },
            ]}
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <div className="flex gap-2">
            <Button type="primary" onClick={handleSearch}>
              Tìm kiếm
            </Button>
            <Button 
              onClick={() => {
                setInputValue('')
                setStatusFilter('')
                onPageChange?.(1)
                setSearch('')
              }}
            >
              Đặt lại
            </Button>
            <Button 
              type="primary" 
              onClick={() => setOpenCreate(true)}
            >
              Tạo mới
            </Button>
          </div>
        </Col>
      </Row>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={data?.data || []}
        rowKey="id"
        loading={isLoading}
        onRow={(record) => ({
          onClick: () => onRowClick?.(record),
          style: { cursor: showNavigateToChildren ? 'pointer' : 'default' }
        })}
        pagination={{
          total: data?.total || 0,
          current: page,
          pageSize: 10,
          onChange: (p) => onPageChange?.(p),
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} / ${total} danh mục`,
          showSizeChanger: false,
        }}
      
      />

      {/* Modals */}
      <CategoryCreateModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        refetch={refetch}
        parentId={level > 1 ? Number(parentId) : undefined}
        level={level}
      />

      <CategoryUpdateModal
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        category={selectedCategory}
        refetch={refetch}
        level={level}
      />
    </div>
  )
}