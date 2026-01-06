// hooks/auth/useUserProfile.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { ProfileResponse } from '@/types/user.type'

export const useUserProfile = () => {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: async (): Promise<ProfileResponse['data']> => {
      const res = await api.get<ProfileResponse>('/auth/profile')
      return res.data.data
    },
  })
}