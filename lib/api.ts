export interface Payment {
  id: string
  amount: number
  currency: string
  type: 'sent' | 'received'
  status: 'completed' | 'pending' | 'failed'
  recipient: string
  date: string
  description?: string
}

// Mock payment data for development
const mockPayments: Payment[] = [
  {
    id: '1',
    amount: 250.00,
    currency: 'GBP',
    type: 'sent',
    status: 'completed',
    recipient: 'John Smith',
    date: '2024-06-01T10:30:00Z',
    description: 'Lunch payment'
  },
  {
    id: '2',
    amount: 1500.00,
    currency: 'GBP',
    type: 'received',
    status: 'completed',
    recipient: 'Alice Johnson',
    date: '2024-05-30T14:20:00Z',
    description: 'Freelance work'
  },
  {
    id: '3',
    amount: 75.50,
    currency: 'GBP',
    type: 'sent',
    status: 'pending',
    recipient: 'Bob Wilson',
    date: '2024-06-01T16:45:00Z',
    description: 'Coffee subscription'
  },
  {
    id: '4',
    amount: 320.00,
    currency: 'GBP',
    type: 'received',
    status: 'completed',
    recipient: 'Emma Davis',
    date: '2024-05-29T09:15:00Z',
    description: 'Rent payment'
  },
  {
    id: '5',
    amount: 45.99,
    currency: 'GBP',
    type: 'sent',
    status: 'failed',
    recipient: 'Tech Store',
    date: '2024-05-28T18:30:00Z',
    description: 'Online purchase'
  }
]

export async function getPaymentHistory(): Promise<Payment[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // In a real app, this would make an actual API call
  // const response = await fetch(`${process.env.STARLING_API_URL}/payments`)
  // return response.json()
  
  return mockPayments
}

export async function sendPayment(payment: Omit<Payment, 'id' | 'date' | 'status'>): Promise<Payment> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const newPayment: Payment = {
    ...payment,
    id: Math.random().toString(36).substr(2, 9),
    date: new Date().toISOString(),
    status: 'pending'
  }
  
  // In a real app, this would make an actual API call
  // const response = await fetch(`${process.env.STARLING_API_URL}/payments`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(newPayment)
  // })
  // return response.json()
  
  return newPayment
} 