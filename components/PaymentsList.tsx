'use client'

import { useState, Fragment } from 'react'
import { ArrowPathIcon, FunnelIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { Menu, Transition } from '@headlessui/react'
import PaymentDetailModal from './PaymentDetailModal'

interface Payment {
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

interface PaymentsListProps {
  payments: Payment[]
  loading: boolean
  error: string
  onRefresh: () => void
}

export default function PaymentsList({ payments, loading, error, onRefresh }: PaymentsListProps) {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const statusOptions = [
    { value: 'all', label: 'All Status', icon: null },
    { value: 'completed', label: 'Completed', icon: 'bg-status-success' },
    { value: 'pending', label: 'Pending', icon: 'bg-status-pending' },
    { value: 'failed', label: 'Failed', icon: 'bg-status-error' }
  ]

  const typeOptions = [
    { value: 'all', label: 'All Types', icon: null },
    { value: 'sent', label: 'Sent', icon: 'text-status-error' },
    { value: 'received', label: 'Received', icon: 'text-status-success' }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <div className="w-3 h-3 bg-status-success rounded-full"></div>
        )
      case 'pending':
        return (
          <div className="w-3 h-3 bg-status-pending rounded-full animate-pulse"></div>
        )
      case 'failed':
        return (
          <div className="w-3 h-3 bg-status-error rounded-full"></div>
        )
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
    
    switch (status) {
      case 'completed':
        return `${baseClasses} status-success`
      case 'pending':
        return `${baseClasses} status-pending`
      case 'failed':
        return `${baseClasses} status-error`
      default:
        return `${baseClasses} status-info`
    }
  }

  const getTypeIcon = (type: string) => {
    if (type === 'sent') {
      return (
        <div className="w-8 h-8 bg-status-error/20 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-status-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
          </svg>
        </div>
      )
    } else {
      return (
        <div className="w-8 h-8 bg-status-success/20 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-status-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
          </svg>
        </div>
      )
    }
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    const matchesType = typeFilter === 'all' || payment.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  if (loading) {
    return (
      <div className="glass-card">
        <div className="px-6 py-4 border-b border-dark-600/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-6 bg-dark-700 rounded shimmer w-32 mb-2"></div>
              <div className="h-4 bg-dark-700 rounded shimmer w-48"></div>
            </div>
            <div className="h-10 bg-dark-700 rounded shimmer w-24"></div>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-4 p-4 bg-dark-800/50 rounded-lg">
              <div className="w-8 h-8 bg-dark-700 rounded-full shimmer"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-dark-700 rounded shimmer w-32"></div>
                <div className="h-3 bg-dark-700 rounded shimmer w-48"></div>
              </div>
              <div className="h-6 bg-dark-700 rounded shimmer w-20"></div>
              <div className="h-4 bg-dark-700 rounded shimmer w-16"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-card">
        <div className="p-6 text-center">
          <div className="w-12 h-12 bg-status-error/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-status-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-dark-100 mb-2">Failed to load payments</h3>
          <p className="text-dark-400 mb-4">{error}</p>
          <button
            onClick={onRefresh}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="glass-card">
        {/* Header */}
        <div className="px-6 py-4 border-b border-dark-600/30">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-dark-100">Recent Transactions</h2>
              <p className="text-sm text-dark-400">
                {filteredPayments.length} of {payments.length} transactions
              </p>
            </div>
            <button
              onClick={onRefresh}
              className="btn-icon"
              disabled={loading}
            >
              <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Modern Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-dark-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10 w-full"
              />
            </div>

            {/* Status Filter Dropdown */}
            <Menu as="div" className="relative">
              {({ open }) => (
                <>
                  <Menu.Button className="flex items-center px-4 py-2 text-dark-300 hover:text-dark-100 rounded-lg hover:bg-dark-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-dark-600/50 border border-dark-600/30 bg-dark-800/30 backdrop-blur-sm whitespace-nowrap">
                    <FunnelIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      {statusOptions.find(opt => opt.value === statusFilter)?.label}
                    </span>
                    <ChevronDownIcon className={`ml-2 h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right glass-card border border-dark-600/30 focus:outline-none">
                      <div className="py-2">
                        {statusOptions.map((option) => (
                          <Menu.Item key={option.value}>
                            {({ active }) => (
                              <button
                                onClick={() => setStatusFilter(option.value)}
                                className={`${
                                  active ? 'bg-dark-700/50 text-dark-100' : 'text-dark-300'
                                } group flex items-center w-full px-4 py-2 text-sm transition-colors ${
                                  statusFilter === option.value ? 'text-accent-green' : ''
                                }`}
                              >
                                {option.icon && (
                                  <div className={`w-3 h-3 rounded-full mr-3 ${option.icon}`}></div>
                                )}
                                {option.label}
                              </button>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>

            {/* Type Filter Dropdown */}
            <Menu as="div" className="relative">
              {({ open }) => (
                <>
                  <Menu.Button className="flex items-center px-4 py-2 text-dark-300 hover:text-dark-100 rounded-lg hover:bg-dark-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-dark-600/50 border border-dark-600/30 bg-dark-800/30 backdrop-blur-sm whitespace-nowrap">
                    <span className="text-sm">
                      {typeOptions.find(opt => opt.value === typeFilter)?.label}
                    </span>
                    <ChevronDownIcon className={`ml-2 h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right glass-card border border-dark-600/30 focus:outline-none">
                      <div className="py-2">
                        {typeOptions.map((option) => (
                          <Menu.Item key={option.value}>
                            {({ active }) => (
                              <button
                                onClick={() => setTypeFilter(option.value)}
                                className={`${
                                  active ? 'bg-dark-700/50 text-dark-100' : 'text-dark-300'
                                } group flex items-center w-full px-4 py-2 text-sm transition-colors ${
                                  typeFilter === option.value ? 'text-accent-green' : ''
                                }`}
                              >
                                {option.value !== 'all' && (
                                  <svg className={`w-4 h-4 mr-3 ${option.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {option.value === 'sent' ? (
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                    ) : (
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                    )}
                                  </svg>
                                )}
                                {option.label}
                              </button>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>
          </div>
        </div>

        {/* Transaction List */}
        <div className="divide-y divide-dark-600/30">
          {filteredPayments.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-dark-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-dark-100 mb-2">No transactions found</h3>
              <p className="text-dark-400">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'Your transactions will appear here'}
              </p>
            </div>
          ) : (
            filteredPayments.map((payment) => (
              <div
                key={payment.id}
                onClick={() => setSelectedPayment(payment)}
                className="px-6 py-4 hover:bg-dark-800/30 cursor-pointer transition-colors group"
              >
                <div className="flex items-center space-x-4">
                  {/* Type Icon */}
                  <div className="flex-shrink-0">
                    {getTypeIcon(payment.type)}
                  </div>

                  {/* Transaction Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-dark-100 truncate group-hover:text-accent-green transition-colors">
                        {payment.type === 'sent' ? `To ${payment.recipient}` : `From ${payment.recipient}`}
                      </p>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${
                          payment.type === 'sent' ? 'text-status-error' : 'text-status-success'
                        }`}>
                          {payment.type === 'sent' ? '-' : '+'}£{payment.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-dark-400">{payment.currency}</p>
                      </div>
                    </div>
                    
                    <div className="mt-1 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(payment.status)}
                        <span className="text-xs text-dark-400">
                          {new Date(payment.timestamp).toLocaleDateString()} at{' '}
                          {new Date(payment.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <span className={getStatusBadge(payment.status)}>
                        {payment.status}
                      </span>
                    </div>

                    {payment.reference && (
                      <p className="mt-1 text-xs text-dark-500 font-mono">
                        Ref: {payment.reference}
                      </p>
                    )}
                  </div>

                  {/* Chevron */}
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-dark-500 group-hover:text-dark-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination placeholder */}
        {filteredPayments.length > 0 && (
          <div className="px-6 py-4 border-t border-dark-600/30 bg-dark-800/20">
            <div className="flex items-center justify-between">
              <p className="text-sm text-dark-400">
                Showing {filteredPayments.length} transactions
              </p>
              <div className="flex items-center space-x-2">
                <button className="btn-ghost text-xs px-3 py-1" disabled>
                  Previous
                </button>
                <span className="text-xs text-dark-400">Page 1 of 1</span>
                <button className="btn-ghost text-xs px-3 py-1" disabled>
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <PaymentDetailModal
          payment={selectedPayment}
          isOpen={!!selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </>
  )
}
