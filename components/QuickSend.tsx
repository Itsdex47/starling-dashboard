'use client'

import { useState, useEffect } from 'react'
import { sendPayment } from '@/lib/api'

interface QuickSendProps {
  onPaymentSent: () => void
}

export default function QuickSend({ onPaymentSent }: QuickSendProps) {
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    currency: 'GBP',
    reference: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [exchangeRate, setExchangeRate] = useState<number | null>(null)

  const currencies = [
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' }
  ]

  useEffect(() => {
    if (formData.currency !== 'GBP' && formData.amount) {
      // Simulate fetching exchange rate
      setExchangeRate(Math.random() * 2 + 0.5)
    } else {
      setExchangeRate(null)
    }
  }, [formData.currency, formData.amount])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await sendPayment({
        recipient: formData.recipient,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        type: 'sent',
        reference: formData.reference
      })

      setSuccess(true)
      setFormData({
        recipient: '',
        amount: '',
        currency: 'GBP',
        reference: ''
      })

      setTimeout(() => {
        setSuccess(false)
        onPaymentSent()
      }, 2000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send payment')
    } finally {
      setLoading(false)
    }
  }

  const isValid = formData.recipient && formData.amount && parseFloat(formData.amount) > 0

  if (success) {
    return (
      <div className="glass-card p-6 text-center">
        <div className="w-16 h-16 bg-status-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-status-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-dark-100 mb-2">Payment Sent!</h3>
        <p className="text-dark-400 text-sm">
          Your payment to {formData.recipient} is being processed
        </p>
        <div className="mt-4 flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-status-success rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-status-success rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-status-success rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card">
      {/* Header */}
      <div className="px-6 py-4 border-b border-dark-600/30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-accent-green to-accent-blue rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-dark-100">Quick Send</h2>
            <p className="text-sm text-dark-400">Send money instantly worldwide</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="p-4 bg-status-error/10 border border-status-error/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-status-error flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-sm text-status-error font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Recipient */}
        <div>
          <label htmlFor="recipient" className="form-label">
            Recipient Email or Phone
          </label>
          <div className="relative">
            <input
              type="text"
              id="recipient"
              name="recipient"
              value={formData.recipient}
              onChange={handleInputChange}
              placeholder="john@example.com or +44 7700 900000"
              className="form-input"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <svg className="w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Amount and Currency */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="form-label">
              Amount
            </label>
            <div className="relative">
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                className="form-input"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <span className="text-dark-400 font-medium">£</span>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="currency" className="form-label">
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              className="form-select"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.flag} {currency.code}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Exchange Rate Info */}
        {exchangeRate && formData.amount && (
          <div className="p-4 bg-accent-blue/10 border border-accent-blue/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-300">Exchange Rate</span>
              <span className="text-sm font-medium text-accent-blue">
                1 GBP = {exchangeRate.toFixed(4)} {formData.currency}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-dark-300">Recipient Gets</span>
              <span className="text-sm font-bold text-dark-100">
                {(parseFloat(formData.amount) * exchangeRate).toFixed(2)} {formData.currency}
              </span>
            </div>
          </div>
        )}

        {/* Reference */}
        <div>
          <label htmlFor="reference" className="form-label">
            Reference <span className="text-dark-500">(Optional)</span>
          </label>
          <input
            type="text"
            id="reference"
            name="reference"
            value={formData.reference}
            onChange={handleInputChange}
            placeholder="Payment for services..."
            className="form-input"
            maxLength={100}
          />
        </div>

        {/* Fee Information */}
        <div className="p-4 bg-dark-800/30 rounded-lg border border-dark-600/30">
          <div className="flex items-center justify-between text-sm">
            <span className="text-dark-400">Transaction Fee</span>
            <span className="text-dark-200 font-medium">£0.00</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-dark-400">Exchange Fee</span>
            <span className="text-dark-200 font-medium">
              {formData.currency !== 'GBP' ? '0.5%' : 'Free'}
            </span>
          </div>
          <div className="border-t border-dark-600/30 mt-3 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-dark-300 font-medium">Total Cost</span>
              <span className="text-dark-100 font-bold">
                £{formData.amount ? parseFloat(formData.amount).toFixed(2) : '0.00'}
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isValid || loading}
          className="btn-primary w-full text-center"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Sending Payment...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <span>Send Payment</span>
            </div>
          )}
        </button>

        {/* Security Notice */}
        <div className="flex items-start space-x-2 p-3 bg-accent-gold/10 border border-accent-gold/20 rounded-lg">
          <svg className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <p className="text-xs text-accent-gold font-medium">Secure & Encrypted</p>
            <p className="text-xs text-dark-400">Your payment is protected by bank-grade security</p>
          </div>
        </div>
      </form>
    </div>
  )
}
