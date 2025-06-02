import Header from '@/components/Header'

export default function Settings() {
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
          <h1 className="text-3xl font-bold text-dark-100 mb-6">Settings</h1>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-dark-800/50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-dark-100 mb-3">Preferences</h2>
                <p className="text-dark-400 mb-4">Customize your dashboard experience.</p>
                <button className="btn-secondary">Configure</button>
              </div>
              <div className="bg-dark-800/50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-dark-100 mb-3">Security</h2>
                <p className="text-dark-400 mb-4">Manage your account security settings.</p>
                <button className="btn-secondary">Manage Security</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 