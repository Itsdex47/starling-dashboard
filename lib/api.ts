import { apiClient, handleApiError, checkApiHealth } from './api-client'
import { API_CONFIG, ENVIRONMENT } from './config'

export interface Payment {
  id: string
  recipient: string
  amount: number
  currency: string
  status: 'completed' | 'pending' | 'failed'
  type: 'sent' | 'received'
  timestamp: string
  reference?: string
  description?: string
}

export interface ExchangeRate {
  from: string
  to: string
  rate: number
  timestamp: string
}

export interface SendPaymentRequest {
  recipient: string
  amount: number
  currency: string
  reference?: string
  description?: string
}

// Mock payment data for development/fallback
const mockPayments: Payment[] = [
  {
    id: '1',
    amount: 250.00,
    currency: 'GBP',
    type: 'sent',
    status: 'completed',
    recipient: 'John Smith',
    timestamp: '2024-06-01T10:30:00Z',
    description: 'Lunch payment'
  },
  {
    id: '2',
    amount: 1500.00,
    currency: 'GBP',
    type: 'received',
    status: 'completed',
    recipient: 'Alice Johnson',
    timestamp: '2024-05-30T14:20:00Z',
    description: 'Freelance work'
  },
  {
    id: '3',
    amount: 75.50,
    currency: 'GBP',
    type: 'sent',
    status: 'pending',
    recipient: 'Bob Wilson',
    timestamp: '2024-06-01T16:45:00Z',
    description: 'Coffee subscription'
  },
  {
    id: '4',
    amount: 320.00,
    currency: 'GBP',
    type: 'received',
    status: 'completed',
    recipient: 'Emma Davis',
    timestamp: '2024-05-29T09:15:00Z',
    description: 'Rent payment'
  },
  {
    id: '5',
    amount: 45.99,
    currency: 'GBP',
    type: 'sent',
    status: 'failed',
    recipient: 'Tech Store',
    timestamp: '2024-05-28T18:30:00Z',
    description: 'Online purchase'
  }
]

/**
 * Get payment history from API or fallback to mock data
 */
export async function getPaymentHistory(): Promise<Payment[]> {
  try {
    // Check if API is available
    const isApiHealthy = await checkApiHealth()
    
    if (isApiHealthy) {
      // Use real API
      const payments = await apiClient.get<Payment[]>(API_CONFIG.ENDPOINTS.PAYMENTS)
      return payments
    } else {
      console.warn('API not available, using mock data')
      // Fallback to mock data with simulated delay
      await new Promise(resolve => setTimeout(resolve, 500))
      return mockPayments
    }
  } catch (error) {
    console.error('Failed to fetch payment history:', handleApiError(error))
    
    // Fallback to mock data
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockPayments
  }
}

/**
 * Send a payment via API or simulate if API unavailable
 */
export async function sendPayment(payment: SendPaymentRequest): Promise<Payment> {
  try {
    // Check if API is available
    const isApiHealthy = await checkApiHealth()
    
    if (isApiHealthy) {
      // Use real API
      const result = await apiClient.post<Payment>(API_CONFIG.ENDPOINTS.SEND_PAYMENT, payment)
      return result
    } else {
      console.warn('API not available, simulating payment')
      // Simulate payment creation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newPayment: Payment = {
        ...payment,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        status: 'pending',
        type: 'sent'
      }
      
      return newPayment
    }
  } catch (error) {
    throw new Error(handleApiError(error))
  }
}

/**
 * Get payment status from API
 */
export async function getPaymentStatus(paymentId: string): Promise<Payment> {
  try {
    // Check if API is available
    const isApiHealthy = await checkApiHealth()
    
    if (isApiHealthy) {
      // Use real API
      const payment = await apiClient.get<Payment>(`${API_CONFIG.ENDPOINTS.PAYMENT_STATUS}/${paymentId}`)
      return payment
    } else {
      // Fallback to mock data
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const payment = mockPayments.find(p => p.id === paymentId)
      
      if (payment) {
        return payment
      }
      
      // Return a default payment if not found
      return {
        id: paymentId,
        amount: 0,
        currency: 'GBP',
        type: 'sent',
        status: 'completed',
        recipient: 'Unknown',
        timestamp: new Date().toISOString(),
        description: 'Payment details not found'
      }
    }
  } catch (error) {
    throw new Error(handleApiError(error))
  }
}

/**
 * Get current exchange rates
 */
export async function getExchangeRates(from: string = 'GBP', to: string = 'USD'): Promise<ExchangeRate> {
  try {
    const isApiHealthy = await checkApiHealth()
    
    if (isApiHealthy) {
      const rate = await apiClient.get<ExchangeRate>(`${API_CONFIG.ENDPOINTS.EXCHANGE_RATES}?from=${from}&to=${to}`)
      return rate
    } else {
      // Mock exchange rate
      return {
        from,
        to,
        rate: 1.27, // Mock GBP to USD rate
        timestamp: new Date().toISOString()
      }
    }
  } catch (error) {
    throw new Error(handleApiError(error))
  }
}

/**
 * Create a payment request (for receiving payments)
 */
export async function createPaymentRequest(amount: number, currency: string = 'GBP', reference?: string): Promise<{ id: string; qrCode: string }> {
  try {
    const isApiHealthy = await checkApiHealth()
    
    if (isApiHealthy) {
      const result = await apiClient.post<{ id: string; qrCode: string }>(API_CONFIG.ENDPOINTS.RECEIVE_PAYMENT, {
        amount,
        currency,
        reference
      })
      return result
    } else {
      // Mock payment request
      const id = Math.random().toString(36).substr(2, 9)
      const qrCode = `starling://pay/${id}/${amount}/${currency}${reference ? `?ref=${reference}` : ''}`
      
      return { id, qrCode }
    }
  } catch (error) {
    throw new Error(handleApiError(error))
  }
} 