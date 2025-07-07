// types/models.d.ts
export interface Family {
  id: number
  name: string
  description: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

// types/pagination.d.ts
export interface PaginatedResults<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
  }
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
}
