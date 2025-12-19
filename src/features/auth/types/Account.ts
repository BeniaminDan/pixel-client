/**
 * Re-export account-related types from services to maintain single source of truth
 */
export type {
  UpdateProfileData,
  ChangePasswordData,
} from '@/services/account.service'

export type {
  ResetPasswordData,
} from '@/services/account-setup.service'

/**
 * ServiceResult type used for server action return values
 */
export interface ServiceResult<T = void> {
  success: boolean
  data?: T
  error?: string
  errors?: Record<string, string[]>
}