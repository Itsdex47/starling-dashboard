'use client'

import { useState, Fragment } from 'react'
import { 
  QrCodeIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  CurrencyDollarIcon,
  ShareIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { Menu, Transition } from '@headlessui/react'
import QRCode from 'react-qr-code'

interface PaymentRequest {
  id: string
  amount: string
  currency: string
  description: string
  link: string
  qrCode: string
  createdAt: Date
}

export default function ReceivePaymentForm() {
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [description, setDescription] = useState('')
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<any>({})

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' }
  ]

  const incrementAmount = () => {
    const currentAmount = parseFloat(amount) || 0
    const newAmount = (currentAmount + 0.01).toFixed(2)
    setAmount(newAmount)
  }

  const decrementAmount = () => {
    const currentAmount = parseFloat(amount) || 0
    const newAmount = Math.max(0, currentAmount - 0.01).toFixed(2)
    setAmount(newAmount)
  }

  const validateForm = () => {
    const newErrors: any = {}
    
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount'
    }
    if (!currency) {
      newErrors.currency = 'Please select a currency'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const generatePaymentRequest = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const requestId = Math.random().toString(36).substr(2, 9).toUpperCase()
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://starling-pay.com'
      
      // Create a comprehensive payment URL with all necessary parameters
      const paymentParams = new URLSearchParams({
        id: requestId,
        amount: amount,
        currency: currency,
        description: description || '',
        recipient: 'Starling Dashboard User',
        type: 'payment_request',
        created: new Date().toISOString()
      })
      
      const link = `${baseUrl}/pay/${requestId}?${paymentParams.toString()}`
      
      const newRequest: PaymentRequest = {
        id: requestId,
        amount,
        currency,
        description,
        link,
        qrCode: link,
        createdAt: new Date()
      }
      
      setPaymentRequest(newRequest)
    } catch (error) {
      setErrors({ submit: 'Failed to generate payment request. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (!paymentRequest) return
    
    try {
      await navigator.clipboard.writeText(paymentRequest.link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const sharePaymentRequest = async () => {
    if (!paymentRequest) return
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Payment Request',
          text: `Please pay ${currency} ${amount}${description ? ` for ${description}` : ''}`,
          url: paymentRequest.link
        })
      } catch (error) {
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  const downloadQRCode = () => {
    if (!paymentRequest) return
    
    // Create a canvas to download the QR code
    const svg = document.querySelector('#payment-qr-code')
    if (!svg) return
    
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const data = new XMLSerializer().serializeToString(svg)
    const DOMURL = window.URL || window.webkitURL || window
    
    const img = new Image()
    const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' })
    const url = DOMURL.createObjectURL(svgBlob)
    
    img.onload = () => {
      canvas.width = 400
      canvas.height = 400
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, 400, 400)
      ctx.drawImage(img, 0, 0, 400, 400)
      DOMURL.revokeObjectURL(url)
      
      const imgURI = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
      const evt = new MouseEvent('click', {
        view: window,
        bubbles: false,
        cancelable: true
      })
      
      const a = document.createElement('a')
      a.setAttribute('download', `payment-request-${paymentRequest.id}.png`)
      a.setAttribute('href', imgURI)
      a.setAttribute('target', '_blank')
      a.dispatchEvent(evt)
    }
    
    img.src = url
  }

  const selectedCurrency = currencies.find(c => c.code === currency)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 backdrop-blur-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6 rounded-t-2xl">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
              <QrCodeIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Request Payment</h3>
              <p className="text-gray-600 mt-1">Generate a secure payment link or QR code to receive funds</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {!paymentRequest ? (
            /* Payment Request Form */
            <div className="space-y-8">
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 text-blue-600 mr-3" />
                  Payment Details
                </h4>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Amount
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-500 font-medium">{selectedCurrency?.symbol}</span>
                      </div>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className={`block w-full pl-10 pr-10 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 ${
                          errors.amount ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-gray-50/30'
                        } text-lg font-medium text-gray-900 number-display [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                        placeholder="0.00"
                        min="0.01"
                        step="0.01"
                      />
                      <div className="absolute inset-y-0 right-0 flex flex-col">
                        <button
                          type="button"
                          onClick={incrementAmount}
                          className="flex-1 px-3 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors group"
                        >
                          <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={decrementAmount}
                          className="flex-1 px-3 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors group"
                        >
                          <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {errors.amount && <p className="text-red-600 text-sm mt-2 font-medium">{errors.amount}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Currency
                    </label>
                    <Menu as="div" className="relative">
                      {({ open }) => (
                        <>
                          <Menu.Button className={`w-full flex items-center justify-between px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 ${
                            errors.currency ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-gray-50/30'
                          }`}>
                            <span className="flex items-center text-lg font-medium text-gray-900">
                              <span className="mr-3 text-xl">{selectedCurrency?.flag}</span>
                              <span className="mr-2">{selectedCurrency?.symbol}</span>
                              <span>{selectedCurrency?.code}</span>
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
                            <Menu.Items className="absolute z-[100] mt-2 w-full bg-white rounded-xl border border-gray-200 shadow-xl backdrop-blur-sm focus:outline-none max-h-60 overflow-y-auto">
                              <div className="py-2">
                                {currencies.map((curr) => (
                                  <Menu.Item key={curr.code}>
                                    {({ active }) => (
                                      <button
                                        type="button"
                                        onClick={() => setCurrency(curr.code)}
                                        className={`${
                                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                        } group flex items-center w-full px-4 py-3 text-sm transition-colors ${
                                          currency === curr.code ? 'text-blue-600 bg-blue-50' : ''
                                        }`}
                                      >
                                        <span className="mr-3 text-lg">{curr.flag}</span>
                                        <span className="mr-2 font-medium">{curr.symbol}</span>
                                        <span className="mr-2 font-medium">{curr.code}</span>
                                        <span className="text-gray-500">{curr.name}</span>
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
                    {errors.currency && <p className="text-red-600 text-sm mt-2 font-medium">{errors.currency}</p>}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="block w-full px-4 py-3 border-2 border-gray-200 bg-gray-50/30 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 text-lg text-gray-900"
                  placeholder="What is this payment for?"
                  maxLength={100}
                />
                <p className="text-gray-500 text-xs mt-1">{description.length}/100 characters</p>
              </div>

              {errors.submit && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6">
                  <div className="flex items-start">
                    <svg className="h-6 w-6 text-red-600 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="text-lg font-bold text-red-900 mb-2">Error</h4>
                      <p className="text-red-800">{errors.submit}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={generatePaymentRequest}
                disabled={loading}
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating Request...</span>
                  </>
                ) : (
                  <>
                    <QrCodeIcon className="h-5 w-5" />
                    <span>Generate Payment Request</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Generated Payment Request */
            <div className="space-y-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckIcon className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">Payment Request Generated!</h4>
                <p className="text-gray-600">Share this request to receive your payment</p>
              </div>

              {/* Request Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6">
                <div className="text-center">
                  <div className="number-3xl font-bold text-blue-900 mb-2">
                    {selectedCurrency?.symbol}{amount} {currency}
                  </div>
                  {description && (
                    <p className="text-blue-800 font-medium">{description}</p>
                  )}
                  <p className="text-blue-700 text-sm mt-2">
                    Request ID: {paymentRequest.id}
                  </p>
                </div>
              </div>

              {/* Payment Link */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Payment Link
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={paymentRequest.link}
                    readOnly
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-l-xl bg-gray-50/50 text-sm font-mono text-gray-700"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-r-xl hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                  >
                    {copied ? (
                      <CheckIcon className="h-4 w-4" />
                    ) : (
                      <ClipboardDocumentIcon className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">
                      {copied ? 'Copied!' : 'Copy'}
                    </span>
                  </button>
                </div>
              </div>

              {/* QR Code */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  QR Code
                </label>
                <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-8">
                  <div className="text-center">
                    <div className="w-64 h-64 bg-white border-2 border-gray-200 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg p-4">
                      <QRCode 
                        id="payment-qr-code"
                        value={paymentRequest.link}
                        size={200}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        viewBox={`0 0 256 256`}
                        fgColor="#1f2937"
                        bgColor="#ffffff"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-900 font-semibold text-lg">
                        Scan to pay <span className="number-lg">{selectedCurrency?.symbol}{amount} {currency}</span>
                      </p>
                      {description && (
                        <p className="text-gray-600 text-base">{description}</p>
                      )}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                        <p className="text-blue-800 text-sm font-medium">
                          💡 Point your camera or QR scanner at this code to open the payment link
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={sharePaymentRequest}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <ShareIcon className="h-5 w-5" />
                  <span>Share</span>
                </button>
                <button
                  onClick={downloadQRCode}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download</span>
                </button>
                <button
                  onClick={() => {
                    setPaymentRequest(null)
                    setAmount('')
                    setDescription('')
                    setErrors({})
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>New Request</span>
                </button>
              </div>

              {/* Instructions */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6">
                <h5 className="text-lg font-bold text-yellow-900 mb-3 flex items-center">
                  <svg className="h-5 w-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  How to use this payment request:
                </h5>
                <div className="space-y-2 text-yellow-800">
                  <div className="flex items-start">
                    <span className="w-6 h-6 bg-yellow-200 text-yellow-900 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                    <p className="text-sm">Share the payment link or QR code with the sender</p>
                  </div>
                  <div className="flex items-start">
                    <span className="w-6 h-6 bg-yellow-200 text-yellow-900 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
                    <p className="text-sm">They'll be directed to a secure payment page</p>
                  </div>
                  <div className="flex items-start">
                    <span className="w-6 h-6 bg-yellow-200 text-yellow-900 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
                    <p className="text-sm">You'll receive instant notification when payment is complete</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 