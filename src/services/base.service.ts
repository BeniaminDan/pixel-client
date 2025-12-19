/**
 * @fileoverview Base service class for all API services
 */

import type { AxiosInstance } from 'axios'
import { createAuthenticatedClient } from '@/lib/api/factory'

/**
 * Base service class with common functionality
 */
export abstract class BaseService {
  protected client: AxiosInstance

  constructor(client?: AxiosInstance) {
    this.client = client || createAuthenticatedClient()
  }

  /**
   * Get the axios client instance
   */
  getClient(): AxiosInstance {
    return this.client
  }

  /**
   * Set a custom axios client
   */
  setClient(client: AxiosInstance): void {
    this.client = client
  }
}
