/**
 * @fileoverview Helper utilities built on top of the shared Axios client.
 */

import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { apiClient } from './apiClient';
import type { ApiError, ApiErrorPayload, ApiResponse, ApiResult, QueryParams } from '@/types';

const unwrapResponse = <T,>(response: AxiosResponse<ApiResponse<T> | T>): T => {
    const body = response.data as ApiResponse<T> | T;

    if (body && typeof body === 'object' && 'data' in (body as ApiResponse<T>)) {
        return (body as ApiResponse<T>).data as T;
    }

    return body as T;
};

export const buildQueryString = (params: QueryParams = {}) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        searchParams.append(key, String(value));
    });

    const query = searchParams.toString();
    return query ? `?${query}` : '';
};

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

export const httpRequest = async <T,>(config: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.request<ApiResponse<T> | T>(config);
    return unwrapResponse<T>(response);
};

export const safeHttpRequest = async <T,>(config: AxiosRequestConfig): Promise<ApiResult<T>> => {
    try {
        const data = await httpRequest<T>(config);
        return { data, error: null };
    } catch (error) {
        return { data: null, error: extractApiError(error) };
    }
};

export const httpGet = async <T,>(url: string, config?: AxiosRequestConfig) =>
    httpRequest<T>({ ...config, method: 'GET', url });

export const httpPost = async <T,>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    httpRequest<T>({ ...config, method: 'POST', url, data });

export const httpPut = async <T,>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    httpRequest<T>({ ...config, method: 'PUT', url, data });

export const httpPatch = async <T,>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    httpRequest<T>({ ...config, method: 'PATCH', url, data });

export const httpDelete = async <T,>(url: string, config?: AxiosRequestConfig) =>
    httpRequest<T>({ ...config, method: 'DELETE', url });
