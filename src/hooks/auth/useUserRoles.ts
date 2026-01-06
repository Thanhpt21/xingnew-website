// hooks/auth/useUserRoles.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

interface Role {
  id: number
  name: string
  description?: string
  permissions: string[]
}

export const useUserRoles = () => {
  return useQuery({
    queryKey: ['user-roles'],
    queryFn: async (): Promise<Role[]> => {
      const res = await api.get('/auth/roles')
      return res.data.data
    },
  })
}