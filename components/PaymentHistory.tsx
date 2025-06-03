'use client'

import { useState, useEffect, Fragment } from 'react'
import { 
  FunnelIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { Menu, Transition } from '@headlessui/react'
import { getPaymentHistory } from '@/lib/api'
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
  description?: string
}

export default function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [dateRange, setDateRange] = useState('all')

  const statusOptions = [
    { value: 'all', label: 'All Statuses', icon: '⚪' },
    { value: 'completed', label: 'Completed', icon: '✅' },
    { value: 'pending', label: 'Pending', icon: '🟡' },
    { value: 'failed', label: 'Failed', icon: '❌' }
  ]

  const typeOptions = [
    { value: 'all', label: 'All Types', icon: '🔄' },
    { value: 'sent', label: 'Sent', icon: '↗️' },
    { value: 'received', label: 'Received', icon: '↙️' }
  ]

  const dateOptions = [
    { value: 'all', label: 'All Time', icon: '📅' },
    { value: '7d', label: 'Last 7 days', icon: '📆' },
    { value: '30d', label: 'Last 30 days', icon: '🗓️' },
    { value: '90d', label: 'Last 90 days', icon: '📊' }
  ]

  useEffect(() => {
    loadPayments()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [payments, searchTerm, statusFilter, typeFilter, dateRange])

  const loadPayments = async () => {
    try {
      setLoading(true)
      const data = await getPaymentHistory()
      
      // Handle both response formats (API object vs fallback array)
      const paymentsArray = Array.isArray(data) ? data : (data as any)?.payments || []
      
      // Transform API data to match Payment interface
      const transformedPayments: Payment[] = paymentsArray.map((payment: any) => ({
        id: payment.paymentId || payment.id,
        recipient: payment.recipient?.name || payment.recipient,
        amount: payment.amount?.input || payment.amount,
        currency: payment.amount?.inputCurrency || payment.currency,
        status: payment.status as 'completed' | 'pending' | 'failed',
        type: 'sent' as 'sent' | 'received',
        timestamp: payment.createdAt || payment.timestamp,
        reference: payment.reference,
        method: payment.recipient?.bank || payment.method,
        description: payment.purpose || payment.description
      }))
      
      setPayments(transformedPayments)
    } catch (error) {
      console.error('Failed to load payment history:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...payments]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(payment => 
        payment.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter)
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(payment => payment.type === typeFilter)
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date()
      const filterDate = new Date()
      
      switch (dateRange) {
        case '7d':
          filterDate.setDate(now.getDate() - 7)
          break
        case '30d':
          filterDate.setDate(now.getDate() - 30)
          break
        case '90d':
          filterDate.setDate(now.getDate() - 90)
          break
      }
      
      if (dateRange !== 'all') {
        filtered = filtered.filter(payment => new Date(payment.timestamp) >= filterDate)
      }
    }

    setFilteredPayments(filtered)
  }

  const exportToCSV = () => {
    const headers = ['Date', 'ID', 'Type', 'Recipient', 'Amount', 'Currency', 'Status', 'Description']
    const csvData = filteredPayments.map(payment => [
      new Date(payment.timestamp).toLocaleDateString(),
      payment.id,
      payment.type,
      payment.recipient,
      payment.amount,
      payment.currency,
      payment.status,
      payment.description || ''
    ])

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `payment-history-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
      case 'failed':
        return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200'
      case 'pending':
        return 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200'
      default:
        return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    return type === 'sent' ? '↗️' : '↙️'
  }

  const selectedStatus = statusOptions.find(s => s.value === statusFilter)
  const selectedType = typeOptions.find(t => t.value === typeFilter)
  const selectedDate = dateOptions.find(d => d.value === dateRange)

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded-xl w-1/3"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex space-x-4">
              <div className="h-6 bg-gray-200 rounded w-1/6"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/6"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/6"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden backdrop-blur-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Transaction History</h3>
                <p className="text-gray-600 mt-1">View and manage your payment transactions</p>
              </div>
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100 px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 bg-white/70 rounded-xl text-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 transition-all duration-200"
              />
            </div>

            {/* Status Filter */}
            <Menu as="div" className="relative">
              {({ open }) => (
                <>
                  <Menu.Button className="w-full flex items-center justify-between px-4 py-3 border-2 border-gray-200 bg-white/70 rounded-xl hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200">
                    <span className="flex items-center text-lg font-medium text-gray-900">
                      <span className="mr-3">{selectedStatus?.icon}</span>
                      <span>{selectedStatus?.label}</span>
                    </span>
                    <ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
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
                    <Menu.Items className="absolute z-50 mt-2 w-full origin-top-right bg-white rounded-xl border border-gray-200 shadow-lg backdrop-blur-sm focus:outline-none">
                      <div className="py-2">
                        {statusOptions.map((status) => (
                          <Menu.Item key={status.value}>
                            {({ active }) => (
                              <button
                                type="button"
                                onClick={() => setStatusFilter(status.value)}
                                className={`${
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                } group flex items-center w-full px-4 py-3 text-sm transition-colors ${
                                  statusFilter === status.value ? 'text-blue-600 bg-blue-50' : ''
                                }`}
                              >
                                <span className="mr-3">{status.icon}</span>
                                <span className="font-medium">{status.label}</span>
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

            {/* Type Filter */}
            <Menu as="div" className="relative">
              {({ open }) => (
                <>
                  <Menu.Button className="w-full flex items-center justify-between px-4 py-3 border-2 border-gray-200 bg-white/70 rounded-xl hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200">
                    <span className="flex items-center text-lg font-medium text-gray-900">
                      <span className="mr-3">{selectedType?.icon}</span>
                      <span>{selectedType?.label}</span>
                    </span>
                    <ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
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
                    <Menu.Items className="absolute z-50 mt-2 w-full origin-top-right bg-white rounded-xl border border-gray-200 shadow-lg backdrop-blur-sm focus:outline-none">
                      <div className="py-2">
                        {typeOptions.map((type) => (
                          <Menu.Item key={type.value}>
                            {({ active }) => (
                              <button
                                type="button"
                                onClick={() => setTypeFilter(type.value)}
                                className={`${
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                } group flex items-center w-full px-4 py-3 text-sm transition-colors ${
                                  typeFilter === type.value ? 'text-blue-600 bg-blue-50' : ''
                                }`}
                              >
                                <span className="mr-3">{type.icon}</span>
                                <span className="font-medium">{type.label}</span>
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

            {/* Date Range */}
            <Menu as="div" className="relative">
              {({ open }) => (
                <>
                  <Menu.Button className="w-full flex items-center justify-between px-4 py-3 border-2 border-gray-200 bg-white/70 rounded-xl hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200">
                    <span className="flex items-center text-lg font-medium text-gray-900">
                      <span className="mr-3">{selectedDate?.icon}</span>
                      <span>{selectedDate?.label}</span>
                    </span>
                    <ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
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
                    <Menu.Items className="absolute z-50 mt-2 w-full origin-top-right bg-white rounded-xl border border-gray-200 shadow-lg backdrop-blur-sm focus:outline-none">
                      <div className="py-2">
                        {dateOptions.map((date) => (
                          <Menu.Item key={date.value}>
                            {({ active }) => (
                              <button
                                type="button"
                                onClick={() => setDateRange(date.value)}
                                className={`${
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                } group flex items-center w-full px-4 py-3 text-sm transition-colors ${
                                  dateRange === date.value ? 'text-blue-600 bg-blue-50' : ''
                                }`}
                              >
                                <span className="mr-3">{date.icon}</span>
                                <span className="font-medium">{date.label}</span>
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

            {/* Results Count */}
            <div className="flex items-center justify-center bg-white/70 rounded-xl border-2 border-gray-200 px-4 py-3">
              <FunnelIcon className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-lg font-medium text-gray-900">
                <span className="number-lg">{filteredPayments.length}</span> of <span className="number-lg">{payments.length}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Payment List */}
        <div className="p-8">
          {filteredPayments.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarIcon className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No payments found</h3>
              <p className="text-gray-600 text-lg">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || dateRange !== 'all'
                  ? 'Try adjusting your filters to see more results'
                  : 'Your payment history will appear here once you make your first transaction'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPayments.map((payment) => (
                <div key={payment.id} className="bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      {/* Type Icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        payment.type === 'sent' 
                          ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-600' 
                          : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-600'
                      }`}>
                        <span className="text-xl">{getTypeIcon(payment.type)}</span>
                      </div>

                      {/* Payment Details */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h4 className="text-xl font-bold text-gray-900">{payment.recipient}</h4>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(payment.status)}`}>
                            {payment.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                            {payment.id.substring(0, 8)}...
                          </span>
                          <span>
                            {new Date(payment.timestamp).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {payment.description && (
                            <span className="italic">{payment.description}</span>
                          )}
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="text-right">
                        <div className="number-2xl font-bold text-gray-900">
                          {payment.currency} {payment.amount.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500 capitalize">
                          {payment.type} payment
                        </div>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={() => {
                        setSelectedPayment(payment)
                        setShowDetail(true)
                      }}
                      className="ml-6 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showDetail && selectedPayment && (
        <PaymentDetailModal 
          payment={selectedPayment}
          isOpen={showDetail}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  )
} 