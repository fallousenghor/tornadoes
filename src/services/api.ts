// Configuration API avec Axios - Tornadoes Job

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Helper to safely get token from localStorage (supports both keys)
const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken') || localStorage.getItem('access_token');
};

const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken') || localStorage.getItem('refresh_token');
};

const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs 401 (token expiré)
api.interceptors.response.use(
  (response) => {
    // Unwrap ApiResponse if present - the backend wraps all responses
    // But only if it looks like an ApiResponse wrapper (has success and data fields)
    if (response.data && 
        typeof response.data === 'object' && 
        'success' in response.data && 
        'data' in response.data) {
      // Return the unwrapped data so callers get direct access
      return {
        ...response,
        data: response.data.data
      };
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          // Response might be wrapped in ApiResponse, need to extract data
          let tokens = response.data;
          if (tokens && typeof tokens === 'object' && 'data' in tokens) {
            tokens = tokens.data;
          }
          
          const { accessToken, refreshToken: newRefreshToken } = tokens;
          
          setTokens(accessToken, newRefreshToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          return api(originalRequest);
        } catch (refreshError) {
          // Refresh token expiré, déconnexion
          clearTokens();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    // For other errors (like 403), still try to extract error message from ApiResponse wrapper
    if (error.response?.data && 
        typeof error.response.data === 'object' && 
        'message' in error.response.data) {
      // Create a custom error with the backend message
      const backendMessage = (error.response.data as any).message;
      error.message = backendMessage || error.message;
    }

    return Promise.reject(error);
  }
);

export default api;


