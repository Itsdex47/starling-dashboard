'use client'

import { useState, Fragment } from 'react'
import { 
  CurrencyDollarIcon, 
  UserIcon, 
  GlobeAltIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { Menu, Transition } from '@headlessui/react'

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
    { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' }
  ]

  const countries = [
    { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
    { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
    { code: 'PE', name: 'Peru', flag: '🇵🇪' },
    { code: 'GT', name: 'Guatemala', flag: '🇬🇹' },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
    { code: 'AR', name: 'Argentina', flag: '🇦🇷' }
  ]

  const purposes = [
    { value: 'family_support', label: 'Family Support', icon: '👨‍👩‍👧‍👦' },
    { value: 'education', label: 'Education', icon: '🎓' },
    { value: 'medical', label: 'Medical Expenses', icon: '🏥' },
    { value: 'business', label: 'Business Transaction', icon: '💼' },
    { value: 'investment', label: 'Investment', icon: '📈' },
    { value: 'other', label: 'Other', icon: '📋' }
  ]

  const handleInputChange = (field: keyof SendPaymentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: null }))
    }
  }

  const incrementAmount = () => {
    const currentAmount = parseFloat(formData.amount) || 0
    const newAmount = (currentAmount + 0.01).toFixed(2)
    handleInputChange('amount', newAmount)
  }

  const decrementAmount = () => {
    const currentAmount = parseFloat(formData.amount) || 0
    const newAmount = Math.max(0, currentAmount - 0.01).toFixed(2)
    handleInputChange('amount', newAmount)
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setExchangeRate({
        rate: 18.5,
        fromAmount: parseFloat(formData.amount),
        toAmount: parseFloat(formData.amount) * 18.5,
        fees: { total: parseFloat(formData.amount) * 0.025 }
      })
    } catch (error) {
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSuccess('Payment initiated successfully! Transaction ID: TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase())
      setStep(4)
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const selectedCurrency = currencies.find(c => c.code === formData.currency)
  const selectedCountry = countries.find(c => c.code === formData.recipientCountry)
  const selectedPurpose = purposes.find(p => p.value === formData.purpose)

  const steps = [
    { number: 1, title: 'Payment Details' },
    { number: 2, title: 'Recipient Info' },
    { number: 3, title: 'Review & Confirm' },
    { number: 4, title: 'Complete' }
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 backdrop-blur-sm">
        {/* Progress Steps - Fixed Layout */}
        <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-6 py-8 rounded-t-2xl">
          <div className="flex justify-between items-start relative">
            {steps.map((stepItem, index) => (
              <div key={stepItem.number} className="flex flex-col items-center flex-1 relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                  step >= stepItem.number 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {stepItem.number}
                </div>
                <div className="mt-3 text-center">
                  <span className={`text-sm font-medium transition-colors block ${
                    step >= stepItem.number ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {stepItem.title}
                  </span>
                </div>
              </div>
            ))}
            
            {/* Progress Lines */}
            <div className="absolute top-5 left-0 right-0 flex justify-between items-center px-[12.5%]">
              {steps.slice(0, -1).map((_, index) => (
                <div 
                  key={index}
                  className={`h-0.5 flex-1 transition-all duration-300 ${
                    step > index + 1 ? 'bg-blue-500' : 'bg-gray-200'
                  }`} 
                />
              ))}
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Step 1: Payment Details */}
          {step === 1 && (
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <CurrencyDollarIcon className="h-6 w-6 text-blue-600 mr-3" />
                  Payment Amount
                </h3>
                
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
                        value={formData.amount}
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                        className={`block w-full pl-10 pr-10 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 ${
                          errors.amount ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-gray-50/30'
                        } text-lg font-medium text-gray-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                        placeholder="0.00"
                        min="1"
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
                          <Menu.Button className="w-full flex items-center justify-between px-4 py-3 border-2 border-gray-200 bg-gray-50/30 rounded-xl hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200">
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
                                {currencies.map((currency) => (
                                  <Menu.Item key={currency.code}>
                                    {({ active }) => (
                                      <button
                                        type="button"
                                        onClick={() => handleInputChange('currency', currency.code)}
                                        className={`${
                                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                        } group flex items-center w-full px-4 py-3 text-sm transition-colors ${
                                          formData.currency === currency.code ? 'text-blue-600 bg-blue-50' : ''
                                        }`}
                                      >
                                        <span className="mr-3 text-lg">{currency.flag}</span>
                                        <span className="mr-2 font-medium">{currency.symbol}</span>
                                        <span className="mr-2 font-medium">{currency.code}</span>
                                        <span className="text-gray-500">{currency.name}</span>
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
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <UserIcon className="h-6 w-6 text-blue-600 mr-3" />
                  Recipient Information
                </h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.recipientName}
                      onChange={(e) => handleInputChange('recipientName', e.target.value)}
                      className={`block w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 ${
                        errors.recipientName ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-gray-50/30'
                      } text-lg text-gray-900`}
                      placeholder="Maria Rodriguez"
                    />
                    {errors.recipientName && <p className="text-red-600 text-sm mt-2 font-medium">{errors.recipientName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Country
                    </label>
                    <Menu as="div" className="relative">
                      {({ open }) => (
                        <>
                          <Menu.Button className={`w-full flex items-center justify-between px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 ${
                            errors.recipientCountry ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-gray-50/30'
                          }`}>
                            <span className="flex items-center text-lg font-medium text-gray-900">
                              <span className="mr-3 text-xl">{selectedCountry?.flag}</span>
                              <span>{selectedCountry?.name}</span>
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
                                {countries.map((country) => (
                                  <Menu.Item key={country.code}>
                                    {({ active }) => (
                                      <button
                                        type="button"
                                        onClick={() => handleInputChange('recipientCountry', country.code)}
                                        className={`${
                                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                        } group flex items-center w-full px-4 py-3 text-sm transition-colors ${
                                          formData.recipientCountry === country.code ? 'text-blue-600 bg-blue-50' : ''
                                        }`}
                                      >
                                        <span className="mr-3 text-lg">{country.flag}</span>
                                        <span className="font-medium">{country.name}</span>
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
                    {errors.recipientCountry && <p className="text-red-600 text-sm mt-2 font-medium">{errors.recipientCountry}</p>}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <span>Continue</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Recipient Details */}
          {step === 2 && (
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="h-6 w-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact & Banking Details
                </h3>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.recipientEmail}
                        onChange={(e) => handleInputChange('recipientEmail', e.target.value)}
                        className={`block w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 ${
                          errors.recipientEmail ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-gray-50/30'
                        } text-lg text-gray-900`}
                        placeholder="maria@example.com"
                      />
                      {errors.recipientEmail && <p className="text-red-600 text-sm mt-2 font-medium">{errors.recipientEmail}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.recipientPhone}
                        onChange={(e) => handleInputChange('recipientPhone', e.target.value)}
                        className="block w-full px-4 py-3 border-2 border-gray-200 bg-gray-50/30 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 text-lg text-gray-900"
                        placeholder="+52 1 234 567 8900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Bank Account Number
                      </label>
                      <input
                        type="text"
                        value={formData.recipientBankAccount}
                        onChange={(e) => handleInputChange('recipientBankAccount', e.target.value)}
                        className={`block w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 ${
                          errors.recipientBankAccount ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-gray-50/30'
                        } text-lg font-mono text-gray-900`}
                        placeholder="1234567890"
                      />
                      {errors.recipientBankAccount && <p className="text-red-600 text-sm mt-2 font-medium">{errors.recipientBankAccount}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Bank Code / SWIFT
                      </label>
                      <input
                        type="text"
                        value={formData.recipientBankCode}
                        onChange={(e) => handleInputChange('recipientBankCode', e.target.value)}
                        className={`block w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 ${
                          errors.recipientBankCode ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-gray-50/30'
                        } text-lg font-mono text-gray-900`}
                        placeholder="BBVAMXMM"
                      />
                      {errors.recipientBankCode && <p className="text-red-600 text-sm mt-2 font-medium">{errors.recipientBankCode}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Purpose of Transfer
                    </label>
                    <Menu as="div" className="relative">
                      {({ open }) => (
                        <>
                          <Menu.Button className="w-full flex items-center justify-between px-4 py-3 border-2 border-gray-200 bg-gray-50/30 rounded-xl hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200">
                            <span className="flex items-center text-lg font-medium text-gray-900">
                              <span className="mr-3 text-xl">{selectedPurpose?.icon}</span>
                              <span>{selectedPurpose?.label}</span>
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
                                {purposes.map((purpose) => (
                                  <Menu.Item key={purpose.value}>
                                    {({ active }) => (
                                      <button
                                        type="button"
                                        onClick={() => handleInputChange('purpose', purpose.value)}
                                        className={`${
                                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                        } group flex items-center w-full px-4 py-3 text-sm transition-colors ${
                                          formData.purpose === purpose.value ? 'text-blue-600 bg-blue-50' : ''
                                        }`}
                                      >
                                        <span className="mr-3 text-lg">{purpose.icon}</span>
                                        <span className="font-medium">{purpose.label}</span>
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

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Reference <span className="text-gray-500 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.reference}
                      onChange={(e) => handleInputChange('reference', e.target.value)}
                      className="block w-full px-4 py-3 border-2 border-gray-200 bg-gray-50/30 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 text-lg text-gray-900"
                      placeholder="Payment for services"
                      maxLength={100}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Review Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Confirm */}
          {step === 3 && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="h-5 w-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Review & Confirm Transfer
                </h3>
                
                {/* Exchange Rate & Cost Breakdown */}
                {exchangeRate && (
                  <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                          <CurrencyDollarIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-blue-900">Live Exchange Rate</h4>
                          <p className="text-blue-700 text-xs">Updated 2 minutes ago • Rate guaranteed for 30 minutes</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-bold text-blue-900">
                          1 {formData.currency} = {exchangeRate.rate.toFixed(4)} {formData.recipientCountry === 'MX' ? 'MXN' : 'USD'}
                        </div>
                        <div className="text-xs text-blue-700">Mid-market rate • No markup</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center">
                        <div className="text-xs font-medium text-blue-700 mb-1">You Send</div>
                        <div className="text-xl font-bold text-blue-900 mb-1">
                          {selectedCurrency?.symbol}{exchangeRate.fromAmount.toFixed(2)}
                        </div>
                        <div className="text-xs text-blue-600">{formData.currency}</div>
                      </div>
                      
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center">
                        <div className="text-xs font-medium text-blue-700 mb-1">Transfer Fee</div>
                        <div className="text-xl font-bold text-blue-900 mb-1">
                          {selectedCurrency?.symbol}{exchangeRate.fees.total.toFixed(2)}
                        </div>
                        <div className="text-xs text-blue-600">2.5% • Transparent pricing</div>
                      </div>
                      
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center">
                        <div className="text-xs font-medium text-blue-700 mb-1">Total Cost</div>
                        <div className="text-xl font-bold text-red-700 mb-1">
                          {selectedCurrency?.symbol}{(exchangeRate.fromAmount + exchangeRate.fees.total).toFixed(2)}
                        </div>
                        <div className="text-xs text-blue-600">Debited from account</div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 text-center border-2 border-green-200">
                        <div className="text-xs font-medium text-green-700 mb-1">Recipient Gets</div>
                        <div className="text-xl font-bold text-green-800 mb-1">
                          {formData.recipientCountry === 'MX' ? '$' : '$'}{exchangeRate.toAmount.toFixed(2)}
                        </div>
                        <div className="text-xs text-green-600">{formData.recipientCountry === 'MX' ? 'MXN' : 'USD'} • Guaranteed</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                      <div className="bg-white/60 rounded-lg p-3">
                        <div className="text-base font-bold text-blue-900">2-5 minutes</div>
                        <div className="text-xs text-blue-700">Typical delivery time</div>
                      </div>
                      <div className="bg-white/60 rounded-lg p-3">
                        <div className="text-base font-bold text-blue-900">50% cheaper</div>
                        <div className="text-xs text-blue-700">vs traditional banks</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recipient & Transaction Details */}
                <div className="bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-6 mb-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="h-5 w-5 text-gray-700 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Recipient & Transaction Details
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="bg-white rounded-xl p-3 border border-gray-200">
                        <div className="text-xs font-medium text-gray-600 mb-1">Recipient Name</div>
                        <div className="text-base font-bold text-gray-900">{formData.recipientName}</div>
                      </div>
                      
                      <div className="bg-white rounded-xl p-3 border border-gray-200">
                        <div className="text-xs font-medium text-gray-600 mb-1">Destination Country</div>
                        <div className="text-base font-bold text-gray-900 flex items-center">
                          <span className="mr-2 text-lg">{selectedCountry?.flag}</span>
                          {selectedCountry?.name}
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl p-3 border border-gray-200">
                        <div className="text-xs font-medium text-gray-600 mb-1">Transfer Purpose</div>
                        <div className="text-base font-bold text-gray-900 flex items-center">
                          <span className="mr-2 text-base">{selectedPurpose?.icon}</span>
                          {selectedPurpose?.label}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-white rounded-xl p-3 border border-gray-200">
                        <div className="text-xs font-medium text-gray-600 mb-1">Bank Account</div>
                        <div className="text-base font-bold text-gray-900 font-mono">
                          ****{formData.recipientBankAccount.slice(-4)}
                        </div>
                        <div className="text-xs text-green-600 flex items-center mt-1">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Account verified
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl p-3 border border-gray-200">
                        <div className="text-xs font-medium text-gray-600 mb-1">Bank Code</div>
                        <div className="text-base font-bold text-gray-900 font-mono">{formData.recipientBankCode}</div>
                        <div className="text-xs text-green-600 flex items-center mt-1">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          SWIFT verified
                        </div>
                      </div>
                      
                      {formData.reference && (
                        <div className="bg-white rounded-xl p-3 border border-gray-200">
                          <div className="text-xs font-medium text-gray-600 mb-1">Reference Note</div>
                          <div className="text-base font-bold text-gray-900">{formData.reference}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Security & Compliance Information */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
                      <ShieldCheckIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-green-900">Security & Protection</h4>
                      <p className="text-green-700 text-sm">Your transfer is fully protected and regulated</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h5 className="font-semibold text-base text-green-900 mb-2">Bank-Level Security</h5>
                      <p className="text-xs text-green-700">256-bit SSL encryption protects all transactions</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <h5 className="font-semibold text-base text-green-900 mb-2">Regulatory Compliance</h5>
                      <p className="text-xs text-green-700">Licensed & regulated in 156 countries worldwide</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <h5 className="font-semibold text-base text-green-900 mb-2">Money Protection</h5>
                      <p className="text-xs text-green-700">Funds protected up to $500,000 FDIC insurance</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-white/60 rounded-lg p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-700">Transaction ID:</span>
                      <span className="font-mono font-semibold text-green-900 text-xs">TXN-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                {/* What Happens Next */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                    <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    What Happens Next
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-blue-200 text-blue-900 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-1">1</div>
                      <div>
                        <h5 className="font-semibold text-base text-blue-900 mb-1">Instant Processing</h5>
                        <p className="text-blue-700 text-sm">Your transfer begins processing immediately after confirmation</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-blue-200 text-blue-900 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-1">2</div>
                      <div>
                        <h5 className="font-semibold text-base text-blue-900 mb-1">Real-time Tracking</h5>
                        <p className="text-blue-700 text-sm">Track progress via SMS, email, and dashboard notifications</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-blue-200 text-blue-900 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-1">3</div>
                      <div>
                        <h5 className="font-semibold text-base text-blue-900 mb-1">Delivery Confirmation</h5>
                        <p className="text-blue-700 text-sm">Both you and {formData.recipientName} receive confirmation when funds arrive</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {errors.submit && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6">
                  <div className="flex items-start">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-lg font-bold text-red-900 mb-2">Transaction Error</h4>
                      <p className="text-red-800">{errors.submit}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  Back to Edit
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 text-lg"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing Transfer...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheckIcon className="h-6 w-6" />
                      <span>Confirm & Send {selectedCurrency?.symbol}{(exchangeRate?.fromAmount + exchangeRate?.fees.total).toFixed(2)}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheckIcon className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Payment Sent Successfully!</h3>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 mb-8 mx-auto max-w-md">
                <p className="text-green-800 font-medium">{success}</p>
              </div>
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
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Send Another Payment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 