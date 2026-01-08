'use client';

import { useCurrent } from '@/hooks/auth/useCurrent';
import { useUpdateUser } from '@/hooks/user/useUpdateUser';
import { Form, Input, Button, message, Upload, Radio, UploadFile } from 'antd';
import { UploadOutlined, UserOutlined, MailOutlined, PhoneOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { createImageUploadValidator, ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE_MB } from '@/utils/upload.utils';
import { getImageUrl } from '@/utils/getImageUrl';
import { RcFile } from 'antd/es/upload';

interface PersonalInfoProps {}

const PersonalInfo = ({}: PersonalInfoProps) => {
  const { data: currentUser, isLoading, isError, refetch: refetchCurrentUser } = useCurrent();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      form.setFieldsValue({
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone || '',
        gender: currentUser.gender || null,
      });
      if (currentUser.avatar) {
        const imageUrl = getImageUrl(currentUser.avatar);
        if (imageUrl) {
          setFileList([
            {
              uid: '-1',
              name: 'current-avatar',
              status: 'done',
              url: imageUrl,
            },
          ]);
          setPreviewImage(imageUrl);
        }
      }
    }
  }, [currentUser, form]);

  const handleImageChange = ({ fileList: newFileList, file }: any) => {
    // Cập nhật fileList
    setFileList(newFileList);
    
    // Nếu có file mới upload, hiển thị preview
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const file = newFileList[0].originFileObj;
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      
      // Hiển thị thông báo upload thành công
      if (file.status === 'done') {
        message.success('Tải ảnh lên thành công!');
        setIsUploading(false);
      } else if (file.status === 'uploading') {
        setIsUploading(true);
      } else if (file.status === 'error') {
        message.error('Tải ảnh lên thất bại!');
        setIsUploading(false);
      }
    } else if (newFileList.length === 0) {
      // Nếu xóa ảnh, hiển thị lại ảnh cũ hoặc avatar mặc định
      if (currentUser?.avatar) {
        setPreviewImage(getImageUrl(currentUser.avatar));
      } else {
        setPreviewImage('');
      }
    }
  };

  // Custom upload function để xử lý preview
  const customRequest = ({ file, onSuccess }: any) => {
    // Simulate upload delay
    setTimeout(() => {
      onSuccess("ok");
    }, 1000);
  };

  // Xóa ảnh
  const handleRemove = () => {
    setPreviewImage('');
    if (currentUser?.avatar) {
      setPreviewImage(getImageUrl(currentUser.avatar));
    }
    message.info('Đã xóa ảnh tải lên');
    return true; // Trả về true để xóa khỏi fileList
  };

  const onFinish = async (values: any) => {
    if (!currentUser?.id) {
      message.error('Không tìm thấy ID người dùng.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('phone', values.phone || '');
      formData.append('gender', values.gender || '');

      const file = fileList?.[0]?.originFileObj;
      if (file) formData.append('avatar', file);

      await updateUser({ id: currentUser.id, data: formData });
      message.success('Cập nhật thông tin thành công!');
      refetchCurrentUser();
    } catch (err: any) {
      message.error('Cập nhật thất bại!');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (isError || !currentUser) {
    return (
      <div className="py-12">
        <div className="text-center bg-gray-50 p-6 max-w-md mx-auto border border-gray-200 rounded-lg">
          <div className="text-gray-800 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-gray-900 font-medium">Lỗi khi tải thông tin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Thông tin cá nhân</h2>
        <p className="text-gray-600">Cập nhật thông tin cá nhân của bạn</p>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish} className="space-y-6">
        {/* Avatar Upload Section */}
        <div className="bg-gray-50 p-6 border border-gray-200 rounded-lg">
          <div className="flex flex-col items-center space-y-6">

            {/* Upload Section */}
            <div className="flex flex-col items-center gap-4 w-full">
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleImageChange}
                beforeUpload={createImageUploadValidator(MAX_IMAGE_SIZE_MB)}
                maxCount={1}
                accept={ACCEPTED_IMAGE_TYPES}
                customRequest={customRequest}
                onRemove={handleRemove}
                showUploadList={{
                  showPreviewIcon: false,
                  showRemoveIcon: true,
                  showDownloadIcon: false,
                }}
                className="avatar-upload"
              >
                {fileList.length === 0 && (
                  <div className="flex flex-col items-center gap-3">
                    <UploadOutlined className="text-xl" />
                    <span className="text-sm">Tải ảnh lên</span>
                    <div className="text-center text-xs">

                      <p className="text-gray-400 mt-1">
                        JPG, PNG, GIF (tối đa {MAX_IMAGE_SIZE_MB}MB)
                      </p>
                    </div>
                  </div>
                )}
              </Upload>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name Field */}
          <Form.Item
            label="Họ và tên"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Nhập họ và tên"
              className="border-gray-300"
            />
          </Form.Item>

          {/* Email Field */}
          <Form.Item
            label="Email"
            name="email"
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              disabled
              className="border-gray-300"
            />
          </Form.Item>

          {/* Phone Field */}
          <Form.Item
            label="Số điện thoại"
            name="phone"
          >
            <Input
              prefix={<PhoneOutlined className="text-gray-400" />}
              placeholder="Nhập số điện thoại"
              className="border-gray-300"
            />
          </Form.Item>

          {/* Gender Field */}
          <Form.Item
            label="Giới tính"
            name="gender"
          >
            <Radio.Group className="w-full">
              <div className="grid grid-cols-2 gap-2">
                <Radio.Button value="male" className="w-full text-center border-gray-300 hover:border-gray-400">
                  Nam
                </Radio.Button>
                <Radio.Button value="female" className="w-full text-center border-gray-300 hover:border-gray-400">
                  Nữ
                </Radio.Button>
                <Radio.Button value="other" className="w-full text-center border-gray-300 hover:border-gray-400">
                  Khác
                </Radio.Button>
                <Radio.Button value="" className="w-full text-center border-gray-300 hover:border-gray-400">
                  Không xác định
                </Radio.Button>
              </div>
            </Radio.Group>
          </Form.Item>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-gray-200">
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isUpdating}
              className="h-10 px-8 bg-gray-800 hover:bg-gray-900 border-none"
            >
              {isUpdating ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default PersonalInfo;