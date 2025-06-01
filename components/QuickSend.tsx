'use client'

import { useState } from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { sendDemoPayment } from '@/lib/api'

interface QuickSendProps {
  onPaymentSent: () => void
}

export default function QuickSend({ onPaymentSent }: QuickSendProps) {
  const [amount, setAmount] = useState('100')
  const [recipientName, setRecipientName] = useState('Maria Rodriguez')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const [firstName, ...lastNameParts] = recipientName.split(' ')
      const lastName = lastNameParts.join(' ') || 'Rodriguez'

      const response = await sendDemoPayment({
        amount: parseFloat(amount),
        recipientDetails: {
          firstName,
          lastName
        }
      })

      setSuccess(`Payment sent! Tracking ID: ${response.data.paymentId.substring(0, 8)}...`)
      setAmount('100')
      setRecipientName('Maria Rodriguez')
      onPaymentSent()
    } catch (err: any) {
      setError(err.message || 'Failed to send payment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center mb-6">
        <PaperAirplaneIcon className="h-6 w-6 text-starling-600" />
        <h2 className="ml-2 text-lg font-semibold text-gray-900">Quick Send</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount (USD)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-starling-500 focus:border-starling-500"
              placeholder="100"
              min="1"
              max="10000"
              step="0.01"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">
            Recipient Name
          </label>
          <input
            type="text"
            id="recipient"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-starling-500 focus:border-starling-500"
            placeholder="Maria Rodriguez"
            required
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Exchange Rate:</span>
            <span className="font-medium">1 USD = 18.50 MXN</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-600">Fee (1.5%):</span>
            <span className="font-medium">${(parseFloat(amount || '0') * 0.015).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mt-1 pt-1 border-t border-gray-200">
            <span className="text-gray-600">Recipient Gets:</span>
            <span className="font-semibold text-green-600">
              {((parseFloat(amount || '0') * 0.985) * 18.5).toFixed(2)} MXN
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Sending...
            </>
          ) : (
            <>
              <PaperAirplaneIcon className="h-4 w-4 mr-2" />
              Send Payment
            </>
          )}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500">
        <p>🌟 Demo mode - no real money will be transferred</p>
        <p>⚡ Powered by Solana blockchain</p>
      </div>
    </div>
  )
}
