/**
 * @fileoverview Utility for creating and configuring an API client (e.g., using Axios or Fetch).
 *
 * This file is where you configure base URLs, set up interceptors for handling
 * authentication tokens, error handling (e.g., refreshing tokens), and request logging.
 * It ensures all API calls across the application share the same configuration.
 *
 * @usage
 * // In a component or service file:
 * import { apiClient } from '@/lib/apiClient';
 *
 * async function fetchPosts() {
 * const response = await apiClient.get('/posts');
 * return response.data;
 * }
 */

import axios from 'axios';

// Create a custom instance of Axios
export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Example: Add a request interceptor to attach an auth token
apiClient.interceptors.request.use(
    (config) => {
        // const token = localStorage.getItem('authToken');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);