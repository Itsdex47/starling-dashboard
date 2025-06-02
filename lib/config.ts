/**
 * Configuration for Starling Dashboard API Integration
 */

export const API_CONFIG = {
  // Base API URL - defaults to localhost:3001 for development
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  
  // API Endpoints
  ENDPOINTS: {
    PAYMENTS: '/payments',
    SEND_PAYMENT: '/payments/send',
    RECEIVE_PAYMENT: '/payments/receive',
    PAYMENT_STATUS: '/payments/status',
    EXCHANGE_RATES: '/exchange-rates',
    USER_PROFILE: '/user/profile',
    TRANSACTION_HISTORY: '/transactions',
    ANALYTICS: '/analytics',
  },
  
  // Request timeouts
  TIMEOUT: 10000, // 10 seconds
  
  // Retry configuration
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
}

export const AUTH_CONFIG = {
  // Authentication endpoints
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  REGISTER: '/auth/register',
  
  // Token storage keys
  ACCESS_TOKEN_KEY: 'starling_access_token',
  REFRESH_TOKEN_KEY: 'starling_refresh_token',
}

export const ENVIRONMENT = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
}

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = API_CONFIG.BASE_URL.replace(/\/$/, '') // Remove trailing slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${baseUrl}${cleanEndpoint}`
}

// Common headers for API requests
export const getCommonHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }

  // Add auth token if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(AUTH_CONFIG.ACCESS_TOKEN_KEY)
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  return headers
} 