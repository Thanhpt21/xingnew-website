'use client';

import { useCurrent } from '@/hooks/auth/useCurrent';
import { useUpdateUser } from '@/hooks/user/useUpdateUser';
import { Form, Input, Button, message, Upload, Radio } from 'antd';
import { UploadOutlined, UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { createImageUploadValidator, ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE_MB } from '@/utils/upload.utils';
import { getImageUrl } from '@/utils/getImageUrl';

interface PersonalInfoProps {}

const PersonalInfo = ({}: PersonalInfoProps) => {
  const { data: currentUser, isLoading, isError, refetch: refetchCurrentUser } = useCurrent();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    if (currentUser) {
      form.setFieldsValue({
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone || '',
        gender: currentUser.gender || null,
      });
      if (currentUser.avatar) {
        setFileList([
          {
            uid: '-1',
            name: currentUser.avatar.split('/').pop() || 'avatar.png',
            status: 'done',
            url: getImageUrl(currentUser.avatar),
          },
        ]);
      }
    }
  }, [currentUser, form]);

  const handleImageChange = ({ fileList }: any) => {
    setFileList(fileList);
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (isError || !currentUser) {
    return (
      <div className="py-12">
        <div className="text-center bg-red-50 p-6 max-w-md mx-auto">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-800 font-medium">Lỗi khi tải thông tin</p>
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
        <div className="bg-gray-50 p-6 border">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {fileList.length > 0 && fileList[0].url ? (
                <img
                  src={fileList[0].url}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-2 border-white"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white">
                  <UserOutlined className="text-gray-500 text-3xl" />
                </div>
              )}
            </div>

            <div className="flex justify-center w-full">
              <Upload
                listType="picture"
                fileList={fileList}
                onChange={handleImageChange}
                beforeUpload={createImageUploadValidator(MAX_IMAGE_SIZE_MB)}
                maxCount={1}
                accept={ACCEPTED_IMAGE_TYPES}
                showUploadList={false}
              >
                <Button
                  icon={<UploadOutlined />}
                  className="border"
                >
                  {fileList.length > 0 ? 'Thay đổi ảnh' : 'Tải lên ảnh'}
                </Button>
              </Upload>
            </div>

            <p className="text-sm text-gray-500 text-center">
              JPG, PNG hoặc GIF (tối đa {MAX_IMAGE_SIZE_MB}MB)
            </p>
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
            />
          </Form.Item>

          {/* Gender Field */}
          <Form.Item
            label="Giới tính"
            name="gender"
          >
            <Radio.Group className="w-full">
              <div className="grid grid-cols-2 gap-2">
                <Radio.Button value="male" className="w-full text-center">
                  Nam
                </Radio.Button>
                <Radio.Button value="female" className="w-full text-center">
                  Nữ
                </Radio.Button>
                <Radio.Button value="other" className="w-full text-center">
                  Khác
                </Radio.Button>
                <Radio.Button value={null} className="w-full text-center">
                  Không xác định
                </Radio.Button>
              </div>
            </Radio.Group>
          </Form.Item>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t">
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isUpdating}
              className="h-10 px-8"
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