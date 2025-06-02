'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import SendPaymentForm from '@/components/SendPaymentForm'
import ReceivePaymentForm from '@/components/ReceivePaymentForm'
import PaymentHistory from '@/components/PaymentHistory'
import { 
  PaperAirplaneIcon, 
  ArrowDownTrayIcon,
  ClockIcon 
} from '@heroicons/react/24/outline'

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<'send' | 'receive' | 'history'>('send')

  const tabs = [
    { id: 'send', name: 'Send Payment', icon: PaperAirplaneIcon },
    { id: 'receive', name: 'Receive Payment', icon: ArrowDownTrayIcon },
    { id: 'history', name: 'Transaction History', icon: ClockIcon }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payments & Transfers
          </h1>
          <p className="text-gray-600">
            Send and receive international payments securely through the Starling network
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-starling-500 text-starling-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`mr-2 h-5 w-5 ${
                      activeTab === tab.id ? 'text-starling-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    {tab.name}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl">
          {activeTab === 'send' && <SendPaymentForm />}
          {activeTab === 'receive' && <ReceivePaymentForm />}
          {activeTab === 'history' && <PaymentHistory />}
        </div>
      </main>
    </div>
  )
} 