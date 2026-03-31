import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getToken, removeToken } from './auth';
import toast from 'react-hot-toast';

// Generate unique error ID for logging
function generateErrorId(): string {
  return `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Log error with unique ID
function logError(errorId: string, error: any, context: string): void {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.error(`[${errorId}] ${context}:`, error);
  }
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add authentication token
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Validate HTTPS in production
    if (process.env.NODE_ENV === 'production' && config.baseURL && !config.baseURL.startsWith('https://')) {
      console.warn('⚠️ API calls should use HTTPS in production');
    }

    return config;
  },
  (error) => {
    const errorId = generateErrorId();
    logError(errorId, error, 'Request interceptor error');
    return Promise.reject(error);
  }
);

// Response interceptor with enhanced error handling
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const errorId = generateErrorId();
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const errorData = error.response.data as any;

      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          logError(errorId, error, '401 Unauthorized');
          
          // Don't redirect if this is an auth or payment endpoint
          const requestUrl = originalRequest.url || '';
          const isAuthEndpoint = requestUrl.includes('/auth/login') || 
                                 requestUrl.includes('/auth/register');
          const isPaymentEndpoint = requestUrl.includes('/payments/') || 
                                    requestUrl.includes('/payment/');
          
          if (isAuthEndpoint || isPaymentEndpoint) {
            // Let the calling page handle the error
            if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
              console.log('[Auth] Skipping auto-logout for:', requestUrl);
            }
            break;
          }
          
          // Log which endpoint triggered the logout
          if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
            console.log('[Auth] Auto-logout triggered by:', requestUrl);
          }
          
          // Attempt token refresh if not already retried
          if (!originalRequest._retry) {
            originalRequest._retry = true;
            
            // TODO: Implement token refresh logic here
            // For now, just clear token and redirect
            removeToken();
            
            if (typeof window !== 'undefined') {
              // Preserve return URL
              const returnUrl = window.location.pathname + window.location.search;
              sessionStorage.setItem('returnUrl', returnUrl);
              
              toast.error('Session expired. Please login again.');
              window.location.href = '/login';
            }
          }
          break;

        case 403:
          // Forbidden - insufficient permissions
          logError(errorId, error, '403 Forbidden');
          if (typeof window !== 'undefined') {
            toast.error("You don't have permission to perform this action");
          }
          break;

        case 404:
          // Not found
          logError(errorId, error, '404 Not Found');
          const resource = errorData?.message || 'Resource not found';
          
          // Don't show toast for financial identity 404 (expected when no trades yet)
          const isFinancialIdentity = originalRequest.url?.includes('/financial-identity');
          
          if (typeof window !== 'undefined' && !isFinancialIdentity) {
            toast.error(resource);
          }
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors
          logError(errorId, error, `${status} Server Error`);
          if (typeof window !== 'undefined') {
            toast.error(`Something went wrong. Please try again. (Error ID: ${errorId})`);
          }
          break;

        default:
          // Other errors
          logError(errorId, error, `${status} Error`);
          if (typeof window !== 'undefined' && errorData?.message) {
            toast.error(errorData.message);
          }
      }
    } else if (error.request) {
      // Request made but no response received (network error)
      logError(errorId, error, 'Network error - no response');
      
      if (typeof window !== 'undefined') {
        toast.error('Network error. Please check your connection.');
      }
    } else {
      // Error setting up request
      logError(errorId, error, 'Request setup error');
      
      if (typeof window !== 'undefined') {
        toast.error('An unexpected error occurred.');
      }
    }

    // Attach error ID to error object for reference
    (error as any).errorId = errorId;

    return Promise.reject(error);
  }
);

export default api;
