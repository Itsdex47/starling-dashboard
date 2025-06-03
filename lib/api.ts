import axios from 'axios'

const API_BASE_URL = process.env.STARLING_API_URL || 'http://localhost:3001'

// Demo JWT token - in production, this would come from authentication
const DEMO_JWT_TOKEN = process.env.DEMO_JWT_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMzNkNDRiZi1mZTA0LTQxMmQtYWI4ZS05NzcxZDU0YmI2ODIiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE3NDg3MjYyODAsImV4cCI6MTc0OTMzMTA4MH0.gknlRS5-JqnEGsNX4Yw_uuYo8bsQSsKERKgpBuKduVw'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${DEMO_JWT_TOKEN}`
  },
  timeout: 30000, // 30 second timeout
})

// Request interceptor for debugging
api.interceptors.request.use((config) => {
  console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data)
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`, response.data)
    return response
  },
  (error) => {
    console.error(`❌ API Error: ${error.config?.url}`, error.response?.data || error.message)
    throw new Error(error.response?.data?.error || error.message || 'API request failed')
  }
)

// Payment interface that matches the component expectations
export interface Payment {
  id: string
  recipient: string
  amount: number
  currency: string
  status: 'completed' | 'pending' | 'failed'
  type: 'sent' | 'received'
  timestamp: string
  reference?: string
  method?: string
}

export interface DemoPaymentRequest {
  amount: number
  recipientDetails: {
    firstName: string
    lastName: string
  }
}

export interface SendPaymentRequest {
  recipient: string
  amount: number
  currency: string
  reference: string
}

export interface PaymentStatusResponse {
  success: boolean
  data: {
    paymentId: string
    status: string
    progress: {
      percentage: number
      currentStep: string
      completedSteps: number
      totalSteps: number
    }
    amount: {
      input: number
      inputCurrency: string
      output: number
      outputCurrency: string
    }
    recipient: {
      name: string
      bank: string
    }
    timeline: Array<{
      step: string
      status: string
      timestamp: string
      details: string
      transactionHash?: string
    }>
    fees: {
      platformFeeUSD?: number
      networkFeeUSD?: number
      totalFeeUSD: number
    }
    createdAt: string
    completedAt?: string
    estimatedCompletionTime: string
  }
}

export interface PaymentHistoryResponse {
  success: boolean
  data: {
    payments: Array<{
      paymentId: string
      status: string
      amount: {
        input: number
        inputCurrency: string
        output: number
        outputCurrency: string
      }
      recipient: {
        name: string
        bank: string
      }
      createdAt: string
      completedAt?: string
      purpose?: string
      reference?: string
    }>
    totalCount: number
    summary: {
      totalSent: number
      completed: number
      pending: number
      failed: number
    }
  }
}

// API Methods
export const sendDemoPayment = async (paymentRequest: DemoPaymentRequest) => {
  const response = await api.post('/api/payments/demo', paymentRequest)
  return response.data
}

// Fixed: Use demo endpoint for QuickSend payments
export const sendPayment = async (paymentRequest: SendPaymentRequest) => {
  // Extract first and last name from recipient (email or phone)
  const recipientName = paymentRequest.recipient.includes('@') 
    ? paymentRequest.recipient.split('@')[0] 
    : paymentRequest.recipient
  
  // Convert recipient into firstName/lastName for API
  const nameParts = recipientName.split(' ')
  const firstName = nameParts[0] || 'Demo'
  const lastName = nameParts[1] || 'User'
  
  // Use the demo endpoint with proper format
  const response = await api.post('/api/payments/demo', {
    amount: paymentRequest.amount,
    inputCurrency: paymentRequest.currency,
    outputCurrency: 'MXN', // Default target currency
    recipientDetails: {
      firstName,
      lastName,
      email: paymentRequest.recipient.includes('@') ? paymentRequest.recipient : undefined,
      phone: !paymentRequest.recipient.includes('@') ? paymentRequest.recipient : undefined
    },
    purpose: paymentRequest.reference || 'Quick send payment',
    reference: `QS-${Date.now()}`
  })
  return response.data
}

export const getPaymentStatus = async (paymentId: string): Promise<PaymentStatusResponse['data']> => {
  const response = await api.get(`/api/payments/status/${paymentId}`)
  return response.data.data
}

// Enhanced: Better data transformation and fallback
export const getPaymentHistory = async (): Promise<Payment[]> => {
  try {
    const response = await api.get('/api/payments/history')
    const apiData = response.data.data
    
    // Transform API data to match dashboard component format
    const transformedPayments: Payment[] = apiData.payments.map((payment: any) => ({
      id: payment.paymentId,
      recipient: payment.recipient.name,
      amount: payment.amount.input,
      currency: payment.amount.inputCurrency,
      status: payment.status,
      type: 'sent', // API only tracks sent payments for now
      timestamp: payment.createdAt,
      reference: payment.reference,
      method: 'blockchain'
    }))
    
    return transformedPayments
  } catch (error) {
    console.error('Error fetching payment history:', error)
    
    // Return enhanced mock data as fallback for MVP demo
    return [
      {
        id: 'demo_1',
        recipient: 'John Smith',
        amount: 500,
        currency: 'USD',
        status: 'completed',
        type: 'sent',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        reference: 'Monthly Transfer',
        method: 'blockchain'
      },
      {
        id: 'demo_2', 
        recipient: 'Maria Garcia',
        amount: 250,
        currency: 'USD',
        status: 'pending',
        type: 'sent',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        reference: 'Family Support',
        method: 'blockchain'
      },
      {
        id: 'demo_3',
        recipient: 'Alice Johnson',
        amount: 750,
        currency: 'GBP',
        status: 'completed',
        type: 'sent',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        reference: 'Business Payment',
        method: 'blockchain'
      },
      {
        id: 'demo_4',
        recipient: 'Roberto Silva',
        amount: 125,
        currency: 'EUR',
        status: 'completed',
        type: 'sent',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        reference: 'Freelance Work',
        method: 'blockchain'
      }
    ]
  }
}

// Enhanced: Add new payment to local storage for instant feedback
export const addTemporaryPayment = (payment: Omit<Payment, 'id' | 'timestamp' | 'status'>) => {
  const newPayment: Payment = {
    ...payment,
    id: `temp_${Date.now()}`,
    timestamp: new Date().toISOString(),
    status: 'pending'
  }
  
  // Store in localStorage for instant UI feedback
  const stored = localStorage.getItem('temp_payments')
  const tempPayments = stored ? JSON.parse(stored) : []
  tempPayments.unshift(newPayment)
  
  // Keep only last 10 temporary payments
  if (tempPayments.length > 10) {
    tempPayments.splice(10)
  }
  
  localStorage.setItem('temp_payments', JSON.stringify(tempPayments))
  return newPayment
}

// Enhanced: Get payments including temporary ones for instant feedback
export const getAllPayments = async (): Promise<Payment[]> => {
  const apiPayments = await getPaymentHistory()
  
  // Get temporary payments from localStorage
  const stored = localStorage.getItem('temp_payments')
  const tempPayments = stored ? JSON.parse(stored) : []
  
  // Filter out old temporary payments (older than 1 hour)
  const recentTempPayments = tempPayments.filter((payment: Payment) => {
    const paymentTime = new Date(payment.timestamp).getTime()
    const oneHourAgo = Date.now() - (60 * 60 * 1000)
    return paymentTime > oneHourAgo
  })
  
  // Update localStorage with filtered temporary payments
  localStorage.setItem('temp_payments', JSON.stringify(recentTempPayments))
  
  // Combine API payments with temporary payments (temporary ones first)
  return [...recentTempPayments, ...apiPayments]
}

export const getQuote = async (amount: number, fromCurrency = 'USD', toCurrency = 'MXN') => {
  const response = await api.post('/api/payments/quote', {
    amount,
    fromCurrency,
    toCurrency
  })
  return response.data
}

export const getSystemHealth = async () => {
  const response = await api.get('/health')
  return response.data
}

export const getPaymentHealth = async () => {
  const response = await api.get('/api/payments/health')
  return response.data
}

// Utility function to format currency
export const formatCurrency = (amount: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

// Utility function to format date
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default api
