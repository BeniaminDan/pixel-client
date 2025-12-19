/**
 * @fileoverview Barrel file for utilities and services.
 *
 * This file serves as a single export point for general-purpose utility functions
 * and configured services.
 *
 * @usage
 * // Import utilities using path alias:
 * import { formatDate } from '@/lib';
 */

// Legacy files removed - use @/lib/api and @/services instead
// export * from './apiClient' // DEPRECATED: Use @/lib/api/factory
// export * from './http' // DEPRECATED: Use @/services

export * from './color-utils'

// Auth exports moved to @/features/auth/lib/
// import from '@/features/auth/lib/auth' or '@/features/auth/lib/auth-popup'

