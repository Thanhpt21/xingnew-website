'use client'

import { Modal, Form, Input, Button, Upload, message, Row, Col, InputNumber, Spin, Radio } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import type { UploadFile } from 'antd/es/upload/interface'
import { api } from '@/lib/axios'
import { useCreateProductVariant } from '@/hooks/product-variant/useCreateProductVariant'
import { createImageUploadValidator, ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE_MB } from '@/utils/upload.utils'
import { useProductAttributes } from '@/hooks/product-attribute/useProductAttributes'
import { AttributeValue } from '@/types/attribute-value.type'

interface VariantCreateModalProps {
  open: boolean
  onClose: () => void
  refetch?: () => void
  productId: number | string
}

export const VariantCreateModal = ({ open, onClose, refetch, productId }: VariantCreateModalProps) => {
  const [form] = Form.useForm()
  const [thumbFile, setThumbFile] = useState<UploadFile[]>([])
  // NOTE: changed value type to number (attributeValueId)
  const [selectedAttrValues, setSelectedAttrValues] = useState<Record<number, number>>({})
  const [attributeValuesMap, setAttributeValuesMap] = useState<Record<number, AttributeValue[]>>({})
  const [attributesInfo, setAttributesInfo] = useState<Record<number, { id: number; name: string }>>({})
  const { mutateAsync, isPending } = useCreateProductVariant()

  // Lấy attribute của product
  const { data: productAttributesData, isLoading: loadingAttrs } = useProductAttributes(Number(productId))
  const productAttributes = Array.isArray(productAttributesData) ? productAttributesData : []

  // Tạo SKU ngẫu nhiên
  const generateRandomSKU = () => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `SKU${timestamp}${random}`
  }

  // Lấy thông tin attribute và giá trị của chúng
  useEffect(() => {
    if (!open || productAttributes.length === 0) return

    const fetchAttributesAndValues = async () => {
      const map: Record<number, AttributeValue[]> = {}
      const attrInfoMap: Record<number, { id: number; name: string }> = {}

      await Promise.all(
        productAttributes.map(async (pa) => {
          try {
            const [attrRes, valRes] = await Promise.all([
              api.get(`/attributes/${pa.attributeId}`),
              api.get('/attribute-values', { params: { attributeId: pa.attributeId } }),
            ])
            attrInfoMap[pa.attributeId] = attrRes.data.data
            map[pa.attributeId] = valRes.data.data || []
          } catch (err) {
            console.error('Error fetching attribute data:', err)
          }
        })
      )

      setAttributeValuesMap(map)
      setAttributesInfo(attrInfoMap)
    }

    fetchAttributesAndValues()
  }, [open, productAttributes])

  // Khởi tạo form khi mở modal - tự sinh SKU
  useEffect(() => {
    if (open) {
      // Tạo SKU ngẫu nhiên
      const sku = generateRandomSKU()
      form.setFieldsValue({
        sku: sku,
        priceDelta: 0, // Giá mặc định là 0
        stock: 0, // Stock mặc định là 0
        barcode: '' // Barcode không bắt buộc
      })
    }
  }, [open, form])

  // Gửi form
  const onFinish = async (values: any) => {
    try {
      // Kiểm tra chọn đủ thuộc tính
      for (const pa of productAttributes) {
        if (!selectedAttrValues[pa.attributeId]) {
          message.error('Vui lòng chọn đầy đủ giá trị cho tất cả thuộc tính')
          return
        }
      }

      const formData = new FormData()
      formData.append('sku', values.sku)
      formData.append('productId', String(productId))
      if (values.barcode) formData.append('barcode', values.barcode)
      
      // Sử dụng giá chênh lệch
      const priceDelta = values.priceDelta || 0
      formData.append('priceDelta', String(priceDelta))
      
      // Thêm stock
      const stock = values.stock || 0
      formData.append('stock', String(stock))
      
      formData.append('attrValues', JSON.stringify(selectedAttrValues))

      if (thumbFile[0]?.originFileObj) {
        formData.append('thumb', thumbFile[0].originFileObj)
      }

      await mutateAsync({ productId, formData })

      message.success('Tạo biến thể thành công')
      form.resetFields()
      setThumbFile([])
      setSelectedAttrValues({})
      onClose()
      refetch?.()
    } catch (err: any) {
      console.error('Create variant error:', err)
      message.error(err?.response?.data?.message || 'Lỗi tạo biến thể')
    }
  }

  // Reset state khi modal đóng
  useEffect(() => {
    if (!open) {
      form.resetFields()
      setThumbFile([])
      setSelectedAttrValues({})
      setAttributeValuesMap({})
    }
  }, [open, form])

  if (loadingAttrs) return <Spin />

  return (
    <Modal
      title="Tạo biến thể mới"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={700}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="SKU"
              name="sku"
              rules={[{ required: true, message: 'Vui lòng nhập SKU' }]}
              extra="SKU tự động được tạo"
            >
              <Input 
                placeholder="SKU tự động"
                suffix={
                  <Button 
                    size="small" 
                    type="link" 
                    onClick={() => {
                      const newSKU = generateRandomSKU()
                      form.setFieldsValue({ sku: newSKU })
                    }}
                  >
                    Tạo lại
                  </Button>
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              label="Barcode" 
              name="barcode"
              extra="Không bắt buộc"
            >
              <Input placeholder="Nhập barcode (tuỳ chọn)" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Chênh lệch giá"
              name="priceDelta"
              tooltip="Giá chênh lệch so với sản phẩm gốc"
              initialValue={0}
            >
              <InputNumber 
                min={-10000000} 
                style={{ width: '100%' }} 
                placeholder="0"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Tồn kho"
              name="stock"
              initialValue={0}
              rules={[{ required: true, message: 'Vui lòng nhập tồn kho' }]}
            >
              <InputNumber 
                min={0} 
                style={{ width: '100%' }} 
                placeholder="0"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Radio cho từng attribute */}
        {productAttributes.map(pa => {
          const attr = attributesInfo[pa.attributeId]
          if (!attr) return null
          return (
            <Form.Item 
              key={pa.attributeId} 
              label={attr.name}
              required
              help={!selectedAttrValues[pa.attributeId] ? "Vui lòng chọn giá trị" : ""}
            >
              <Radio.Group
                value={selectedAttrValues[pa.attributeId] ?? null}
                onChange={e => setSelectedAttrValues(prev => ({ ...prev, [pa.attributeId]: Number(e.target.value) }))}
              >
                {attributeValuesMap[pa.attributeId]?.map(val => (
                  // NOTE: use val.id as radio value (attributeValueId)
                  <Radio key={val.id} value={val.id}>
                    {val.value}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          )
        })}

        <Form.Item 
          label="Ảnh đại diện"
          extra="Không bắt buộc"
        >
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

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isPending} block>
            Tạo mới
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}