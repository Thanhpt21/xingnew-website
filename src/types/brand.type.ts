  export interface Brand {
    id: number
    name: string
    slug: string
    description?: string | null
    thumb?: string | null
    status: 'ACTIVE' | 'INACTIVE' | 'DELETED'
    createdAt: string
    updatedAt: string
  }