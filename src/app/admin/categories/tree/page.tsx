// app/admin/categories/tree/page.tsx
'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Tree, Button, Input, Space } from 'antd'
import type { DataNode } from 'antd/es/tree'
import { SearchOutlined, ExpandAltOutlined, CompressOutlined } from '@ant-design/icons'
import { useCategoryTree } from '@/hooks/category/useCategoryTree'

export default function CategoryTreePage() {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState('')
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]) // Sử dụng React.Key
  const [autoExpandParent, setAutoExpandParent] = useState(true)
  
  const { data: categories, isLoading } = useCategoryTree()

  // Build tree data với search highlight
  const buildTreeData = (categories: any[], level = 1): DataNode[] => {
    return categories.map(category => {
      const strTitle = category.name as string
      const index = strTitle.toLowerCase().indexOf(searchValue.toLowerCase())
      const beforeStr = strTitle.substring(0, index)
      const afterStr = strTitle.substring(index + searchValue.length)
      
      const title = index > -1 ? (
        <span>
          {beforeStr}
          <span className="bg-yellow-200">{searchValue}</span>
          {afterStr}
          <span className="ml-2 text-xs text-gray-400">
            ({category._count?.products || 0} sp, {category._count?.children || 0} con)
          </span>
        </span>
      ) : (
        <span>
          {strTitle}
          <span className="ml-2 text-xs text-gray-400">
            ({category._count?.products || 0} sp, {category._count?.children || 0} con)
          </span>
        </span>
      )

      const node: DataNode = {
        key: category.id.toString(),
        title: (
          <div className="flex items-center justify-between group">
            <span className="font-medium">{title}</span>
            <Space size="small" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                size="small"
                type="link"
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(`/admin/categories/${category.id}`)
                }}
              >
                Xem
              </Button>
              {level < 3 && category._count?.children > 0 && (
                <Button 
                  size="small"
                  type="link"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/admin/categories/${category.id}`)
                  }}
                >
                  Mở ({category._count.children})
                </Button>
              )}
            </Space>
          </div>
        ),
      }

      if (category.children && category.children.length > 0 && level < 3) {
        node.children = buildTreeData(category.children, level + 1)
      }

      return node
    })
  }

  // Sử dụng useMemo để tối ưu performance
  const treeData = useMemo(() => {
    return categories ? buildTreeData(categories) : []
  }, [categories, searchValue])

  const getParentKey = (key: string, tree: DataNode[]): string => {
    let parentKey = ''
    
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i]
      if (node.children) {
        if (node.children.some((item: DataNode) => item.key === key)) {
          parentKey = node.key as string
        } else {
          const foundKey = getParentKey(key, node.children as DataNode[])
          if (foundKey) {
            parentKey = foundKey
          }
        }
      }
    }
    
    return parentKey
  }

  const onSearch = (value: string) => {
    setSearchValue(value)
    
    if (!categories || !value) {
      setExpandedKeys([])
      return
    }

    const newExpandedKeys: React.Key[] = []
    
    const searchNode = (data: DataNode[]) => {
      data.forEach((node) => {
        const strTitle = (node.title as any)?.props?.children?.[0]?.props?.children || node.title
        if (typeof strTitle === 'string' && strTitle.toLowerCase().includes(value.toLowerCase())) {
          newExpandedKeys.push(node.key)
          
          // Tìm parent keys
          let parentKey = getParentKey(node.key as string, treeData)
          while (parentKey) {
            newExpandedKeys.push(parentKey)
            parentKey = getParentKey(parentKey, treeData)
          }
        }
        
        if (node.children) {
          searchNode(node.children as DataNode[])
        }
      })
    }
    
    searchNode(treeData)
    setExpandedKeys([...new Set(newExpandedKeys)])
    setAutoExpandParent(true)
  }

  // Sửa onExpand để nhận React.Key[]
  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys)
    setAutoExpandParent(false)
  }

  const expandAll = () => {
    const getAllKeys = (data: DataNode[]): React.Key[] => {
      let keys: React.Key[] = []
      data.forEach(node => {
        keys.push(node.key)
        if (node.children) {
          keys = [...keys, ...getAllKeys(node.children as DataNode[])]
        }
      })
      return keys
    }
    
    if (treeData.length > 0) {
      const allKeys = getAllKeys(treeData)
      setExpandedKeys(allKeys)
    }
  }

  const collapseAll = () => {
    setExpandedKeys([])
  }

  return (
    <div>
      <Card
        title="Cây danh mục (Tối đa 3 cấp)"
        extra={
          <Space>
            <Button 
              icon={<ExpandAltOutlined />} 
              onClick={expandAll}
              size="small"
            >
              Mở tất cả
            </Button>
            <Button 
              icon={<CompressOutlined />} 
              onClick={collapseAll}
              size="small"
            >
              Đóng tất cả
            </Button>
          </Space>
        }
        loading={isLoading}
      >
        <div className="mb-4">
          <Input
            placeholder="Tìm kiếm danh mục..."
            prefix={<SearchOutlined />}
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            allowClear
          />
        </div>

        {categories && (
          <Tree
            showLine
            showIcon
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            treeData={treeData}
            onExpand={onExpand}
            className="category-tree"
          />
        )}
      </Card>
      
      <div className="mt-6 text-sm text-gray-600">
        <p className="mb-2"><strong>Hướng dẫn:</strong></p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Click vào tên danh mục để mở/rút gọn</li>
          <li>Click "Xem" để đi đến trang quản lý danh mục đó</li>
          <li>Click "Mở" để đi đến trang danh mục con</li>
          <li>Tối đa hiển thị 3 cấp danh mục</li>
          <li>Danh mục cấp 3 không thể có danh mục con</li>
        </ul>
      </div>
    </div>
  )
}