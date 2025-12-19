/**
 * @fileoverview Specialized Axios client for OpenIddict OAuth2/OIDC authentication
 * 
 * This client is designed specifically for interacting with OpenIddict token endpoints
 * and follows OAuth2 best practices:
 * - Uses application/x-www-form-urlencoded for token requests (OAuth2 spec requirement)
 * - Separate instance for application/json requests (userinfo endpoint)
 * - No retry logic (auth requests should fail fast)
 * - Dedicated error handling for OAuth2 error responses
 */

import axios, { type AxiosInstance, type AxiosError } from 'axios'

const OPENIDDICT_ISSUER = process.env.OPENIDDICT_ISSUER
const OPENIDDICT_CLIENT_ID = process.env.OPENIDDICT_CLIENT_ID
const OPENIDDICT_CLIENT_SECRET = process.env.OPENIDDICT_CLIENT_SECRET

/**
 * OAuth2 error response structure
 */
export interface OAuth2ErrorResponse {
    error: string
    error_description?: string
    error_uri?: string
}

/**
 * OAuth2 token response structure
 */
export interface OAuth2TokenResponse {
    access_token: string
    refresh_token: string
    expires_in: number
    token_type: string
    scope?: string
}

/**
 * Axios instance for OAuth2 token endpoint requests
 * Uses application/x-www-form-urlencoded content type as required by OAuth2 spec
 */
export const authTokenClient: AxiosInstance = axios.create({
    baseURL: `${OPENIDDICT_ISSUER}api/auth/connect`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
})

/**
 * Axios instance for OAuth2 userinfo endpoint and other JSON requests
 * Uses application/json content type
 */
export const authJsonClient: AxiosInstance = axios.create({
    baseURL: `${OPENIDDICT_ISSUER}api/auth/connect`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

/**
 * Helper function to create token request parameters
 * Returns URLSearchParams as required for application/x-www-form-urlencoded
 */
export function createTokenParams(params: Record<string, string>): URLSearchParams {
    return new URLSearchParams({
        client_id: OPENIDDICT_CLIENT_ID!,
        client_secret: OPENIDDICT_CLIENT_SECRET!,
        ...params,
    })
}

/**
 * Helper function to extract OAuth2 error information from axios error
 */
export function extractOAuth2Error(error: unknown): {
    error: string
    errorDescription?: string
    errorUri?: string
    status?: number
} {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<OAuth2ErrorResponse>
        const errorData = axiosError.response?.data

        return {
            error: errorData?.error || error.message || 'unknown_error',
            errorDescription: errorData?.error_description,
            errorUri: errorData?.error_uri,
            status: axiosError.response?.status,
        }
    }

    return {
        error: error instanceof Error ? error.message : 'unknown_error',
    }
}

// Add response interceptor for better error logging
authTokenClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError<OAuth2ErrorResponse>) => {
        if (error.response) {
            const { error: errorCode, error_description, error_uri } = error.response.data || {}
            console.error('OAuth2 token request failed:', {
                status: error.response.status,
                statusText: error.response.statusText,
                error: errorCode,
                errorDescription: error_description,
                errorUri: error_uri,
                url: error.config?.url,
            })
        } else if (error.request) {
            console.error('OAuth2 token request failed: No response received', {
                url: error.config?.url,
                message: error.message,
            })
        } else {
            console.error('OAuth2 token request failed:', error.message)
        }
        return Promise.reject(error)
    }
)

// Add response interceptor for JSON client
authJsonClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response) {
            console.error('Auth API request failed:', {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data,
                url: error.config?.url,
            })
        } else if (error.request) {
            console.error('Auth API request failed: No response received', {
                url: error.config?.url,
                message: error.message,
            })
        } else {
            console.error('Auth API request failed:', error.message)
        }
        return Promise.reject(error)
    }
)
