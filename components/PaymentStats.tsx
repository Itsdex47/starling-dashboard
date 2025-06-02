'use client'

import { useState, useEffect } from 'react'

interface PaymentStatsProps {
  payments: any[]
}

export default function PaymentStats({ payments }: PaymentStatsProps) {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-red-100 rounded-lg">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Sent</p>
            <p className="text-2xl font-semibold text-gray-900">£{stats.totalSent.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Received</p>
            <p className="text-2xl font-semibold text-gray-900">£{stats.totalReceived.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Pending</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.pendingPayments}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Completed</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.successfulPayments}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 