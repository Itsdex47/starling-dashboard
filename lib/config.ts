/**
 * Configuration for Starling Dashboard API Integration
 * Updated to match actual API structure
 */

export const API_CONFIG = {
  // Base API URL - now points to root without /api suffix
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  
  // API Endpoints (these will have /api prefix added automatically)
  ENDPOINTS: {
    // Payment-related endpoints (will become /api/payments/*)
    PAYMENTS: '/api/payments',
    SEND_PAYMENT: '/api/payments/send',
    RECEIVE_PAYMENT: '/api/payments/receive',
    PAYMENT_STATUS: '/api/payments/status',
    PAYMENT_QUOTE: '/api/payments/quote',
    PAYMENT_PROCESS: '/api/payments/process',
    PAYMENT_DEMO: '/api/payments/demo',
    PAYMENT_HISTORY: '/api/payments/history',
    
    // Auth endpoints (will become /api/auth/*)
    AUTH_LOGIN: '/api/auth/login',
    AUTH_REGISTER: '/api/auth/register',
    AUTH_PROFILE: '/api/auth/profile',
    
    // Other API endpoints
    STATUS: '/api/status',
    CORRIDORS: '/api/corridors',
    EXCHANGE_RATES: '/api/exchange-rates',
    
    // Root-level endpoints (no /api prefix)
    HEALTH: '/health',
    DEBUG_ROUTES: '/debug/routes',
  },
  
  // Request timeouts
  TIMEOUT: 10000, // 10 seconds
  
  // Retry configuration
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
}

export const AUTH_CONFIG = {
  // Authentication endpoints
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  REFRESH: '/api/auth/refresh',
  REGISTER: '/api/auth/register',
  PROFILE: '/api/auth/profile',
  
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

// Helper to build health check URL (/health - root level)
export const getHealthCheckUrl = (): string => {
  return buildApiUrl('/health')
}

// Helper to build status URL (/api/status)
export const getStatusUrl = (): string => {
  return buildApiUrl('/api/status')
}

// Helper to build corridors URL (/api/corridors)
export const getCorridorsUrl = (): string => {
  return buildApiUrl('/api/corridors')
} 