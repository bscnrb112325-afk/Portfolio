/**
 * api.js — Centralized Frontend ↔ Backend connector
 *
 * In development:  Vite proxy forwards /api/* → http://localhost:3000
 *                  so API_BASE = '' (empty) works perfectly.
 * In production:   VITE_API_URL should be your deployed backend URL,
 *                  e.g. https://your-backend.onrender.com
 */

const API_BASE = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/$/, '') // strip trailing slash
    : '';

/**
 * Build an absolute URL for an API endpoint.
 * @param {string} endpoint  e.g. '/api/profile'
 */
export const getApiUrl = (endpoint) => {
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
        return endpoint; // already absolute
    }
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${API_BASE}${cleanEndpoint}`;
};

/**
 * Wrapper around fetch() that:
 *  - Prepends the correct base URL
 *  - Sets JSON Content-Type by default when body is an object
 *  - Throws a descriptive error on non-OK responses
 */
export const apiFetch = async (endpoint, options = {}) => {
    const url = getApiUrl(endpoint);

    // Auto-set Content-Type for JSON bodies
    if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
        options.body = JSON.stringify(options.body);
        options.headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };
    }

    const response = await fetch(url, options);
    return response;
};

/**
 * Convenience helpers for common HTTP verbs
 */
export const apiGet = (endpoint) => apiFetch(endpoint);

export const apiPost = (endpoint, data) =>
    apiFetch(endpoint, { method: 'POST', body: data });

export const apiPut = (endpoint, data) =>
    apiFetch(endpoint, { method: 'PUT', body: data });

export const apiDelete = (endpoint) =>
    apiFetch(endpoint, { method: 'DELETE' });

export default apiFetch;
