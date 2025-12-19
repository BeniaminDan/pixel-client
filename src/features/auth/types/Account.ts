export interface UpdateProfileData {
  name?: string
  // Add other updatable fields as needed
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export interface ResetPasswordData {
  email: string
  token: string
  newPassword: string
  confirmNewPassword: string
}

export interface ServiceResult<T = void> {
  success: boolean
  data?: T
  error?: string
  errors?: Record<string, string[]>
}