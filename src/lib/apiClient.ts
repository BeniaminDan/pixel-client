/**
 * @fileoverview DEPRECATED - Use @/lib/api/factory instead
 * 
 * This file contains legacy axios client configuration.
 * New code should use the services from @/lib/api/factory and @/services
 * 
 * @deprecated Use @/lib/api/factory (createPublicClient, createAuthenticatedClient)
 * @see @/lib/api/factory
 * @see @/services
 * 
 * This file is kept for reference only and should not be used in new code.
 */

import axios from 'axios'

/**
 * @deprecated Use createPublicClient() from @/lib/api/factory instead
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * @deprecated Use services from @/services which handle authentication automatically
 * or use createAuthenticatedClient() from @/lib/api/factory for server-side
 */
export const authenticatedClient = axios.create({
  baseURL: '/api/backend',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor removed - use error interceptors from @/lib/api/interceptors
