import { API_CONFIG, buildApiUrl, getCommonHeaders } from './config'

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Generic API client with retry logic and error handling
 */
class ApiClient {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<T> {
    const url = buildApiUrl(endpoint)
    const headers = getCommonHeaders()

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new ApiError(
          response.status,
          response.statusText,
          errorData.message || `HTTP Error: ${response.status}`,
          errorData
        )
      }

      const data = await response.json()
      return data
    } catch (error: unknown) {
      // Retry logic for network errors
      if (
        retryCount < API_CONFIG.RETRY_ATTEMPTS &&
        (error instanceof TypeError || (error as any)?.name === 'AbortError')
      ) {
        await new Promise(resolve => 
          setTimeout(resolve, API_CONFIG.RETRY_DELAY * (retryCount + 1))
        )
        return this.makeRequest<T>(endpoint, options, retryCount + 1)
      }

      // Re-throw ApiError or convert to ApiError
      if (error instanceof ApiError) {
        throw error
      }

      throw new ApiError(
        0,
        'Network Error',
        error instanceof Error ? error.message : 'Unknown network error'
      )
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: 'GET' })
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' })
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

/**
 * Utility function to check if API is reachable
 */
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    await apiClient.get('/health')
    return true
  } catch (error) {
    console.warn('API health check failed:', error)
    return false
  }
}

/**
 * Utility function to handle API errors consistently
 */
export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        return 'Authentication required. Please log in.'
      case 403:
        return 'Access denied. Insufficient permissions.'
      case 404:
        return 'Resource not found.'
      case 429:
        return 'Too many requests. Please try again later.'
      case 500:
        return 'Server error. Please try again later.'
      default:
        return error.message || 'An unexpected error occurred.'
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unknown error occurred.'
} 