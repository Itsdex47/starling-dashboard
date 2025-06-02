'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import SendPaymentForm from '@/components/SendPaymentForm'
import ReceivePaymentForm from '@/components/ReceivePaymentForm'
import PaymentHistory from '@/components/PaymentHistory'

const tabs = [
  { id: 'send', name: 'Send Payment', icon: '↗️' },
  { id: 'receive', name: 'Receive Payment', icon: '↙️' },
  { id: 'history', name: 'Transaction History', icon: '📊' }
]

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState('send')

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Organic background pattern */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-organic-pattern"></div>
        <div className="absolute inset-0 bg-topographic bg-topographic"></div>
      </div>
      
      <Header />
      
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-accent-purple/10 text-accent-purple text-sm font-medium rounded-full border border-accent-purple/20 mb-6">
            <div className="w-2 h-2 bg-accent-purple rounded-full mr-2 animate-pulse"></div>
            Payment Hub
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-gradient-purple">Comprehensive</span>
            <br />
            <span className="text-dark-100">Payment Solutions</span>
          </h1>
          <p className="text-xl text-dark-300 max-w-2xl mx-auto leading-relaxed">
            Send, receive, and track payments with advanced features designed for 
            modern cross-border transactions.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="glass-card p-2">
            <nav className="flex space-x-2" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-accent-purple to-accent-purple-light text-white shadow-glow-purple'
                      : 'text-dark-400 hover:text-dark-200'
                  } flex-1 py-3 px-4 text-center text-sm font-medium rounded-xl transition-all duration-200 flex items-center justify-center space-x-2`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'send' && (
            <div className="animate-float">
              <SendPaymentForm />
            </div>
          )}

          {activeTab === 'receive' && (
            <div className="animate-float">
              <ReceivePaymentForm />
            </div>
          )}

          {activeTab === 'history' && (
            <div className="animate-float">
              <PaymentHistory />
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="glass-card-hover p-6 text-center">
            <div className="w-12 h-12 bg-accent-green/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-dark-100 mb-2">Instant Transfers</h3>
            <p className="text-dark-400 text-sm">
              Send money across borders in seconds with real-time settlement.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-card-hover p-6 text-center">
            <div className="w-12 h-12 bg-accent-blue/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-dark-100 mb-2">Secure & Encrypted</h3>
            <p className="text-dark-400 text-sm">
              Military-grade encryption protects every transaction.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-card-hover p-6 text-center">
            <div className="w-12 h-12 bg-accent-gold/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-dark-100 mb-2">Low Fees</h3>
            <p className="text-dark-400 text-sm">
              Competitive rates with transparent pricing and no hidden costs.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="glass-card-hover p-6 text-center">
            <div className="w-12 h-12 bg-accent-purple/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-dark-100 mb-2">Global Reach</h3>
            <p className="text-dark-400 text-sm">
              Send to 156+ countries with local banking partnerships.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 glass-card p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-dark-100 mb-4">Trusted by Thousands</h2>
            <p className="text-dark-400">Join the growing community of satisfied users</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-green mb-2">$2.5B+</div>
              <div className="text-dark-400 text-sm">Total Volume</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-blue mb-2">156</div>
              <div className="text-dark-400 text-sm">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-gold mb-2">99.9%</div>
              <div className="text-dark-400 text-sm">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-purple mb-2">50K+</div>
              <div className="text-dark-400 text-sm">Active Users</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 