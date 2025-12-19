/**
 * @fileoverview Factory for creating specialized Axios clients
 */

import axios, { type AxiosInstance } from 'axios'
import type { ApiConfig } from '../config'
import {
  DEFAULT_API_CONFIG,
  PUBLIC_API_CONFIG,
  AUTHENTICATED_API_CONFIG,
  ADMIN_API_CONFIG,
} from '../config'
import { attachRetryInterceptor } from '../retry'
import { attachLoggingInterceptor } from '../logging'
import { consoleLogger, sentryLogger } from '../logging'

/**
 * Client type for factory
 */
export enum ClientType {
  PUBLIC = 'public',
  AUTHENTICATED = 'authenticated',
  ADMIN = 'admin',
  PROXY = 'proxy',
}

/**
 * Create a base Axios instance with common configuration
 */
function createBaseClient(config: Partial<ApiConfig> = {}): AxiosInstance {
  const finalConfig = {
    ...DEFAULT_API_CONFIG,
    ...config,
  }

  const instance = axios.create({
    baseURL: finalConfig.baseURL,
    timeout: finalConfig.timeout,
    withCredentials: finalConfig.withCredentials,
    headers: finalConfig.defaultHeaders,
  })

  return instance
}

/**
 * Attach interceptors to an Axios instance based on configuration
 */
function attachInterceptors(instance: AxiosInstance, config: Partial<ApiConfig>): void {
  const finalConfig = {
    ...DEFAULT_API_CONFIG,
    ...config,
  }

  // Attach logging interceptors
  if (finalConfig.logging.enabled) {
    const loggers = []
    if (finalConfig.logging.console) {
      loggers.push(consoleLogger)
    }
    if (finalConfig.logging.sentry) {
      loggers.push(sentryLogger)
    }
    attachLoggingInterceptor(instance, loggers)
  }

  // Attach retry interceptor
  if (finalConfig.retry.maxAttempts > 0) {
    attachRetryInterceptor(instance, finalConfig.retry)
  }
}

/**
 * Create a public API client (no authentication)
 */
export function createPublicClient(config: Partial<ApiConfig> = {}): AxiosInstance {
  const clientConfig = {
    ...PUBLIC_API_CONFIG,
    ...config,
  }

  const instance = createBaseClient(clientConfig)
  attachInterceptors(instance, clientConfig)

  return instance
}

/**
 * Create an authenticated API client
 * Note: Auth interceptor is attached separately via attachAuthInterceptor
 */
export function createAuthenticatedClient(config: Partial<ApiConfig> = {}): AxiosInstance {
  const clientConfig = {
    ...AUTHENTICATED_API_CONFIG,
    ...config,
  }

  const instance = createBaseClient(clientConfig)
  attachInterceptors(instance, clientConfig)

  return instance
}

/**
 * Create an admin API client (requires admin role)
 * Note: Permission interceptor is attached separately via attachPermissionInterceptor
 */
export function createAdminClient(config: Partial<ApiConfig> = {}): AxiosInstance {
  const clientConfig = {
    ...ADMIN_API_CONFIG,
    ...config,
  }

  const instance = createBaseClient(clientConfig)
  attachInterceptors(instance, clientConfig)

  return instance
}

/**
 * Create a proxy client (routes through Next.js API proxy)
 */
export function createProxyClient(config: Partial<ApiConfig> = {}): AxiosInstance {
  const clientConfig = {
    ...AUTHENTICATED_API_CONFIG,
    baseURL: '/api/backend',
    ...config,
  }

  const instance = createBaseClient(clientConfig)
  attachInterceptors(instance, clientConfig)

  return instance
}

/**
 * Create a custom client with specific configuration
 */
export function createCustomClient(config: Partial<ApiConfig>): AxiosInstance {
  const instance = createBaseClient(config)
  attachInterceptors(instance, config)
  return instance
}

/**
 * Singleton instances for common clients
 */
let publicClientInstance: AxiosInstance | null = null
let authenticatedClientInstance: AxiosInstance | null = null
let adminClientInstance: AxiosInstance | null = null
let proxyClientInstance: AxiosInstance | null = null

/**
 * Get or create singleton public client
 */
export function getPublicClient(): AxiosInstance {
  if (!publicClientInstance) {
    publicClientInstance = createPublicClient()
  }
  return publicClientInstance
}

/**
 * Get or create singleton authenticated client
 */
export function getAuthenticatedClient(): AxiosInstance {
  if (!authenticatedClientInstance) {
    authenticatedClientInstance = createAuthenticatedClient()
  }
  return authenticatedClientInstance
}

/**
 * Get or create singleton admin client
 */
export function getAdminClient(): AxiosInstance {
  if (!adminClientInstance) {
    adminClientInstance = createAdminClient()
  }
  return adminClientInstance
}

/**
 * Get or create singleton proxy client
 */
export function getProxyClient(): AxiosInstance {
  if (!proxyClientInstance) {
    proxyClientInstance = createProxyClient()
  }
  return proxyClientInstance
}

/**
 * Reset all singleton instances (useful for testing)
 */
export function resetClientInstances(): void {
  publicClientInstance = null
  authenticatedClientInstance = null
  adminClientInstance = null
  proxyClientInstance = null
}
