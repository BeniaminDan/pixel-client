export interface ServiceResult<T = void> {
  success: boolean
  data?: T
  error?: string
  errors?: Record<string, string[]>
}