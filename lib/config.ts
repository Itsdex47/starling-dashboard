/**
 * Configuration for Starling Dashboard API Integration
 */

export const API_CONFIG = {
  // Base API URL - defaults to localhost:3001 for development
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  
  // API Endpoints
  ENDPOINTS: {
    // Payment-related endpoints
    PAYMENTS: '/payments',
    SEND_PAYMENT: '/payments/send',
    RECEIVE_PAYMENT: '/payments/receive',
    PAYMENT_STATUS: '/payments/status',
    PAYMENT_QUOTE: '/payments/quote',
    PAYMENT_PROCESS: '/payments/process',
    PAYMENT_DEMO: '/payments/demo',
    PAYMENT_HISTORY: '/payments/history',
    
    // Exchange and rates
    EXCHANGE_RATES: '/exchange-rates',
    CORRIDORS: '/corridors',
    
    // User and profile
    USER_PROFILE: '/user/profile',
    TRANSACTION_HISTORY: '/transactions',
    ANALYTICS: '/analytics',
  },
  
  // Special endpoints (these are at root level, not under /api)
  ROOT_ENDPOINTS: {
    HEALTH: '/health',
    STATUS: '/api/status',
    DEBUG_ROUTES: '/debug/routes'
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
  PROFILE: '/auth/profile',
  
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
  // Handle root-level endpoints (like /health)
  if (endpoint.startsWith('/health') || endpoint.startsWith('/debug')) {
    const baseUrl = API_CONFIG.BASE_URL.replace('/api', '') // Remove /api suffix
    return `${baseUrl}${endpoint}`
  }
  
  // Handle /api endpoints
  if (endpoint.startsWith('/api/')) {
    const baseUrl = API_CONFIG.BASE_URL.replace('/api', '') // Remove /api suffix
    return `${baseUrl}${endpoint}`
  }
  
  // Handle regular endpoints (add /api prefix)
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

// Helper to build health check URL
export const getHealthCheckUrl = (): string => {
  return buildApiUrl('/health')
}

// Helper to build status URL
export const getStatusUrl = (): string => {
  return buildApiUrl('/api/status')
} 