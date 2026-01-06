'use client'

import { Modal, Form, Input, Button, Upload, message, Row, Col, Select, Checkbox, InputNumber } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { useCreateProduct } from '@/hooks/product/useCreateProduct'
import { useAllBrands } from '@/hooks/brand/useAllBrands'

import { useAllAttributes } from '@/hooks/attribute/useAllAttributes'
import type { UploadFile } from 'antd/es/upload/interface'
import { createImageUploadValidator, ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE_MB } from '@/utils/upload.utils'
import DynamicRichTextEditor from '@/components/common/RichTextEditor'
import { useCategoryTree } from '@/hooks/category/useCategoryTree'

interface ProductCreateModalProps {
  open: boolean
  onClose: () => void
  refetch?: () => void
}

interface CategoryTreeItem {
  id: number
  name: string
  children?: CategoryTreeItem[]
  level: number
  _count: {
    products: number
    children: number
  }
}

export const ProductCreateModal = ({ open, onClose, refetch }: ProductCreateModalProps) => {
  const [form] = Form.useForm()
  const [thumbFile, setThumbFile] = useState<UploadFile[]>([])
  const [imageFiles, setImageFiles] = useState<UploadFile[]>([])
  const { mutateAsync, isPending } = useCreateProduct()
  const [description, setDescription] = useState<string>('')

  const { data: brands } = useAllBrands()
  const { data: categoryTree } = useCategoryTree()

  const [selectedLevel1, setSelectedLevel1] = useState<number | null>(null)
  const [selectedLevel2, setSelectedLevel2] = useState<number | null>(null)
  const [selectedLevel3Id, setSelectedLevel3Id] = useState<number | null>(null)

  const [priceValue, setPriceValue] = useState<string>('')

  // Hàm chuyển đổi tiêu đề thành slug
  const convertToSlug = useCallback((text: string): string => {
    return text
      .toLowerCase() // Chuyển thành chữ thường
      .normalize('NFD') // Tách dấu
      .replace(/[\u0300-\u036f]/g, '') // Xóa dấu
      .replace(/[đĐ]/g, 'd') // Chuyển đ/Đ thành d
      .replace(/[^a-z0-9\s-]/g, '') // Xóa ký tự đặc biệt
      .replace(/\s+/g, '-') // Thay khoảng trắng bằng dấu gạch ngang
      .replace(/-+/g, '-') // Xóa nhiều dấu gạch ngang liên tiếp
      .trim() // Xóa khoảng trắng đầu cuối
  }, [])

  // Hàm định dạng tiền tệ với dấu phẩy
  const formatCurrency = useCallback((value: string): string => {
    if (!value) return ''
    
    // Xóa tất cả ký tự không phải số
    const numericValue = value.replace(/[^\d]/g, '')
    
    if (numericValue === '') return ''
    
    // Chuyển thành số và định dạng
    const number = parseInt(numericValue, 10)
    
    // Định dạng với dấu phẩy phân cách hàng nghìn
    return number.toLocaleString('vi-VN')
  }, [])

  // Xử lý khi nhập tên sản phẩm - tự động sinh slug
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    const slug = convertToSlug(name)
    
    // Cập nhật giá trị slug trong form
    form.setFieldsValue({
      slug: slug
    })
  }, [form, convertToSlug])

  // Xử lý khi nhập giá - tự động định dạng
  const handlePriceChange = useCallback((value: number | string | null) => {
    if (value === null || value === '') {
      setPriceValue('')
      form.setFieldValue('basePrice', '')
      return
    }
    
    // Chuyển thành string nếu là number
    const stringValue = typeof value === 'number' ? value.toString() : value
    
    // Định dạng tiền tệ
    const formattedValue = formatCurrency(stringValue)
    
    // Lưu giá trị đã định dạng vào state để hiển thị
    setPriceValue(formattedValue)
    
    // Lưu giá trị số (không có dấu phẩy) vào form
    const numericValue = stringValue.replace(/[^\d]/g, '')
    form.setFieldValue('basePrice', numericValue || '0')
  }, [form, formatCurrency])

  // Custom formatter cho InputNumber để hiển thị dấu phẩy
  const priceFormatter = useCallback((value: number | string | undefined): string => {
    if (!value) return ''
    const stringValue = value.toString()
    return formatCurrency(stringValue)
  }, [formatCurrency])

  // Custom parser cho InputNumber để chuyển đổi ngược
  const priceParser = useCallback((value: string | undefined): string => {
    if (!value) return ''
    // Xóa dấu phẩy và trả về số
    return value.replace(/[^\d]/g, '')
  }, [])

  const level1Options = useMemo(() => {
    return categoryTree?.filter((cat: CategoryTreeItem) => cat.level === 1)
      .map((cat: CategoryTreeItem) => ({
        label: cat.name,
        value: cat.id
      })) || []
  }, [categoryTree])

  const level2Options = useMemo(() => {
    if (!selectedLevel1 || !categoryTree) return []
    const level1Cat = categoryTree.find((cat: CategoryTreeItem) => cat.id === selectedLevel1)
    return level1Cat?.children?.filter((child: CategoryTreeItem) => child.level === 2)
      .map((child: CategoryTreeItem) => ({
        label: child.name,
        value: child.id
      })) || []
  }, [selectedLevel1, categoryTree])

  const level3Options = useMemo(() => {
    if (!selectedLevel2 || !categoryTree || !selectedLevel1) return []
    const level1Cat = categoryTree.find((cat: CategoryTreeItem) => cat.id === selectedLevel1)
    if (!level1Cat?.children) return []
    
    const level2Cat = level1Cat.children.find((child: CategoryTreeItem) => child.id === selectedLevel2)
    return level2Cat?.children?.filter((child: CategoryTreeItem) => child.level === 3)
      .map((child: CategoryTreeItem) => ({
        label: child.name,
        value: child.id
      })) || []
  }, [selectedLevel1, selectedLevel2, categoryTree])

  const resetCategorySelection = () => {
    setSelectedLevel1(null)
    setSelectedLevel2(null)
    setSelectedLevel3Id(null)
  }

  const handleLevel1Change = (value: number) => {
    setSelectedLevel1(value)
    setSelectedLevel2(null)
    setSelectedLevel3Id(null)
    form.setFieldValue('categoryId', null)
  }

  const handleLevel2Change = (value: number) => {
    setSelectedLevel2(value)
    setSelectedLevel3Id(null)
    form.setFieldValue('categoryId', null)
  }

  const handleLevel3Change = (value: number) => {
    setSelectedLevel3Id(value)
    form.setFieldValue('categoryId', value)
  }

  const onFinish = async (values: any) => {
    try {
      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('slug', values.slug)
      
      // Giá đã được xử lý và lưu dạng số (không có dấu phẩy)
      formData.append('basePrice', values.basePrice?.toString() || '0')
      
      formData.append('status', values.status)
      formData.append('isPublished', values.isPublished ? 'true' : 'false')
      formData.append('isFeatured', values.isFeatured ? 'true' : 'false')
      formData.append('categoryId', values.categoryId?.toString() || '')
      formData.append('brandId', values.brandId?.toString() || '')
      formData.append('seoTitle', values.seoTitle || '')
      formData.append('seoDescription', values.seoDescription || '')
      formData.append('seoKeywords', values.seoKeywords || '')
      formData.append('weight', values.weight?.toString() || '0')
      formData.append('length', values.length?.toString() || '0')
      formData.append('width', values.width?.toString() || '0')
      formData.append('height', values.height?.toString() || '0')
      formData.append('description', description || '')
      formData.append('stock', values.stock?.toString() || '0')
      
      if (thumbFile[0]?.originFileObj) formData.append('thumb', thumbFile[0].originFileObj)
      imageFiles.forEach(file => { if (file.originFileObj) formData.append('images', file.originFileObj) })

      if (values.attributes && values.attributes.length > 0) {
        values.attributes.forEach((attrId: number) => formData.append('attributes', attrId.toString()))
      }

      await mutateAsync(formData)
      message.success('Tạo sản phẩm thành công')
      onClose()
      form.resetFields()
      setThumbFile([])
      setImageFiles([])
      setPriceValue('') // Reset giá trị hiển thị
      resetCategorySelection()
      refetch?.()
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Lỗi tạo sản phẩm')
    }
  }

  useEffect(() => {
    if (!open) {
      form.resetFields()
      setThumbFile([])
      setImageFiles([])
      setDescription('')
      setPriceValue('') // Reset giá trị hiển thị
      resetCategorySelection()
    }
  }, [open, form])

  const handleDescriptionChange = (value: string) => {
    setDescription(value)
    form.setFieldValue('description', value)
  }

  return (
    <Modal title="Tạo sản phẩm mới" open={open} onCancel={onClose} footer={null} destroyOnClose width={800}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Ảnh đại diện">
              <Upload
                listType="picture"
                fileList={thumbFile}
                onChange={({ fileList }) => setThumbFile(fileList)}
                beforeUpload={createImageUploadValidator(MAX_IMAGE_SIZE_MB)}
                maxCount={1}
                accept={ACCEPTED_IMAGE_TYPES}
              >
                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Ảnh sản phẩm">
              <Upload
                listType="picture"
                fileList={imageFiles}
                onChange={({ fileList }) => setImageFiles(fileList)}
                beforeUpload={createImageUploadValidator(MAX_IMAGE_SIZE_MB)}
                multiple
                accept={ACCEPTED_IMAGE_TYPES}
              >
                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              label="Tên sản phẩm" 
              name="name" 
              rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
            >
              <Input 
                onChange={handleNameChange}
                placeholder="Nhập tên sản phẩm..."
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              label="Slug" 
              name="slug" 
              rules={[{ required: true, message: 'Vui lòng nhập slug!' }]}
              extra="Slug sẽ tự động được tạo từ tên sản phẩm"
            >
              <Input placeholder="slug-tu-dong-duoc-tao" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              label="Giá cơ bản" 
              name="basePrice"
              rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm!' }]}
            >
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                placeholder="0"
                formatter={priceFormatter}
                parser={priceParser}
                onChange={handlePriceChange}
                value={priceValue}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Trạng thái" name="status" initialValue="ACTIVE">
              <Select>
                <Select.Option value="ACTIVE">ACTIVE</Select.Option>
                <Select.Option value="INACTIVE">INACTIVE</Select.Option>
                <Select.Option value="DRAFT">DRAFT</Select.Option>
                <Select.Option value="OUT_OF_STOCK">OUT_OF_STOCK</Select.Option>
                <Select.Option value="DELETED">DELETED</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Danh mục cấp 1" required>
              <Select
                allowClear
                placeholder="Chọn cấp 1"
                options={level1Options}
                value={selectedLevel1}
                onChange={handleLevel1Change}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Danh mục cấp 2">
              <Select
                allowClear
                placeholder="Chọn cấp 2"
                options={level2Options}
                value={selectedLevel2}
                onChange={handleLevel2Change}
                disabled={!selectedLevel1}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="categoryId" hidden>
              <Input />
            </Form.Item>
            <Form.Item label="Danh mục cấp 3">
              <Select
                allowClear
                placeholder="Chọn cấp 3"
                options={level3Options}
                value={selectedLevel3Id}
                onChange={handleLevel3Change}
                disabled={!selectedLevel2}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Thương hiệu" name="brandId">
              <Select allowClear placeholder="Chọn thương hiệu">
                {brands?.map((b: any) => (
                  <Select.Option key={b.id} value={b.id}>{b.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Tồn kho (stock)"
              name="stock"
              rules={[{ required: true, message: 'Vui lòng nhập số lượng tồn kho!' }]}
              initialValue={0}
            >
              <InputNumber 
                min={0} 
                style={{ width: '100%' }} 
                placeholder="0"
                step={1}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Mô tả sản phẩm">
          <div style={{ border: '1px solid #d9d9d9', borderRadius: '4px', overflow: 'hidden' }}>
            <DynamicRichTextEditor
              value={description}
              onChange={handleDescriptionChange}
              height={300}
            />
          </div>
          <Form.Item name="description" hidden>
            <Input />
          </Form.Item>
        </Form.Item>

        <Row gutter={16}>
          
          <Col span={8}>
            <Form.Item name="isPublished" valuePropName="checked">
              <Checkbox>Đã xuất bản</Checkbox>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="isFeatured" valuePropName="checked">
              <Checkbox>Nổi bật</Checkbox>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Trọng lượng (g)"
              name="weight"
              rules={[{ required: true, message: 'Vui lòng nhập trọng lượng!' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Dài (cm)"
              name="length"
              rules={[{ required: true, message: 'Vui lòng nhập chiều dài!' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Rộng (cm)"
              name="width"
              rules={[{ required: true, message: 'Vui lòng nhập chiều rộng!' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Cao (cm)"
              name="height"
              rules={[{ required: true, message: 'Vui lòng nhập chiều cao!' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
            </Form.Item>
          </Col>
        </Row>
        
        <Form.Item label="SEO Title" name="seoTitle">
          <Input placeholder="Nhập tiêu đề SEO..." />
        </Form.Item>

        <Form.Item label="SEO Description" name="seoDescription">
          <Input.TextArea rows={2} placeholder="Nhập mô tả SEO..." />
        </Form.Item>

        <Form.Item label="SEO Keywords" name="seoKeywords">
          <Input placeholder="Nhập từ khóa SEO, cách nhau bằng dấu phẩy" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isPending} block>
            Tạo mới
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}