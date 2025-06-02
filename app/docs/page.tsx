import Header from '@/components/Header'

export default function Docs() {
  return (
    <div className="bg-dark-900">
      {/* Organic background pattern */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-organic-pattern"></div>
        <div className="absolute inset-0 bg-topographic bg-topographic"></div>
      </div>
      
      <Header />
      
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="glass-card p-8">
          <h1 className="text-3xl font-bold text-dark-100 mb-6">API Documentation</h1>
          <div className="space-y-4 text-dark-300">
            <p>Welcome to the Starling Labs Payment API documentation.</p>
            <div className="bg-dark-800/50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-dark-100 mb-2">Quick Start</h2>
              <p className="text-sm">Comprehensive API documentation coming soon.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 