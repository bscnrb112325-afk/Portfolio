// Centralized API utility for connecting Frontend to Backend
const API_BASE = import.meta.env.VITE_API_URL || '';

export const getApiUrl = (endpoint) => {
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
        return endpoint;
    }
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${API_BASE}${cleanEndpoint}`;
};

export const apiFetch = (endpoint, options = {}) => {
    return fetch(getApiUrl(endpoint), options);
};

export default apiFetch;
