/**
 * @fileoverview Barrel file for utilities and services.
 *
 * This file serves as a single export point for general-purpose utility functions
 * (like date formatting, math helpers) and configured services (like the API client).
 *
 * @usage
 * // Import multiple utilities/services using one clean path alias:
 * import { apiClient, formatDate } from '@/lib';
 */

export * from './apiClient'
export * from './http'
export * from './fluid-shaders'
export * from './fluid-webgl'
// export * from './dateUtils'; // Uncomment/add when created