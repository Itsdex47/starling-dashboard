'use client'

import { useState, useEffect } from 'react'

interface PaymentStatsProps {
  payments: any[]
  loading?: boolean
}

export default function PaymentStats({ payments, loading = false }: PaymentStatsProps) {
  const [stats, setStats] = useState({
    totalSent: 0,
    totalReceived: 0,
    pendingPayments: 0,
    successfulPayments: 0
  })

  useEffect(() => {
    if (payments && payments.length > 0) {
      const totalSent = payments
        .filter(p => p.type === 'sent')
        .reduce((sum, p) => sum + p.amount, 0)
      
      const totalReceived = payments
        .filter(p => p.type === 'received')
        .reduce((sum, p) => sum + p.amount, 0)
      
      const pendingPayments = payments.filter(p => p.status === 'pending').length
      const successfulPayments = payments.filter(p => p.status === 'completed').length

      setStats({
        totalSent,
        totalReceived,
        pendingPayments,
        successfulPayments
      })
    }
  }, [payments])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="w-8 h-8 bg-dark-700 rounded-xl shimmer"></div>
                <div>
                  <div className="h-4 bg-dark-700 rounded shimmer mb-2 w-20"></div>
                  <div className="h-6 bg-dark-700 rounded shimmer w-24"></div>
                </div>
              </div>
              <div className="w-12 h-12 bg-dark-700 rounded-full shimmer"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Sent */}
      <div className="glass-card-hover p-6 group">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-status-error/20 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-status-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </div>
            </div>
            <p className="text-sm font-medium text-dark-400 mb-1">Total Sent</p>
            <p className="text-2xl font-bold text-dark-100">£{stats.totalSent.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-status-error/20 to-status-error/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <div className="w-6 h-6 bg-status-error/30 rounded-full"></div>
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs text-dark-500">
          <span className="inline-flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            This month
          </span>
        </div>
      </div>

      {/* Total Received */}
      <div className="glass-card-hover p-6 group">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-status-success/20 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-status-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                </svg>
              </div>
            </div>
            <p className="text-sm font-medium text-dark-400 mb-1">Total Received</p>
            <p className="text-2xl font-bold text-dark-100">£{stats.totalReceived.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-status-success/20 to-status-success/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <div className="w-6 h-6 bg-status-success/30 rounded-full"></div>
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs text-dark-500">
          <span className="inline-flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            This month
          </span>
        </div>
      </div>

      {/* Pending Payments */}
      <div className="glass-card-hover p-6 group">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-status-pending/20 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-status-pending" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-sm font-medium text-dark-400 mb-1">Pending</p>
            <p className="text-2xl font-bold text-dark-100">{stats.pendingPayments}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-status-pending/20 to-status-pending/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <div className="w-6 h-6 bg-status-pending/30 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs text-dark-500">
          <span className="inline-flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Processing
          </span>
        </div>
      </div>

      {/* Completed Payments */}
      <div className="glass-card-hover p-6 group">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-accent-blue/20 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-sm font-medium text-dark-400 mb-1">Completed</p>
            <p className="text-2xl font-bold text-dark-100">{stats.successfulPayments}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-accent-blue/20 to-accent-blue/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <div className="w-6 h-6 bg-accent-blue/30 rounded-full"></div>
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs text-dark-500">
          <span className="inline-flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            This month
          </span>
        </div>
      </div>
    </div>
  )
} 