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
    
    // Removed auto-refresh to prevent constant reloading
    // Users can manually refresh using the refresh button in PaymentsList
  }, [])

  const onPaymentSent = () => {
    // Refresh payments after new payment
    setTimeout(loadPayments, 1000)
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Organic background pattern */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-organic-pattern"></div>
        <div className="absolute inset-0 bg-topographic bg-topographic"></div>
      </div>
      
      <Header />
      
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-accent-green/10 text-accent-green text-sm font-medium rounded-full border border-accent-green/20 mb-6">
            <div className="w-2 h-2 bg-accent-green rounded-full mr-2 animate-pulse"></div>
            Live Network
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-gradient">Cross-Border</span>
            <br />
            <span className="text-dark-100">Payment Network</span>
          </h1>
          <p className="text-xl text-dark-300 max-w-2xl mx-auto leading-relaxed">
            Send money anywhere in the world with instant settlement, 
            transparent fees, and bank-grade security powered by blockchain technology.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="mb-12">
          <PaymentStats payments={payments} loading={loading} />
        </div>

        {/* Network Status Banner */}
        <div className="glass-card p-6 mb-8 border border-accent-green/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-accent-green rounded-full animate-pulse glow-green"></div>
              <div>
                <h3 className="text-lg font-semibold text-dark-100">Network Status</h3>
                <p className="text-dark-400">All systems operational</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-accent-green">99.9%</div>
              <div className="text-sm text-dark-400">Uptime</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-accent-gold">2.3s</div>
              <div className="text-sm text-dark-400">Avg Settlement</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-accent-purple">156</div>
              <div className="text-sm text-dark-400">Countries</div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Quick Send - Left Column */}
          <div className="xl:col-span-1">
            <div className="floating">
              <QuickSend onPaymentSent={onPaymentSent} />
            </div>
          </div>

          {/* Payments List - Right Columns */}
          <div className="xl:col-span-2">
            <PaymentsList 
              payments={payments} 
              loading={loading} 
              error={error}
              onRefresh={loadPayments}
            />
          </div>
        </div>

        {/* Additional Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {/* Feature 1 */}
          <div className="glass-card-hover p-6">
            <div className="w-12 h-12 bg-accent-blue/20 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-dark-100 mb-2">Instant Settlement</h3>
            <p className="text-dark-400 text-sm">
              Payments settle in seconds, not days. Our blockchain infrastructure ensures real-time finality.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-card-hover p-6">
            <div className="w-12 h-12 bg-accent-purple/20 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-dark-100 mb-2">Bank-Grade Security</h3>
            <p className="text-dark-400 text-sm">
              Multi-layer encryption, fraud detection, and compliance with international banking standards.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-card-hover p-6">
            <div className="w-12 h-12 bg-accent-gold/20 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-dark-100 mb-2">Transparent Pricing</h3>
            <p className="text-dark-400 text-sm">
              No hidden fees. Real-time exchange rates. See exactly what you pay before you send.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
