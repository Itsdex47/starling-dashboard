'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  BellIcon, 
  CogIcon,
  UserCircleIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  ChartBarIcon,
  LifebuoyIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'

export default function Header() {
  const [notifications] = useState(2)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logging out...')
    // For now, just redirect to login page
    router.push('/login')
  }

  const isActivePath = (path: string) => {
    return pathname === path
  }

  return (
    <header className="glass-card border-b border-dark-600/30 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <button 
                onClick={() => handleNavigation('/')}
                className="flex items-center hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-accent-green to-accent-blue rounded-xl flex items-center justify-center glow-green">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="ml-3 text-xl font-bold text-dark-100 whitespace-nowrap">
                  Starling Labs
                </span>
              </button>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <button 
                onClick={() => handleNavigation('/')}
                className={isActivePath('/') ? 'nav-link-active' : 'nav-link'}
              >
                Dashboard
              </button>
              <button 
                onClick={() => handleNavigation('/payments')}
                className={isActivePath('/payments') ? 'nav-link-active' : 'nav-link'}
              >
                Payments
              </button>
              <button 
                onClick={() => handleNavigation('/analytics')}
                className={isActivePath('/analytics') ? 'nav-link-active' : 'nav-link'}
              >
                Analytics
              </button>
              <button 
                onClick={() => handleNavigation('/docs')}
                className={isActivePath('/docs') ? 'nav-link-active' : 'nav-link'}
              >
                API Docs
              </button>
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Environment Badge */}
            <div className="hidden md:block">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent-gold/20 text-accent-gold border border-accent-gold/30 whitespace-nowrap">
                <div className="w-2 h-2 bg-accent-gold rounded-full mr-2 animate-pulse"></div>
                Demo Mode
              </span>
            </div>

            {/* Network Status */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1 bg-status-success/10 rounded-lg border border-status-success/20 whitespace-nowrap">
              <div className="w-2 h-2 bg-status-success rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-status-success">Network Online</span>
            </div>

            {/* Notifications */}
            <Menu as="div" className="relative">
              <Menu.Button 
                className="btn-icon relative"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <BellIcon className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-status-error text-white text-xs font-medium rounded-full flex items-center justify-center animate-pulse">
                    {notifications}
                  </span>
                )}
              </Menu.Button>

              <Transition
                as={Fragment}
                show={notificationsOpen}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items 
                  static
                  className="absolute right-0 z-10 mt-2 w-80 origin-top-right glass-card border border-dark-600/30 focus:outline-none"
                >
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-dark-600/30">
                      <h3 className="text-sm font-medium text-dark-100">Notifications</h3>
                    </div>
                    <Menu.Item>
                      {({ active }) => (
                        <div className={`${active ? 'bg-dark-700/50' : ''} px-4 py-3 cursor-pointer`}>
                          <p className="text-sm text-dark-100">Payment received</p>
                          <p className="text-xs text-dark-400">£1,500 from Alice Johnson</p>
                          <p className="text-xs text-accent-gold mt-1">2 minutes ago</p>
                        </div>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <div className={`${active ? 'bg-dark-700/50' : ''} px-4 py-3 cursor-pointer`}>
                          <p className="text-sm text-dark-100">Transaction failed</p>
                          <p className="text-xs text-dark-400">Payment to Tech Store declined</p>
                          <p className="text-xs text-status-error mt-1">1 hour ago</p>
                        </div>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            {/* Settings */}
            <Menu as="div" className="relative">
              <Menu.Button 
                className="btn-icon"
                onClick={() => setSettingsOpen(!settingsOpen)}
              >
                <CogIcon className="h-5 w-5" />
              </Menu.Button>

              <Transition
                as={Fragment}
                show={settingsOpen}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items 
                  static
                  className="absolute right-0 z-10 mt-2 w-56 origin-top-right glass-card border border-dark-600/30 focus:outline-none"
                >
                  <div className="py-2">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => handleNavigation('/settings')}
                          className={`${
                            active ? 'bg-dark-700/50 text-dark-100' : 'text-dark-300'
                          } group flex items-center w-full px-4 py-2 text-sm transition-colors`}
                        >
                          <CogIcon className="mr-3 h-4 w-4" />
                          Preferences
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => handleNavigation('/settings/security')}
                          className={`${
                            active ? 'bg-dark-700/50 text-dark-100' : 'text-dark-300'
                          } group flex items-center w-full px-4 py-2 text-sm transition-colors`}
                        >
                          <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Security
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            {/* User Menu */}
            <Menu as="div" className="relative inline-block text-left">
              {({ open }) => (
                <>
                  <div>
                    <Menu.Button className="flex items-center p-2 text-dark-300 hover:text-dark-100 rounded-lg hover:bg-dark-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-dark-600/50">
                      <UserCircleIcon className="h-6 w-6" />
                      <ChevronDownIcon className={`ml-1 h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
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
                            <button
                              onClick={() => handleNavigation('/profile')}
                              className={`${
                                active ? 'bg-dark-700/50 text-dark-100' : 'text-dark-300'
                              } group flex items-center w-full px-4 py-2 text-sm transition-colors`}
                            >
                              <UserCircleIcon className="mr-3 h-4 w-4" />
                              Your Profile
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleNavigation('/docs')}
                              className={`${
                                active ? 'bg-dark-700/50 text-dark-100' : 'text-dark-300'
                              } group flex items-center w-full px-4 py-2 text-sm transition-colors`}
                            >
                              <DocumentTextIcon className="mr-3 h-4 w-4" />
                              API Documentation
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleNavigation('/analytics')}
                              className={`${
                                active ? 'bg-dark-700/50 text-dark-100' : 'text-dark-300'
                              } group flex items-center w-full px-4 py-2 text-sm transition-colors`}
                            >
                              <ChartBarIcon className="mr-3 h-4 w-4" />
                              Analytics
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleNavigation('/support')}
                              className={`${
                                active ? 'bg-dark-700/50 text-dark-100' : 'text-dark-300'
                              } group flex items-center w-full px-4 py-2 text-sm transition-colors`}
                            >
                              <LifebuoyIcon className="mr-3 h-4 w-4" />
                              Support
                            </button>
                          )}
                        </Menu.Item>
                        <div className="border-t border-dark-600/30 my-2"></div>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`${
                                active ? 'bg-status-error/20 text-status-error' : 'text-dark-300'
                              } group flex items-center w-full px-4 py-2 text-sm transition-colors`}
                            >
                              <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>
          </div>
        </div>
      </div>
    </header>
  )
}
