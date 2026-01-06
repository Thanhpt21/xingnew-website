import axios from 'axios'

export interface RegisterBody {
  name: string
  email: string
  password: string
}

export const register = async (body: RegisterBody) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      body,
      {
        withCredentials: true, 
      }
    )
    return res.data
  } catch (error: any) {
    if (error.response) {
      throw error // ✅ giữ nguyên thông tin lỗi backend
    }
    throw new Error('Không thể kết nối đến máy chủ')
  }
}