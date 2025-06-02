'use client'

import { useState } from 'react'
import { 
  CurrencyDollarIcon, 
  UserIcon, 
  GlobeAltIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface SendPaymentFormData {
  amount: string
  currency: string
  recipientName: string
  recipientEmail: string
  recipientPhone: string
  recipientAddress: string
  recipientCity: string
  recipientCountry: string
  recipientBankAccount: string
  recipientBankCode: string
  purpose: string
  reference: string
}

export default function SendPaymentForm() {
  const [formData, setFormData] = useState<SendPaymentFormData>({
    amount: '',
    currency: 'USD',
    recipientName: '',
    recipientEmail: '',
    recipientPhone: '',
    recipientAddress: '',
    recipientCity: '',
    recipientCountry: 'MX',
    recipientBankAccount: '',
    recipientBankCode: '',
    purpose: 'family_support',
    reference: ''
  })

  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [exchangeRate, setExchangeRate] = useState<any>(null)
  const [errors, setErrors] = useState<any>({})
  const [success, setSuccess] = useState('')

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' }
  ]

  const countries = [
    { code: 'MX', name: 'Mexico' },
    { code: 'CO', name: 'Colombia' },
    { code: 'PE', name: 'Peru' },
    { code: 'GT', name: 'Guatemala' }
  ]

  const purposes = [
    { value: 'family_support', label: 'Family Support' },
    { value: 'education', label: 'Education' },
    { value: 'medical', label: 'Medical Expenses' },
    { value: 'business', label: 'Business Transaction' },
    { value: 'other', label: 'Other' }
  ]

  const handleInputChange = (field: keyof SendPaymentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: null }))
    }
  }

  const validateStep1 = () => {
    const newErrors: any = {}
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount'
    }
    if (!formData.recipientName.trim()) {
      newErrors.recipientName = 'Recipient name is required'
    }
    if (!formData.recipientCountry) {
      newErrors.recipientCountry = 'Please select recipient country'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: any = {}
    
    if (!formData.recipientEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.recipientEmail = 'Please enter a valid email address'
    }
    if (!formData.recipientBankAccount.trim()) {
      newErrors.recipientBankAccount = 'Bank account number is required'
    }
    if (!formData.recipientBankCode.trim()) {
      newErrors.recipientBankCode = 'Bank code is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const fetchExchangeRate = async () => {
    try {
      // In real implementation, call Starling API
      const response = await fetch(`${process.env.NEXT_PUBLIC_STARLING_API_URL || 'http://localhost:3001'}/api/exchange-rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromCurrency: formData.currency,
          toCurrency: formData.recipientCountry === 'MX' ? 'MXN' : 'USD',
          amount: parseFloat(formData.amount)
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setExchangeRate(data)
      } else {
        // Fallback mock data
        setExchangeRate({
          rate: 18.5,
          fromAmount: parseFloat(formData.amount),
          toAmount: parseFloat(formData.amount) * 18.5,
          fees: { total: parseFloat(formData.amount) * 0.025 }
        })
      }
    } catch (error) {
      // Fallback mock data
      setExchangeRate({
        rate: 18.5,
        fromAmount: parseFloat(formData.amount),
        toAmount: parseFloat(formData.amount) * 18.5,
        fees: { total: parseFloat(formData.amount) * 0.025 }
      })
    }
  }

  const handleNext = async () => {
    if (step === 1 && validateStep1()) {
      setLoading(true)
      await fetchExchangeRate()
      setLoading(false)
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Call Starling remittance API
      const response = await fetch(`${process.env.NEXT_PUBLIC_STARLING_API_URL || 'http://localhost:3001'}/api/payments/send`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('starling_token') || 'demo_token'}`
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          exchangeRate: exchangeRate?.rate,
          expectedFees: exchangeRate?.fees
        })
      })

      if (response.ok) {
        const result = await response.json()
        setSuccess(`Payment initiated successfully! Transaction ID: ${result.transactionId}`)
        setStep(4)
      } else {
        const error = await response.json()
        setErrors({ submit: error.message || 'Payment failed' })
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Progress Steps */}
        <div className="bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum ? 'bg-starling-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {stepNum}
                </div>
                <span className={`ml-2 text-sm ${
                  step >= stepNum ? 'text-starling-600 font-medium' : 'text-gray-500'
                }`}>
                  {stepNum === 1 && 'Details'}
                  {stepNum === 2 && 'Recipient'}
                  {stepNum === 3 && 'Review'}
                  {stepNum === 4 && 'Complete'}
                </span>
                {stepNum < 4 && <div className="ml-4 w-8 h-0.5 bg-gray-300" />}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Payment Details */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Amount</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <div className="relative">
                      <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={formData.amount}
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                        className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-starling-500 focus:border-starling-500 ${
                          errors.amount ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                        min="1"
                        step="0.01"
                      />
                    </div>
                    {errors.amount && <p className="text-red-600 text-sm mt-1">{errors.amount}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
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
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recipient Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.recipientName}
                        onChange={(e) => handleInputChange('recipientName', e.target.value)}
                        className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-starling-500 focus:border-starling-500 ${
                          errors.recipientName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Maria Rodriguez"
                      />
                    </div>
                    {errors.recipientName && <p className="text-red-600 text-sm mt-1">{errors.recipientName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <div className="relative">
                      <GlobeAltIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        value={formData.recipientCountry}
                        onChange={(e) => handleInputChange('recipientCountry', e.target.value)}
                        className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-starling-500 focus:border-starling-500 ${
                          errors.recipientCountry ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        {countries.map(country => (
                          <option key={country.code} value={country.code}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.recipientCountry && <p className="text-red-600 text-sm mt-1">{errors.recipientCountry}</p>}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={loading}
                  className="btn-primary disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Continue'}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Recipient Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recipient Contact & Banking</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.recipientEmail}
                        onChange={(e) => handleInputChange('recipientEmail', e.target.value)}
                        className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-starling-500 focus:border-starling-500 ${
                          errors.recipientEmail ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="maria@example.com"
                      />
                      {errors.recipientEmail && <p className="text-red-600 text-sm mt-1">{errors.recipientEmail}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.recipientPhone}
                        onChange={(e) => handleInputChange('recipientPhone', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-starling-500 focus:border-starling-500"
                        placeholder="+52 1 234 567 8900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bank Account Number
                      </label>
                      <input
                        type="text"
                        value={formData.recipientBankAccount}
                        onChange={(e) => handleInputChange('recipientBankAccount', e.target.value)}
                        className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-starling-500 focus:border-starling-500 ${
                          errors.recipientBankAccount ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="1234567890"
                      />
                      {errors.recipientBankAccount && <p className="text-red-600 text-sm mt-1">{errors.recipientBankAccount}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bank Code / SWIFT
                      </label>
                      <input
                        type="text"
                        value={formData.recipientBankCode}
                        onChange={(e) => handleInputChange('recipientBankCode', e.target.value)}
                        className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-starling-500 focus:border-starling-500 ${
                          errors.recipientBankCode ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="BBVAMXMM"
                      />
                      {errors.recipientBankCode && <p className="text-red-600 text-sm mt-1">{errors.recipientBankCode}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Purpose of Transfer
                    </label>
                    <select
                      value={formData.purpose}
                      onChange={(e) => handleInputChange('purpose', e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-starling-500 focus:border-starling-500"
                    >
                      {purposes.map(purpose => (
                        <option key={purpose.value} value={purpose.value}>
                          {purpose.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reference (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.reference}
                      onChange={(e) => handleInputChange('reference', e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-starling-500 focus:border-starling-500"
                      placeholder="Payment for services"
                      maxLength={100}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="btn-secondary"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="btn-primary"
                >
                  Review Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Confirm */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Review Payment Details</h3>
                
                {/* Exchange Rate Info */}
                {exchangeRate && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="h-5 w-5 text-blue-600 mr-2" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900">
                          Exchange Rate: 1 {formData.currency} = {exchangeRate.rate} {formData.recipientCountry === 'MX' ? 'MXN' : 'USD'}
                        </p>
                        <div className="grid grid-cols-3 gap-4 mt-2 text-sm text-blue-800">
                          <div>
                            <span className="font-medium">You Send:</span><br />
                            {formData.currency} {exchangeRate.fromAmount}
                          </div>
                          <div>
                            <span className="font-medium">Fees:</span><br />
                            {formData.currency} {exchangeRate.fees.total.toFixed(2)}
                          </div>
                          <div>
                            <span className="font-medium">They Receive:</span><br />
                            {formData.recipientCountry === 'MX' ? 'MXN' : 'USD'} {exchangeRate.toAmount.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Summary */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Recipient:</span>
                      <p className="font-medium">{formData.recipientName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Country:</span>
                      <p className="font-medium">{countries.find(c => c.code === formData.recipientCountry)?.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Bank Account:</span>
                      <p className="font-medium font-mono">{formData.recipientBankAccount}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Bank Code:</span>
                      <p className="font-medium">{formData.recipientBankCode}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Purpose:</span>
                      <p className="font-medium">{purposes.find(p => p.value === formData.purpose)?.label}</p>
                    </div>
                    {formData.reference && (
                      <div>
                        <span className="text-gray-600">Reference:</span>
                        <p className="font-medium">{formData.reference}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <ShieldCheckIcon className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium">Security Notice</p>
                      <p>This payment will be processed securely through the Starling network. Please verify all details before confirming.</p>
                    </div>
                  </div>
                </div>
              </div>

              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
                    <p className="text-sm text-red-800">{errors.submit}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="btn-secondary"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Confirm & Send Payment'}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Sent Successfully!</h3>
              <p className="text-gray-600 mb-6">{success}</p>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setStep(1)
                    setFormData({
                      amount: '',
                      currency: 'USD',
                      recipientName: '',
                      recipientEmail: '',
                      recipientPhone: '',
                      recipientAddress: '',
                      recipientCity: '',
                      recipientCountry: 'MX',
                      recipientBankAccount: '',
                      recipientBankCode: '',
                      purpose: 'family_support',
                      reference: ''
                    })
                    setSuccess('')
                    setExchangeRate(null)
                  }}
                  className="btn-primary"
                >
                  Send Another Payment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 