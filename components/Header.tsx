'use client'

import { useState } from 'react'
import { 
  BellIcon, 
  CogIcon,
  UserCircleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'

export default function Header() {
  const [notifications] = useState(2)

  return (
    <header className="glass-card border-b border-dark-600/30 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-accent-green to-accent-blue rounded-xl flex items-center justify-center glow-green">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="ml-3 text-xl font-bold text-dark-100">
                  Starling Labs
                </span>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex ml-12 space-x-1">
              <a 
                href="/" 
                className="nav-link-active"
              >
                Dashboard
              </a>
              <a 
                href="/payments" 
                className="nav-link"
              >
                Payments
              </a>
              <a 
                href="#" 
                className="nav-link"
              >
                Analytics
              </a>
              <a 
                href="#" 
                className="nav-link"
              >
                API Docs
              </a>
            </nav>
            
            <div className="hidden lg:block ml-8">
              <span className="text-sm text-dark-400">
                Cross-Border Payment Infrastructure
              </span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Environment Badge */}
            <div className="hidden md:block">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent-gold/20 text-accent-gold border border-accent-gold/30">
                <div className="w-2 h-2 bg-accent-gold rounded-full mr-2 animate-pulse"></div>
                Demo Mode
              </span>
            </div>

            {/* Network Status */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1 bg-status-success/10 rounded-lg border border-status-success/20">
              <div className="w-2 h-2 bg-status-success rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-status-success">Network Online</span>
            </div>

            {/* Notifications */}
            <button className="btn-icon relative">
              <BellIcon className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-status-error text-white text-xs font-medium rounded-full flex items-center justify-center animate-pulse">
                  {notifications}
                </span>
              )}
            </button>

            {/* Settings */}
            <button className="btn-icon">
              <CogIcon className="h-5 w-5" />
            </button>

            {/* User Menu */}
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="flex items-center p-2 text-dark-300 hover:text-dark-100 rounded-lg hover:bg-dark-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-dark-600/50">
                  <UserCircleIcon className="h-6 w-6" />
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right glass-card border border-dark-600/30 focus:outline-none">
                  <div className="py-2">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={`${
                            active ? 'bg-dark-700/50 text-dark-100' : 'text-dark-300'
                          } group flex items-center px-4 py-2 text-sm transition-colors`}
                        >
                          <UserCircleIcon className="mr-3 h-4 w-4" />
                          Your Profile
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={`${
                            active ? 'bg-dark-700/50 text-dark-100' : 'text-dark-300'
                          } group flex items-center px-4 py-2 text-sm transition-colors`}
                        >
                          <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          API Documentation
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={`${
                            active ? 'bg-dark-700/50 text-dark-100' : 'text-dark-300'
                          } group flex items-center px-4 py-2 text-sm transition-colors`}
                        >
                          <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          Support
                        </a>
                      )}
                    </Menu.Item>
                    <div className="border-t border-dark-600/30 my-2"></div>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={`${
                            active ? 'bg-status-error/20 text-status-error' : 'text-dark-300'
                          } group flex items-center px-4 py-2 text-sm transition-colors`}
                        >
                          <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign out
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  )
}
