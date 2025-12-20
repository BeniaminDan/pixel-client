export interface UserProfile {
  id: string
  email: string
  name?: string
  avatar?: string
  role: string
  permissions?: string[]
  emailConfirmed: boolean
  createdAt: string
  updatedAt: string
}

export interface UpdateProfileData {
  name?: string
  avatar?: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export interface UpdateEmailData {
  newEmail: string
}


export interface RegisterData {
  email: string
  password: string
  confirmPassword: string
  name?: string
}

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  email: string
  token: string
  newPassword: string
  confirmNewPassword: string
}

export interface EmailConfirmationData {
  userId: string
  token: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  user: {
    id: string
    email: string
    name?: string
  }
}


export interface AdminUser {
  id: string
  email: string
  name?: string
  role: string
  permissions: string[]
  emailConfirmed: boolean
  banned: boolean
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
  stats: {
    totalPixels: number
    totalBids: number
    totalSpent: number
  }
}

export interface UserListQuery {
  page?: number
  pageSize?: number
  search?: string
  role?: string
  banned?: boolean
  sortBy?: 'createdAt' | 'lastLoginAt' | 'email' | 'name'
  sortOrder?: 'asc' | 'desc'
}

export interface UserListResponse {
  users: AdminUser[]
  total: number
  page: number
  pageSize: number
  pageCount: number
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  role?: string
  permissions?: string[]
  emailConfirmed?: boolean
}

export interface BanUserRequest {
  reason: string
  duration?: number // Duration in days, undefined for permanent
  notifyUser?: boolean
}

export interface ModerationAction {
  id: string
  type: 'ban' | 'unban' | 'warn' | 'delete_content' | 'restore_content'
  targetUserId: string
  moderatorId: string
  reason: string
  createdAt: string
  expiresAt?: string
}

export interface SystemStats {
  totalUsers: number
  activeUsers: number
  bannedUsers: number
  totalPixels: number
  totalBids: number
  totalRevenue: number
  activeSessions: number
  serverHealth: {
    status: 'healthy' | 'degraded' | 'down'
    uptime: number
    memory: {
      used: number
      total: number
      percentage: number
    }
    cpu: {
      usage: number
    }
  }
}

export interface ContentReport {
  id: string
  type: 'pixel' | 'user' | 'other'
  targetId: string
  reporterId: string
  reason: string
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  createdAt: string
  resolvedAt?: string
  resolvedBy?: string
  resolution?: string
}
