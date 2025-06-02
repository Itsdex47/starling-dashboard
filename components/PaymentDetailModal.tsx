'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface PaymentDetailModalProps {
  payment: any
  isOpen: boolean
  onClose: () => void
}

export default function PaymentDetailModal({ payment, isOpen, onClose }: PaymentDetailModalProps) {
  if (!payment) return null

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <div className="w-12 h-12 bg-status-success/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-status-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )
      case 'pending':
        return (
          <div className="w-12 h-12 bg-status-pending/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-status-pending animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )
      case 'failed':
        return (
          <div className="w-12 h-12 bg-status-error/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-status-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div> 
        )
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
    
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

  return (
    <Transition.Root show={isOpen} as={Fragment}>
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
          <div className="modal-overlay" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="modal-content max-w-4xl w-full">
                {/* Redesigned Header */}
                <div className="flex items-start justify-between pb-6 border-b border-dark-600/30">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(payment.status)}
                        <Dialog.Title className="text-2xl font-bold text-dark-100 text-display-xl">
                          Payment Details
                        </Dialog.Title>
                      </div>
                      <span className={getStatusBadge(payment.status)}>
                        {payment.status}
                      </span>
                    </div>
                    <div className="bg-dark-800/30 rounded-lg px-4 py-2 inline-block">
                      <p className="text-xs text-dark-400 uppercase tracking-wider mb-1">Transaction ID</p>
                      <p className="text-sm text-dark-200 font-mono">{payment.id}</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="btn-icon hover:bg-dark-700 w-10 h-10 ml-4"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Redesigned Content */}
                <div className="pt-8 space-y-8">
                  {/* Amount Card - Keep as is since it works well */}
                  <div className="text-center py-6 bg-dark-800/30 rounded-2xl border border-dark-600/20">
                    <div className="mb-4">
                      <p className="text-sm text-dark-400 mb-2 text-display-sm uppercase tracking-wider">Transaction Amount</p>
                      <p className={`number-4xl font-bold mb-2 ${
                        payment.type === 'sent' ? 'text-status-error' : 'text-status-success'
                      }`}>
                        {payment.type === 'sent' ? '-' : '+'}£{payment.amount?.toLocaleString() || '0'}
                      </p>
                      <p className="text-base text-dark-400 font-medium">{payment.currency || 'GBP'}</p>
                    </div>
                  </div>

                  {/* Redesigned Information Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Transaction Details */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-dark-100 text-display-lg mb-4 flex items-center">
                          <svg className="w-5 h-5 text-accent-blue mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Transaction Details
                        </h3>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between items-start py-3 border-b border-dark-700/30">
                            <div>
                              <p className="text-sm text-dark-400 mb-1">
                                {payment.type === 'sent' ? 'Recipient' : 'Sender'}
                              </p>
                              <p className="text-dark-100 font-semibold text-display-base">{payment.recipient}</p>
                            </div>
                            <div className="text-right">
                              {payment.type === 'sent' ? (
                                <div className="flex items-center text-status-error">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                  </svg>
                                  <span className="text-sm font-medium">Sent</span>
                                </div>
                              ) : (
                                <div className="flex items-center text-status-success">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                  </svg>
                                  <span className="text-sm font-medium">Received</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between items-center py-3 border-b border-dark-700/30">
                            <div>
                              <p className="text-sm text-dark-400 mb-1">Payment Method</p>
                              <div className="flex items-center">
                                <div className="w-5 h-5 bg-accent-blue/20 rounded-full flex items-center justify-center mr-2">
                                  <svg className="w-3 h-3 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                  </svg>
                                </div>
                                <span className="text-dark-100 font-medium">
                                  {payment.method || 'Blockchain Transfer'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center py-3 border-b border-dark-700/30">
                            <div>
                              <p className="text-sm text-dark-400 mb-1">Network</p>
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse mr-2"></div>
                                <span className="text-dark-100 font-medium">Starling Network</span>
                              </div>
                            </div>
                          </div>

                          {payment.reference && (
                            <div className="flex justify-between items-center py-3">
                              <div>
                                <p className="text-sm text-dark-400 mb-1">Reference</p>
                                <p className="text-dark-100 font-medium font-mono">{payment.reference}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Timeline & Date */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-dark-100 text-display-lg mb-4 flex items-center">
                          <svg className="w-5 h-5 text-accent-green mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Timeline & Status
                        </h3>
                        
                        <div className="space-y-4">
                          <div className="bg-dark-800/20 rounded-lg p-4">
                            <p className="text-sm text-dark-400 mb-2">Transaction Date</p>
                            <p className="text-dark-100 font-semibold">
                              {new Date(payment.timestamp).toLocaleDateString('en-GB', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                            <p className="text-dark-400 text-sm mt-1">
                              {new Date(payment.timestamp).toLocaleTimeString('en-GB', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                              })}
                            </p>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 bg-status-success/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <svg className="w-4 h-4 text-status-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <p className="text-dark-100 font-medium">Payment Initiated</p>
                                <p className="text-dark-400 text-sm">
                                  {new Date(payment.timestamp).toLocaleString('en-GB')}
                                </p>
                              </div>
                            </div>

                            {payment.status !== 'failed' && (
                              <div className="flex items-start space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                                  payment.status === 'completed' ? 'bg-status-success/20' : 'bg-status-pending/20'
                                }`}>
                                  <svg className={`w-4 h-4 ${
                                    payment.status === 'completed' ? 'text-status-success' : 'text-status-pending animate-pulse'
                                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <p className="text-dark-100 font-medium">
                                    {payment.status === 'completed' ? 'Processing Complete' : 'Processing...'}
                                  </p>
                                  <p className="text-dark-400 text-sm">
                                    {payment.status === 'completed' 
                                      ? new Date(Date.now() - 30000).toLocaleString('en-GB')
                                      : 'Estimated completion in 2-3 minutes'
                                    }
                                  </p>
                                </div>
                              </div>
                            )}

                            {payment.status === 'completed' && (
                              <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-status-success/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                  <svg className="w-4 h-4 text-status-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <p className="text-dark-100 font-medium">Payment Delivered</p>
                                  <p className="text-dark-400 text-sm">
                                    {new Date(Date.now() - 10000).toLocaleString('en-GB')}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Redesigned Actions */}
                  <div className="border-t border-dark-600/30 pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button className="btn-secondary flex-1 flex items-center justify-center">
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Download Receipt</span>
                      </button>
                      <button className="btn-secondary flex-1 flex items-center justify-center">
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                        <span>Share Details</span>
                      </button>
                      {payment.status === 'pending' && (
                        <button className="btn-secondary text-status-error border-status-error/30 hover:bg-status-error/10 flex items-center justify-center">
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span>Cancel Payment</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
