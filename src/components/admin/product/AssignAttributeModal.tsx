'use client'

import { Modal, Select, message, Button, Space, Table, Tag, Tooltip, Alert } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { useAllAttributes } from '@/hooks/attribute/useAllAttributes'
import { useProductAttributes } from '@/hooks/product-attribute/useProductAttributes'
import { useAssignProductAttribute } from '@/hooks/product-attribute/useAssignProductAttribute'
import { useRemoveProductAttribute } from '@/hooks/product-attribute/useRemoveProductAttribute'
import { Attribute } from '@/types/attribute.type'

interface AssignAttributeModalProps {
  productId: number
  open: boolean
  onClose: () => void
}

export const AssignAttributeModal = ({ productId, open, onClose }: AssignAttributeModalProps) => {
  const { data: allAttributes } = useAllAttributes()
  const { data: assignedAttributes, refetch: refetchAssigned } = useProductAttributes(productId)
  const { mutateAsync: assignAttribute } = useAssignProductAttribute()
  const { mutateAsync: removeAttribute } = useRemoveProductAttribute()

  const [selectedAttrs, setSelectedAttrs] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [removingId, setRemovingId] = useState<number | null>(null)

  // Lọc các thuộc tính chưa được gán
  const availableAttributes = allAttributes?.filter(
    (a: Attribute) => !assignedAttributes?.some((pa: any) => pa.attributeId === a.id)
  )

  // Xử lý gán thuộc tính
  const handleAssign = async () => {
    if (!selectedAttrs.length) return message.warning('Vui lòng chọn ít nhất 1 thuộc tính')

    try {
      setLoading(true)
      await Promise.all(
        selectedAttrs.map((attrId) => assignAttribute({ productId, attributeId: attrId }))
      )
      message.success(`Đã gán ${selectedAttrs.length} thuộc tính thành công`)
      setSelectedAttrs([])
      refetchAssigned?.()
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Gán thuộc tính thất bại')
    } finally {
      setLoading(false)
    }
  }

  // Xử lý xóa thuộc tính
  const handleRemove = (attributeId: number, attributeName?: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa thuộc tính',
      content: `Bạn có chắc chắn muốn xóa thuộc tính "${attributeName}" khỏi sản phẩm không?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        setRemovingId(attributeId)
        try {
          await removeAttribute({ productId, attributeId })
          message.success('Xóa thuộc tính thành công')
          refetchAssigned?.()
        } catch (err: any) {
          message.error(err?.response?.data?.message || 'Xóa thất bại')
        } finally {
          setRemovingId(null)
        }
      },
    })
  }

  // Reset khi đóng modal
  useEffect(() => {
    if (!open) {
      setSelectedAttrs([])
      setRemovingId(null)
    }
  }, [open])

  // Lấy tên thuộc tính
  const getAttributeName = (attributeId: number) => {
    const attr = allAttributes?.find((a: Attribute) => a.id === attributeId)
    return attr?.name || `Thuộc tính ${attributeId}`
  }

  // Columns cho bảng
  const columns = [
    {
      title: 'Tên thuộc tính',
      key: 'name',
      render: (record: any) => {
        return getAttributeName(record.attributeId)
      },
    },
    {
      title: 'Ngày gán',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString('vi-VN'),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 80,
      render: (record: any) => {
        const attributeName = getAttributeName(record.attributeId)
        return (
          <Tooltip title="Xóa thuộc tính">
            <Button
              type="text"
              icon={<DeleteOutlined style={{ color: 'red' }} />}
              loading={removingId === record.attributeId}
              onClick={() => handleRemove(record.attributeId, attributeName)}
            />
          </Tooltip>
        )
      },
    }
  ]

  // Đếm số lượng thuộc tính
  const assignedCount = assignedAttributes?.length || 0
  const totalAvailable = allAttributes?.length || 0
  const canAssignMore = availableAttributes && availableAttributes.length > 0

  return (
    <Modal
      title={
        <div>
          <div>Gán thuộc tính cho sản phẩm</div>
          <div className="text-sm font-normal text-gray-500 mt-1">
            Đã gán: {assignedCount} thuộc tính | Còn lại: {availableAttributes?.length || 0} thuộc tính có thể gán
          </div>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={
        <Space>
          <Button onClick={onClose}>Đóng</Button>
          <Button 
            type="primary" 
            loading={loading} 
            onClick={handleAssign}
            disabled={!selectedAttrs.length || !canAssignMore}
          >
            Thêm mới ({selectedAttrs.length})
          </Button>
        </Space>
      }
      width={700}
    >
      <div className="space-y-4">
        {/* Thông báo */}
        {!canAssignMore && assignedCount > 0 && (
          <Alert
            message="Tất cả thuộc tính đã được gán"
            description="Sản phẩm này đã được gán tất cả các thuộc tính có sẵn trong hệ thống."
            type="info"
            showIcon
          />
        )}

        {/* Select để chọn thuộc tính */}
        <div>
          <div className="mb-2 font-medium">Chọn thuộc tính để thêm:</div>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder={
              canAssignMore 
                ? "Chọn thuộc tính" 
                : "Không còn thuộc tính nào để gán"
            }
            value={selectedAttrs}
            onChange={setSelectedAttrs}
            options={availableAttributes?.map((a: Attribute) => ({ 
              label: a.name, 
              value: a.id 
            })) || []}
            maxTagCount={10}
            maxTagTextLength={15}
            disabled={!canAssignMore}
            showSearch
            filterOption={(input, option) =>
              (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
            }
          />
          <div className="text-xs text-gray-500 mt-1">
            Đã chọn {selectedAttrs.length} thuộc tính. Bạn có thể chọn bao nhiêu tùy ý.
          </div>
        </div>

        {/* Danh sách thuộc tính đã gán */}
        <div>
          <div className="mb-2 font-medium">Thuộc tính đã gán ({assignedCount}):</div>
          {assignedCount > 0 ? (
            <Table
              dataSource={assignedAttributes || []}
              columns={columns}
              rowKey={(record) => record.attributeId}
              pagination={false}
              size="middle"
              scroll={{ y: 300 }}
            />
          ) : (
            <div className="text-center py-8 text-gray-400 border border-dashed border-gray-200 rounded">
              Chưa có thuộc tính nào được gán cho sản phẩm này
            </div>
          )}
        </div>

        {/* Tóm tắt */}
        <div className="bg-gray-50 p-3 rounded text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-medium">Tổng thuộc tính hệ thống:</span> {totalAvailable}
            </div>
            <div>
              <span className="font-medium">Đã gán:</span> {assignedCount}
            </div>
            <div>
              <span className="font-medium">Có thể gán:</span> {availableAttributes?.length || 0}
            </div>
            <div>
              <span className="font-medium">Đang chọn:</span> {selectedAttrs.length}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}