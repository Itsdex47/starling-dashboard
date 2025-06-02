'use client'

import { useState } from 'react'
import { 
  QrCodeIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

export default function ReceivePaymentForm() {
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [description, setDescription] = useState('')
  const [paymentLink, setPaymentLink] = useState('')
  const [qrCodeData, setQrCodeData] = useState('')
  const [copied, setCopied] = useState(false)

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' }
  ]

  const generatePaymentRequest = () => {
    const requestId = Math.random().toString(36).substr(2, 9)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://starling-pay.com'
    const link = `${baseUrl}/pay/${requestId}?amount=${amount}&currency=${currency}&desc=${encodeURIComponent(description)}`
    
    setPaymentLink(link)
    setQrCodeData(link)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(paymentLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Request Payment</h3>
          <p className="text-gray-600">Create a payment request link or QR code to receive funds</p>
        </div>

        <div className="space-y-6">
          {/* Payment Request Form */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <div className="relative">
                <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-starling-500 focus:border-starling-500"
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-starling-500 focus:border-starling-500"
              >
                {currencies.map(curr => (
                  <option key={curr.code} value={curr.code}>
                    {curr.symbol} {curr.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-starling-500 focus:border-starling-500"
              placeholder="What is this payment for?"
              maxLength={100}
            />
          </div>

          <button
            onClick={generatePaymentRequest}
            disabled={!amount || parseFloat(amount) <= 0}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Payment Request
          </button>

          {/* Generated Payment Request */}
          {paymentLink && (
            <div className="border-t pt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Payment Request Generated</h4>
              
              <div className="space-y-4">
                {/* Payment Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Link
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={paymentLink}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-sm"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="px-4 py-2 bg-starling-600 text-white rounded-r-lg hover:bg-starling-700 transition-colors flex items-center"
                    >
                      {copied ? (
                        <CheckIcon className="h-4 w-4" />
                      ) : (
                        <ClipboardDocumentIcon className="h-4 w-4" />
                      )}
                      <span className="ml-1 text-sm">
                        {copied ? 'Copied!' : 'Copy'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* QR Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    QR Code
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                    <div className="w-32 h-32 bg-white border-2 border-dashed border-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <QrCodeIcon className="h-16 w-16 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">
                      QR code for: {currency} {amount}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {description || 'Payment request'}
                    </p>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-blue-900 mb-2">How to use this payment request:</h5>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Share the payment link with the sender</li>
                    <li>• Or have them scan the QR code with their phone</li>
                    <li>• They'll be directed to complete the payment</li>
                    <li>• You'll receive a notification when payment is complete</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 