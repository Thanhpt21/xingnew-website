'use client'

import { Modal, Form, Input, Button, Upload, message, Row, Col, Select, Checkbox, InputNumber } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useEffect, useState, useMemo } from 'react'
import { useUpdateProduct } from '@/hooks/product/useUpdateProduct'
import type { Product } from '@/types/product.type'
import { createImageUploadValidator, ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE_MB } from '@/utils/upload.utils'
import { useAllBrands } from '@/hooks/brand/useAllBrands'
import { useAllCategories } from '@/hooks/category/useAllCategories'
import { useAllAttributes } from '@/hooks/attribute/useAllAttributes'
import type { UploadFile } from 'antd/es/upload/interface'
import { Category } from '@/types/category.type'
import { Brand } from '@/types/brand.type'
import DynamicRichTextEditor from '@/components/common/RichTextEditor'
import { useCategoryTree } from '@/hooks/category/useCategoryTree'

interface ProductUpdateModalProps {
  open: boolean
  onClose: () => void
  product: Product | null
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

export const ProductUpdateModal = ({ open, onClose, product, refetch }: ProductUpdateModalProps) => {
  const [form] = Form.useForm()
  const [thumbFile, setThumbFile] = useState<UploadFile[]>([])
  const [imageFiles, setImageFiles] = useState<UploadFile[]>([])
  const { mutateAsync, isPending } = useUpdateProduct()
  const [description, setDescription] = useState<string>('')
  const [selectedLevel1, setSelectedLevel1] = useState<number | null>(null)
  const [selectedLevel2, setSelectedLevel2] = useState<number | null>(null)
  const [selectedLevel3Id, setSelectedLevel3Id] = useState<number | null>(null)

  const { data: brands } = useAllBrands()
  const { data: categoryTree } = useCategoryTree()
  const { data: attributes } = useAllAttributes()

  // Tìm category path từ categoryId
  useEffect(() => {
    if (product?.categoryId && categoryTree) {
      const findCategoryPath = (categories: CategoryTreeItem[], targetId: number, path: number[] = []): number[] | null => {
        for (const cat of categories) {
          const newPath = [...path, cat.id]
          if (cat.id === targetId) return newPath
          if (cat.children?.length) {
            const found = findCategoryPath(cat.children, targetId, newPath)
            if (found) return found
          }
        }
        return null
      }

      const path = findCategoryPath(categoryTree, product.categoryId)
      if (path) {
        if (path.length >= 1) setSelectedLevel1(path[0])
        if (path.length >= 2) setSelectedLevel2(path[1])
        if (path.length >= 3) setSelectedLevel3Id(path[2])
      }
    }
  }, [product?.categoryId, categoryTree])

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

  const resetCategorySelection = () => {
    setSelectedLevel1(null)
    setSelectedLevel2(null)
    setSelectedLevel3Id(null)
  }

  const getImageUrl = (thumb: string | null): string | undefined => { 
    if (!thumb) return undefined;
    if (thumb.startsWith('http://') || thumb.startsWith('https://')) {
      return thumb;
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const cleanBaseUrl = baseUrl.replace(/\/$/, '');
    const cleanThumb = thumb.replace(/^\//, '');
    return `${cleanBaseUrl}/${cleanThumb}`;
  };

  useEffect(() => {
    if (product && open) {
      // Set initial form values
      form.setFieldsValue({
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        basePrice: product.basePrice,
        status: product.status,
        isPublished: product.isPublished,
        isFeatured: product.isFeatured,
        categoryId: product.categoryId || undefined,
        brandId: product.brandId || undefined,
        seoTitle: product.seoTitle || '',
        seoDescription: product.seoDescription || '',
        seoKeywords: product.seoKeywords || '',
        weight: product.weight || 0,
        length: product.length || 0,
        width: product.width || 0,
        height: product.height || 0,
        stock: product.stock || 0,
      })

      setDescription(product.description || '')

      if (product.thumb) setThumbFile([{ uid: '-1', name: product.thumb.split('/').pop() || 'thumb.png', status: 'done', url: getImageUrl(product.thumb) }])
      if (product.images?.length) {
        setImageFiles(product.images.map((url, idx) => ({ uid: idx.toString(), name: `img${idx}.png`, status: 'done', url: getImageUrl(url) })))
      }
    } else if (!open) {
      form.resetFields()
      setThumbFile([])
      setImageFiles([])
      setDescription('')
      resetCategorySelection()
    }
  }, [product, open, form])

  const handleDescriptionChange = (value: string) => {
    setDescription(value)
  }

  const onFinish = async (values: any) => {
    if (!product) return
    try {
      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('slug', values.slug)
      formData.append('description', description || '')
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
      formData.append('stock', values.stock?.toString() || '0')

      // Thumb & Images
      if (thumbFile[0]?.originFileObj) formData.append('thumb', thumbFile[0].originFileObj)
      imageFiles.forEach(file => { if (file.originFileObj) formData.append('images', file.originFileObj) })

      await mutateAsync({ id: product.id, formData })
      message.success('Cập nhật sản phẩm thành công')
      onClose()
      form.resetFields()
      setThumbFile([])
      setImageFiles([])
      refetch?.()
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Lỗi cập nhật sản phẩm')
    }
  }

  return (
    <Modal title="Cập nhật sản phẩm" open={open} onCancel={onClose} footer={null} destroyOnClose width={800}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Row 1: Thumb & Images */}
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

        {/* Row 2: Name & Slug */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Slug" name="slug" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 3: BasePrice & Status */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Giá cơ bản" name="basePrice" rules={[{ required: true }]}>
              <InputNumber 
                min={0} 
                style={{ width: '100%' }} 
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Trạng thái" name="status">
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

        {/* Row 4: Category 3 cấp */}
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

        {/* Row 5: Brand & Stock */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Thương hiệu" name="brandId">
              <Select allowClear placeholder="Chọn thương hiệu">
                {brands?.map((b: Brand) => <Select.Option key={b.id} value={b.id}>{b.name}</Select.Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Tồn kho (stock)"
              name="stock"
              rules={[{ required: true, message: 'Vui lòng nhập số lượng tồn kho!' }]}
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

        {/* Row 6: Checkboxes */}
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

        {/* Row 7: Dimensions */}
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              label="Trọng lượng (g)"
              name="weight"
              rules={[{ required: true, message: 'Vui lòng nhập trọng lượng!' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Dài (cm)"
              name="length"
              rules={[{ required: true, message: 'Vui lòng nhập chiều dài!' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Rộng (cm)"
              name="width"
              rules={[{ required: true, message: 'Vui lòng nhập chiều rộng!' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Cao (cm)"
              name="height"
              rules={[{ required: true, message: 'Vui lòng nhập chiều cao!' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="SEO Title" name="seoTitle">
          <Input />
        </Form.Item>

        <Form.Item label="SEO Description" name="seoDescription">
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item label="SEO Keywords" name="seoKeywords">
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isPending} block>
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}