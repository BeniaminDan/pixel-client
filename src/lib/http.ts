/**
 * @fileoverview DEPRECATED - Use @/services instead
 * 
 * This file contains legacy HTTP helper utilities.
 * New code should use the service classes from @/services
 * 
 * @deprecated Use service classes from @/services (AuthService, AccountService, etc.)
 * @see @/services
 * @see @/lib/api/errors for error handling
 * 
 * This file is kept for reference only and should not be used in new code.
 */

import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { apiClient } from './apiClient';
import type { ApiError, ApiErrorPayload, ApiResponse, ApiResult, QueryParams } from '@/types';

/**
 * @deprecated Use service methods which handle unwrapping automatically
 */
const unwrapResponse = <T,>(response: AxiosResponse<ApiResponse<T> | T>): T => {
    const body = response.data as ApiResponse<T> | T;

    if (body && typeof body === 'object' && 'data' in (body as ApiResponse<T>)) {
        return (body as ApiResponse<T>).data as T;
    }

    return body as T;
};

/**
 * @deprecated Build query strings in service methods or use URLSearchParams directly
 */
export const buildQueryString = (params: QueryParams = {}) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        searchParams.append(key, String(value));
    });

    const query = searchParams.toString();
    return query ? `?${query}` : '';
};

/**
 * @deprecated Use handleApiError from @/lib/api/errors instead
 */
export const extractApiError = (error: unknown): ApiError => {
    if ((error as AxiosError)?.isAxiosError || error instanceof Error) {
        const axiosError = error as AxiosError<ApiErrorPayload>;
        const payload = axiosError.response?.data;

        return {
            message: payload?.message || axiosError.message,
            status: payload?.status ?? axiosError.response?.status,
            code: payload?.code,
            details: payload?.errors,
        };
    }

    return { message: 'Unknown error occurred' };
};

/**
 * @deprecated Use service methods from @/services instead
 */
export const httpRequest = async <T,>(config: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.request<ApiResponse<T> | T>(config);
    return unwrapResponse<T>(response);
};

/**
 * @deprecated Use service methods with try/catch and handleApiError
 */
export const safeHttpRequest = async <T,>(config: AxiosRequestConfig): Promise<ApiResult<T>> => {
    try {
        const data = await httpRequest<T>(config);
        return { data, error: null };
    } catch (error) {
        return { data: null, error: extractApiError(error) };
    }
};

/**
 * @deprecated Use service.get() methods
 */
export const httpGet = async <T,>(url: string, config?: AxiosRequestConfig) =>
    httpRequest<T>({ ...config, method: 'GET', url });

/**
 * @deprecated Use service.post() methods
 */
export const httpPost = async <T,>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    httpRequest<T>({ ...config, method: 'POST', url, data });

/**
 * @deprecated Use service.put() methods
 */
export const httpPut = async <T,>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    httpRequest<T>({ ...config, method: 'PUT', url, data });

/**
 * @deprecated Use service.patch() methods
 */
export const httpPatch = async <T,>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    httpRequest<T>({ ...config, method: 'PATCH', url, data });

/**
 * @deprecated Use service.delete() methods
 */
export const httpDelete = async <T,>(url: string, config?: AxiosRequestConfig) =>
    httpRequest<T>({ ...config, method: 'DELETE', url });
