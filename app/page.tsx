'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import PaymentStats from '@/components/PaymentStats'
import PaymentsList from '@/components/PaymentsList'
import QuickSend from '@/components/QuickSend'
import { getPaymentHistory, Payment } from '@/lib/api'

export default function Dashboard() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadPayments = async () => {
    try {
      setLoading(true)
      const data = await getPaymentHistory()
      setPayments(data)
    } catch (err) {
      console.error('Failed to load payments:', err)
      setError('Failed to load payment data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPayments()
    
    // Refresh every 30 seconds
    const interval = setInterval(loadPayments, 30000)
    return () => clearInterval(interval)
  }, [])

  const onPaymentSent = () => {
    // Refresh payments after new payment
    setTimeout(loadPayments, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Starling Labs
          </h1>
          <p className="text-gray-600">
            Modern cross-border payments powered by blockchain technology
          </p>
        </div>

        {/* Stats Overview */}
        <div className="mb-8">
          <PaymentStats payments={payments} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Send - Left Column */}
          <div className="lg:col-span-1">
            <QuickSend onPaymentSent={onPaymentSent} />
          </div>

          {/* Payments List - Right Columns */}
          <div className="lg:col-span-2">
            <PaymentsList 
              payments={payments} 
              loading={loading} 
              error={error}
              onRefresh={loadPayments}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
