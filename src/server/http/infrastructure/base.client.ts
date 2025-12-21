/**
 * @fileoverview Factory for creating specialized Axios clients
 */

import axios, {type AxiosInstance} from 'axios'
import { ApiConfig, DEFAULT_API_CONFIG } from "@/server/http/contracts";
import attachInterceptors from "@/server/http/utils/interceptor.util";

/**
 * Create a base Axios instance with common configuration
 */
export default function createBaseClient(config: Partial<ApiConfig> = {}): AxiosInstance {
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

  attachInterceptors(instance, finalConfig)

  return instance
}

// export function createPublicClient
// export function createAuthenticatedClient