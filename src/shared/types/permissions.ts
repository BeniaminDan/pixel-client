/**
 * @fileoverview Permission types and enums
 */

/**
 * User roles in the application
 */
export enum Role {
  GUEST = 'guest',
  USER = 'user',
  PREMIUM = 'premium',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
}

/**
 * Granular permissions in the application
 */
export enum Permission {
  // Canvas permissions
  PIXEL_VIEW = 'pixel:view',
  PIXEL_PLACE = 'pixel:place',
  PIXEL_BULK_PLACE = 'pixel:bulk_place',
  CANVAS_ADMIN = 'canvas:admin',
  CANVAS_EXPORT = 'canvas:export',

  // Throne permissions
  THRONE_VIEW = 'throne:view',
  THRONE_BID = 'throne:bid',
  THRONE_MANAGE = 'throne:manage',

  // User permissions
  PROFILE_VIEW = 'profile:view',
  PROFILE_EDIT = 'profile:edit',
  PROFILE_DELETE = 'profile:delete',

  // Admin permissions
  USER_MANAGE = 'user:manage',
  USER_BAN = 'user:ban',
  CONTENT_MODERATE = 'content:moderate',
  ANALYTICS_VIEW = 'analytics:view',
  SETTINGS_MANAGE = 'settings:manage',

  // Payment permissions
  PAYMENT_MAKE = 'payment:make',
  PAYMENT_REFUND = 'payment:refund',
  PAYMENT_VIEW_HISTORY = 'payment:view_history',
}

/**
 * Role to permissions mapping
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.GUEST]: [
    Permission.PIXEL_VIEW,
    Permission.THRONE_VIEW,
  ],
  [Role.USER]: [
    Permission.PIXEL_VIEW,
    Permission.PIXEL_PLACE,
    Permission.THRONE_VIEW,
    Permission.THRONE_BID,
    Permission.PROFILE_VIEW,
    Permission.PROFILE_EDIT,
    Permission.PROFILE_DELETE,
    Permission.PAYMENT_MAKE,
    Permission.PAYMENT_VIEW_HISTORY,
  ],
  [Role.PREMIUM]: [
    Permission.PIXEL_VIEW,
    Permission.PIXEL_PLACE,
    Permission.PIXEL_BULK_PLACE,
    Permission.THRONE_VIEW,
    Permission.THRONE_BID,
    Permission.PROFILE_VIEW,
    Permission.PROFILE_EDIT,
    Permission.PROFILE_DELETE,
    Permission.CANVAS_EXPORT,
    Permission.PAYMENT_MAKE,
    Permission.PAYMENT_VIEW_HISTORY,
  ],
  [Role.MODERATOR]: [
    Permission.PIXEL_VIEW,
    Permission.PIXEL_PLACE,
    Permission.PIXEL_BULK_PLACE,
    Permission.THRONE_VIEW,
    Permission.THRONE_BID,
    Permission.PROFILE_VIEW,
    Permission.PROFILE_EDIT,
    Permission.PROFILE_DELETE,
    Permission.CANVAS_EXPORT,
    Permission.CONTENT_MODERATE,
    Permission.USER_BAN,
    Permission.PAYMENT_MAKE,
    Permission.PAYMENT_VIEW_HISTORY,
  ],
  [Role.ADMIN]: [
    // Admins have all permissions
    ...Object.values(Permission),
  ],
}

/**
 * Permission check result
 */
export interface PermissionCheckResult {
  allowed: boolean
  reason?: string
}

/**
 * User with role and permissions
 */
export interface PermissionUser {
  id: string
  role: Role
  permissions?: Permission[]
}

/**
 * Permission context for checking
 */
export interface PermissionContext {
  user?: PermissionUser
  resource?: string
  action?: string
}
