'use client'

import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { login, LoginBody } from '@/lib/auth/login'
import { LoginResponse } from '@/types/user.type'
import { useRouter } from 'next/navigation'
import { message } from 'antd'

export const useLogin = (): UseMutationResult<LoginResponse, Error, LoginBody> => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation<LoginResponse, Error, LoginBody>({
    mutationFn: login,
    onSuccess: (data) => {
      // ✅ Chỉ lưu access_token vào cookie
      const accessToken = data.data?.access_token
      
      if (accessToken) {
        document.cookie = `access_token=${accessToken}; path=/; max-age=604800; SameSite=Strict`
      }

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['current-user'] })
      
      // Show success message
      message.success(data.message || 'Đăng nhập thành công!')
      
      // Note: Không redirect ở đây nữa, để LoginPage.tsx xử lý redirect
    },
    onError: (error: any) => {
      const apiMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Đăng nhập thất bại, vui lòng thử lại.'
      console.error('❌ Login failed:', apiMessage)
      message.error(apiMessage)
    },
  })
}