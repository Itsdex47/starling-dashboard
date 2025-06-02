import Header from '@/components/Header'

export default function Profile() {
  return (
    <div className="min-h-screen bg-dark-900">
      {/* Organic background pattern */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-organic-pattern"></div>
        <div className="absolute inset-0 bg-topographic bg-topographic"></div>
      </div>
      
      <Header />
      
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="glass-card p-8">
          <h1 className="text-3xl font-bold text-dark-100 mb-6">Your Profile</h1>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-accent-green/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-accent-green">U</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-dark-100">Demo User</h2>
                <p className="text-dark-400">demo@starlinglabs.com</p>
              </div>
            </div>
            <div className="bg-dark-800/50 p-4 rounded-lg">
              <p className="text-dark-300">Profile management features coming soon.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 