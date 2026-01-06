// components/categories/CategoryCreateModal.tsx
'use client'

import { Modal, Form, Input, Button, Upload, message, Select } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useCreateCategory } from '@/hooks/category/useCreateCategory'
import type { UploadFile } from 'antd/es/upload/interface'
import { createImageUploadValidator, ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE_MB } from '@/utils/upload.utils'
import { useAllCategories } from '@/hooks/category/useAllCategories'

interface CategoryCreateModalProps {
  open: boolean
  onClose: () => void
  refetch?: () => void
  parentId?: number
  level: 1 | 2 | 3
}

export const CategoryCreateModal = ({ 
  open, 
  onClose, 
  refetch, 
  parentId,
  level 
}: CategoryCreateModalProps) => {
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const { mutateAsync, isPending } = useCreateCategory()
  
  // Lấy tất cả categories để chọn parent (cho level 2, 3)
  const { data: allCategories } = useAllCategories()
  
  const levelText = {
    1: 'gốc',
    2: 'cấp 2',
    3: 'cấp 3'
  }[level]

  const onFinish = async (values: any) => {
    try {
      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('slug', values.slug)
      formData.append('description', values.description || '')
      formData.append('position', values.position || '0')
      formData.append('status', values.status || 'ACTIVE')
      
      // Thêm parentId nếu có
      if (values.parentId !== undefined) {
        formData.append('parentId', values.parentId.toString())
      } else if (parentId !== undefined) {
        formData.append('parentId', parentId.toString())
      }

      const file = fileList?.[0]?.originFileObj
      if (file) formData.append('thumb', file)

      await mutateAsync(formData)
      message.success(`Tạo danh mục ${levelText} thành công`)
      onClose()
      form.resetFields()
      setFileList([])
      refetch?.()
    } catch (err: any) {
      message.error(err?.response?.data?.message || `Lỗi tạo danh mục ${levelText}`)
    }
  }

  useEffect(() => {
    if (!open) {
      form.resetFields()
      setFileList([])
    } else {
      // Auto generate slug from name
      form.setFieldsValue({ slug: '' })
    }
  }, [open, form])

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

  return (
    <Modal 
      title={`Tạo danh mục ${levelText}`} 
      open={open} 
      onCancel={onClose} 
      footer={null} 
      destroyOnClose
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {level === 1 && allCategories && allCategories.length > 0 && (
          <Form.Item
            label="Danh mục cha"
            name="parentId"
            tooltip="Để trống để tạo danh mục gốc"
          >
            <Select
              placeholder="Chọn danh mục cha (nếu có)"
              allowClear
              options={allCategories.map((cat: any) => ({
                label: cat.name,
                value: cat.id,
                disabled: cat.id === parentId
              }))}
            />
          </Form.Item>
        )}
        
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
        >
          <Input />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={3} />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="Vị trí" name="position">
            <Input type="number" min={0} defaultValue={0} />
          </Form.Item>

          <Form.Item label="Trạng thái" name="status" initialValue="ACTIVE">
            <Select
              options={[
                { label: 'ACTIVE', value: 'ACTIVE' },
                { label: 'INACTIVE', value: 'INACTIVE' },
              ]}
            />
          </Form.Item>
        </div>

        <Form.Item label="Hình ảnh">
          <Upload
            listType="picture"
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            beforeUpload={createImageUploadValidator(MAX_IMAGE_SIZE_MB)}
            maxCount={1}
            accept={ACCEPTED_IMAGE_TYPES}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={onClose}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={isPending}>
              Tạo mới
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}