'use client'

import { useState } from 'react'
import { 
  ArrowPathIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import PaymentDetailModal from './PaymentDetailModal'

interface PaymentsListProps {
  payments: any[]
  loading: boolean
  error: string
  onRefresh: () => void
}

export default function PaymentsList({ payments, loading, error, onRefresh }: PaymentsListProps) {
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [showDetail, setShowDetail] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'status-completed'
      case 'failed':
        return 'status-failed'
      default:
        return 'status-processing'
    }
  }

  const handleViewDetails = (payment: any) => {
    setSelectedPayment(payment)
    setShowDetail(true)
  }

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>
          <button className="btn-secondary" disabled>
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full shimmer" />
                  <div>
                    <div className="h-4 bg-gray-200 rounded shimmer mb-2 w-32" />
                    <div className="h-3 bg-gray-200 rounded shimmer w-24" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-gray-200 rounded shimmer mb-2 w-20" />
                  <div className="h-3 bg-gray-200 rounded shimmer w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>
          <button 
            onClick={onRefresh}
            className="btn-secondary hover:bg-gray-100 transition-colors"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {payments.length === 0 ? (
          <div className="text-center py-12">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No payments yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Send your first payment using the Quick Send form
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.slice(0, 10).map((payment) => (
              <div 
                key={payment.id} 
                className="border border-gray-200 rounded-lg p-4 hover:border-starling-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {getStatusIcon(payment.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        To {payment.recipient || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {payment.id.substring(0, 8)}... • {payment.description || 'Payment'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        £{payment.amount?.toLocaleString() || '0'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {payment.currency || 'GBP'}
                      </p>
                    </div>
                    
                    <span className={getStatusClass(payment.status)}>
                      {payment.status}
                    </span>
                    
                    <button 
                      onClick={() => handleViewDetails(payment)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="View Details"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
