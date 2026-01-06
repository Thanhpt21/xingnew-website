import axios from 'axios'
import { LoginResponse } from '@/types/user.type'

export interface LoginBody {
  email: string
  password: string
}

export const login = async (body: LoginBody): Promise<LoginResponse> => {
  try {
    const res = await axios.post<LoginResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      body,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    const data = res.data

    if (typeof window !== 'undefined') {
      // ✅ Chỉ lưu access_token
      if (data.data?.access_token) {
        localStorage.setItem('access_token', data.data.access_token)
      }
    }

    return data
  } catch (error: any) {
    if (error.response) {
      // Pass through the API error response
      throw error.response.data || error.response
    }
    throw new Error('Không thể kết nối đến máy chủ')
  }
}