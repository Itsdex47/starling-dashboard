'use client'

import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { 
  XMarkIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { getPaymentStatus } from '@/lib/api'

interface PaymentDetailModalProps {
  payment: any
  isOpen: boolean
  onClose: () => void
}

export default function PaymentDetailModal({ payment, isOpen, onClose }: PaymentDetailModalProps) {
  const [paymentDetails, setPaymentDetails] = useState(payment)
  const [loading, setLoading] = useState(false)

  const refreshPaymentStatus = async () => {
    setLoading(true)
    try {
      const details = await getPaymentStatus(payment.id)
      setPaymentDetails(details)
    } catch (error) {
      console.error('Failed to refresh payment status:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchDetails = async () => {
      if (isOpen && payment?.id) {
        setLoading(true)
        try {
          const details = await getPaymentStatus(payment.id)
          setPaymentDetails(details)
        } catch (error) {
          console.error('Failed to fetch payment details:', error)
        }
        setLoading(false)
      }
    }

    fetchDetails()
  }, [isOpen, payment?.id])

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
    }
  }

  const steps = paymentDetails?.timeline || []

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Payment Details
                  </Dialog.Title>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={refreshPaymentStatus}
                      disabled={loading}
                      className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                      onClick={onClose}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="text-lg font-semibold">${paymentDetails?.amount?.input?.toLocaleString() || '0'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Recipient Gets</p>
                      <p className="text-lg font-semibold text-green-600">
                        {paymentDetails?.amount?.output?.toLocaleString() || '0'} MXN
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Recipient</p>
                      <p className="font-medium">{paymentDetails?.recipient?.name || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        paymentDetails?.status === 'completed' ? 'bg-green-100 text-green-800' :
                        paymentDetails?.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {paymentDetails?.status || 'unknown'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Timeline */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Payment Progress</h4>
                  
                  {paymentDetails?.progress && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{paymentDetails.progress.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-starling-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${paymentDetails.progress.percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {paymentDetails.progress.completedSteps} of {paymentDetails.progress.totalSteps} steps completed
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    {steps.map((step: any, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getStepIcon(step.status)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{step.step}</p>
                          <p className="text-sm text-gray-600">{step.details}</p>
                          {step.transactionHash && (
                            <p className="text-xs text-gray-500 font-mono">
                              TX: {step.transactionHash}
                            </p>
                          )}
                          <p className="text-xs text-gray-400">
                            {new Date(step.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fees Breakdown */}
                {paymentDetails?.fees && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Fee Breakdown</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Platform Fee:</span>
                        <span>${paymentDetails.fees.platformFeeUSD?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Network Fee:</span>
                        <span>${paymentDetails.fees.networkFeeUSD?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>Total Fees:</span>
                        <span>${paymentDetails.fees.totalFeeUSD?.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
