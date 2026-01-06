'use client'

import { Modal, Form, Input, Button, Upload, message, Switch } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { useCreateBlog } from '@/hooks/blog/useCreateBlog'
import type { UploadFile } from 'antd/es/upload/interface'
import DynamicRichTextEditor from '@/components/common/RichTextEditor'

interface ContentItem {
  title: string
  body: string
}

interface BlogCreateModalProps {
  open: boolean
  onClose: () => void
  refetch?: () => void
}

export const BlogCreateModal = ({ open, onClose, refetch }: BlogCreateModalProps) => {
  const [form] = Form.useForm()
  const { mutateAsync, isPending } = useCreateBlog()
  const [contentItems, setContentItems] = useState<ContentItem[]>([{ title: '', body: '' }])
  const [fileList, setFileList] = useState<UploadFile[]>([])

  // Hàm chuyển tiếng Việt có dấu → không dấu và sinh slug chuẩn
  const generateSlug = (title: string): string => {
    return title
      .normalize('NFD') // Chuyển dấu về dạng riêng
      .replace(/[\u0300-\u036f]/g, '') // Xóa dấu
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Xóa ký tự đặc biệt
      .replace(/\s+/g, '-') // Thay khoảng trắng bằng gạch ngang
      .replace(/-+/g, '-') // Gộp nhiều gạch ngang thành một
  }

  // Tự động sinh slug khi Title thay đổi
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    const slug = generateSlug(title)
    form.setFieldsValue({ slug })
  }

  const handleAddContentItem = () => setContentItems([...contentItems, { title: '', body: '' }])
  const handleRemoveContentItem = (index: number) => setContentItems(contentItems.filter((_, i) => i !== index))
  const handleContentItemChange = (index: number, name: 'title' | 'body', value: string) => {
    const newItems = [...contentItems]
    newItems[index][name] = value
    setContentItems(newItems)
  }

  const handleFileChange = ({ fileList: newFileList }: any) => setFileList(newFileList)

  const onFinish = async (values: any) => {
    try {
      const formData = new FormData()
      formData.append('title', values.title)
      formData.append('slug', values.slug || generateSlug(values.title)) // Dự phòng nếu slug rỗng
      formData.append('description', values.description || '')
      if (fileList[0]?.originFileObj) formData.append('thumb', fileList[0].originFileObj)
      formData.append('isPublished', values.isPublished ? 'true' : 'false')
      formData.append('content', JSON.stringify(contentItems))

      await mutateAsync(formData)
      message.success('Tạo blog thành công')
      onClose()
      form.resetFields()
      setFileList([])
      setContentItems([{ title: '', body: '' }])
      refetch?.()
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Tạo blog thất bại')
    }
  }

  // Reset form khi đóng modal
  useEffect(() => {
    if (!open) {
      form.resetFields()
      setFileList([])
      setContentItems([{ title: '', body: '' }])
    }
  }, [open, form])

  return (
    <Modal
      title="Tạo Blog Mới"
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      destroyOnClose
      className="top-10"
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Thumbnail */}
        <Form.Item label="Ảnh thumbnail (khuyến nghị 1200x630)">
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={() => false} // Ngăn upload tự động
            maxCount={1}
            accept="image/*"
          >
            {fileList.length === 0 && (
              <div>
                <UploadOutlined />
                <div className="mt-2 text-xs">Tải lên</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        {/* Tiêu đề */}
        <Form.Item
          label="Tiêu đề bài viết"
          name="title"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
        >
          <Input
            placeholder="Nhập tiêu đề bài viết..."
            onChange={handleTitleChange} // Tự động sinh slug
            size="large"
          />
        </Form.Item>

        {/* Slug - tự động sinh + cho phép chỉnh thủ công */}
        <Form.Item
          label="Slug (URL thân thiện)"
          name="slug"
          rules={[
            { required: true, message: 'Vui lòng nhập slug' },
            { pattern: /^[a-z0-9-]+$/, message: 'Slug chỉ chứa chữ thường, số và dấu gạch ngang' },
          ]}
        >
          <Input placeholder="tự-động-sinh-khi-nhập-tiêu-đề" size="large" />
        </Form.Item>

        {/* Mô tả ngắn */}
        <Form.Item label="Mô tả ngắn (SEO)" name="description">
          <Input.TextArea rows={3} placeholder="Mô tả ngắn gọn về bài viết (tối ưu SEO)" />
        </Form.Item>

        {/* Nội dung động */}
        <Form.Item label="Nội dung bài viết">
          <div className="space-y-6">
            {contentItems.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-6 bg-gray-50/50 relative"
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-800">Phần nội dung #{index + 1}</h4>
                  {contentItems.length > 1 && (
                    <Button
                      danger
                      size="small"
                      onClick={() => handleRemoveContentItem(index)}
                    >
                      Xóa phần này
                    </Button>
                  )}
                </div>

                <Form.Item label="Tiêu đề phần">
                  <Input
                    value={item.title}
                    onChange={(e) => handleContentItemChange(index, 'title', e.target.value)}
                    placeholder="Tiêu đề phần nội dung"
                  />
                </Form.Item>

                <Form.Item label="Nội dung chi tiết">
                  <DynamicRichTextEditor
                    value={item.body}
                    onChange={(value) => handleContentItemChange(index, 'body', value)}
                    height={350}
                  />
                </Form.Item>
              </div>
            ))}

            <Button type="dashed" onClick={handleAddContentItem} block size="large">
              + Thêm phần nội dung mới
            </Button>
          </div>
        </Form.Item>

        {/* Trạng thái xuất bản */}
        <Form.Item label="Xuất bản ngay" name="isPublished" valuePropName="checked" initialValue={false}>
          <Switch />
        </Form.Item>

        {/* Nút submit */}
        <Form.Item className="mb-0">
          <Button
            type="primary"
            htmlType="submit"
            loading={isPending}
            block
            size="large"
            className="bg-gray-800 hover:bg-gray-900"
          >
            {isPending ? 'Đang tạo...' : 'Tạo bài viết mới'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}