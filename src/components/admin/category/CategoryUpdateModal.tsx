// components/categories/CategoryUpdateModal.tsx
'use client'

import { Modal, Form, Input, Button, Upload, message, Select, Space, Image } from 'antd'
import { UploadOutlined, DeleteOutlined, EyeOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useUpdateCategory } from '@/hooks/category/useUpdateCategory'
import { createImageUploadValidator, ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE_MB } from '@/utils/upload.utils'
import type { UploadFile } from 'antd/es/upload/interface'
import { Category } from '@/types/category.type'
import { useAllCategories } from '@/hooks/category/useAllCategories'
import { getImageUrl } from '@/utils/getImageUrl'
import { useRouter } from 'next/navigation'

interface CategoryUpdateModalProps {
  open: boolean
  onClose: () => void
  category: Category | null
  refetch?: () => void
  level?: 1 | 2 | 3
}

export const CategoryUpdateModal = ({ 
  open, 
  onClose, 
  category, 
  refetch, 
  level = 1 
}: CategoryUpdateModalProps) => {
  const router = useRouter()
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [originalThumb, setOriginalThumb] = useState<string | null>(null)
  const { mutateAsync, isPending } = useUpdateCategory()
  const { data: allCategories } = useAllCategories()

  const levelText = {
    1: 'gốc (cấp 1)',
    2: 'cấp 2',
    3: 'cấp 3'
  }[level]

  // Reset form và state khi modal đóng
  useEffect(() => {
    if (!open) {
      form.resetFields()
      setFileList([])
      setOriginalThumb(null)
    }
  }, [open, form])

  // Set form values khi category thay đổi
  useEffect(() => {
    if (category && open) {
      form.setFieldsValue({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        position: category.position || 0,
        status: category.status || 'ACTIVE',
        parentId: category.parentId || null,
      })

      // Lưu ảnh gốc và set file list
      if (category.thumb) {
        const imageUrl = getImageUrl(category.thumb)
        setOriginalThumb(category.thumb)
        setFileList([
          {
            uid: '-1',
            name: category.thumb.split('/').pop() || 'thumb.png',
            status: 'done',
            url: imageUrl || undefined,
            thumbUrl: imageUrl || undefined,
          },
        ])
      } else {
        setOriginalThumb(null)
        setFileList([])
      }
    }
  }, [category, open, form])

  // Auto generate slug khi name thay đổi
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    
    form.setFieldsValue({ slug })
  }

  const onFinish = async (values: any) => {
    try {
      const formData = new FormData()
      
      // Append các field
      formData.append('name', values.name)
      formData.append('slug', values.slug)
      formData.append('description', values.description || '')
      formData.append('position', values.position?.toString() || '0')
      formData.append('status', values.status || 'ACTIVE')
      
      // Chỉ append parentId nếu có giá trị thay đổi
      if (values.parentId !== undefined && level > 1) {
        formData.append('parentId', values.parentId === null ? '' : values.parentId.toString())
      }

      // Xử lý ảnh: nếu có file mới hoặc xóa ảnh cũ
      const file = fileList?.[0]?.originFileObj
      if (file) {
        formData.append('thumb', file)
      } else if (fileList.length === 0 && originalThumb) {
        // Nếu xóa ảnh (đã có ảnh cũ nhưng không có ảnh mới)
        formData.append('thumb', '') // Gửi empty string để xóa ảnh
      }

      if (!category?.id) {
        message.error('Không tìm thấy ID danh mục')
        return
      }

      await mutateAsync({ id: category.id, data: formData })
      message.success(`Cập nhật danh mục ${levelText} thành công`)
      onClose()
      refetch?.()
    } catch (err: any) {
      message.error(err?.response?.data?.message || `Lỗi cập nhật danh mục ${levelText}`)
    }
  }

  // Xóa ảnh
  const handleRemoveImage = () => {
    setFileList([])
    message.info('Đã xóa ảnh, ảnh sẽ bị xóa khi lưu')
  }

  // Xem ảnh lớn
  const handlePreviewImage = () => {
    if (fileList[0]?.url) {
      Modal.info({
        title: 'Xem trước ảnh',
        content: (
          <div className="flex justify-center mt-4">
            <Image
              src={fileList[0].url}
              alt="Preview"
              className="max-w-full max-h-[500px] object-contain"
            />
          </div>
        ),
        width: 800,
        okButtonProps: { style: { display: 'none' } },
      })
    }
  }

  // Lọc categories để hiển thị trong parent selector
  const getParentOptions = () => {
    if (!allCategories) return []
    
    return allCategories
      .filter((cat: any) => {
        // Không cho chọn chính nó
        if (cat.id === category?.id) return false
        
        // Level 1: chỉ có thể chọn danh mục gốc (parentId = null)
        if (level === 1) return cat.parentId === null
        
        // Level 2: có thể chọn danh mục level 1
        if (level === 2) {
          return cat.level === 1 || cat.parentId === null
        }
        
        // Level 3: có thể chọn danh mục level 2 hoặc level 1
        if (level === 3) {
          return cat.level === 1 || cat.level === 2
        }
        
        return true
      })
      .map((cat: any) => ({
        label: `${cat.name} (Cấp ${cat.level || 1})`,
        value: cat.id,
        disabled: false
      }))
  }

  return (
    <Modal 
      title={
        <div>
          <div className="flex items-center gap-2">
            <ArrowUpOutlined className="text-blue-500" />
            <span>Cập nhật danh mục {levelText}</span>
          </div>
          {category && (
            <p className="text-sm text-gray-500 mt-1">
              ID: {category.id} • {category.slug}
            </p>
          )}
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={700}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cột trái: Thông tin cơ bản */}
          <div className="space-y-4">
            <Form.Item
              label="Tên danh mục"
              name="name"
              rules={[
                { required: true, message: 'Vui lòng nhập tên danh mục' },
                { min: 2, message: 'Tên danh mục phải có ít nhất 2 ký tự' }
              ]}
            >
              <Input onChange={handleNameChange} />
            </Form.Item>

            <Form.Item
              label="Slug"
              name="slug"
              rules={[
                { required: true, message: 'Vui lòng nhập slug' },
                { pattern: /^[a-z0-9-]+$/, message: 'Slug chỉ chứa chữ thường, số và dấu gạch ngang' },
              ]}
              tooltip="URL thân thiện cho danh mục"
            >
              <Input />
            </Form.Item>

            <Form.Item label="Mô tả" name="description">
              <Input.TextArea rows={3} placeholder="Mô tả ngắn về danh mục..." />
            </Form.Item>
          </div>

          {/* Cột phải: Ảnh và cài đặt */}
          <div className="space-y-4">
            <Form.Item label="Hình ảnh">
              <div className="space-y-2">
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={({ fileList }) => setFileList(fileList)}
                  beforeUpload={createImageUploadValidator(MAX_IMAGE_SIZE_MB)}
                  maxCount={1}
                  accept={ACCEPTED_IMAGE_TYPES}
                  showUploadList={{
                    showPreviewIcon: false,
                    showRemoveIcon: false,
                  }}
                >
                  {fileList.length === 0 && (
                    <div className="flex flex-col items-center">
                      <UploadOutlined className="text-2xl mb-2" />
                      <span>Chọn ảnh</span>
                    </div>
                  )}
                </Upload>
                
                {fileList.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      icon={<EyeOutlined />}
                      onClick={handlePreviewImage}
                      size="small"
                    >
                      Xem ảnh
                    </Button>
                    <Button
                      icon={<DeleteOutlined />}
                      onClick={handleRemoveImage}
                      danger
                      size="small"
                    >
                      Xóa ảnh
                    </Button>
                  </div>
                )}
                
                <div className="text-xs text-gray-500 mt-1">
                  <p>• Kích thước tối đa: {MAX_IMAGE_SIZE_MB}MB</p>
                  <p>• Định dạng: {ACCEPTED_IMAGE_TYPES.replace(/image\//g, '').replace(/,/g, ', ')}</p>
                </div>
              </div>
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item 
                label="Vị trí" 
                name="position"
                tooltip="Vị trí hiển thị, số nhỏ hiển thị trước"
              >
                <Input type="number" min={0} />
              </Form.Item>

              <Form.Item 
                label="Trạng thái" 
                name="status"
              >
                <Select
                  options={[
                    { label: 'Hoạt động', value: 'ACTIVE' },
                    { label: 'Không hoạt động', value: 'INACTIVE' },
                  ]}
                />
              </Form.Item>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <Form.Item className="mt-6">
          <div className="flex justify-between">
            <div className="flex justify-end gap-3">
              <Button onClick={onClose} disabled={isPending}>
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={isPending}
                className="min-w-[100px]"
              >
                {isPending ? 'Đang lưu...' : 'Cập nhật'}
              </Button>
            </div>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}