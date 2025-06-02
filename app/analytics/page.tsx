import Header from '@/components/Header'

export default function Analytics() {
  return (
    <div className="min-h-screen bg-dark-900">
      {/* Organic background pattern */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-organic-pattern"></div>
        <div className="absolute inset-0 bg-topographic bg-topographic"></div>
      </div>
      
      <Header />
      
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="glass-card p-8 text-center">
          <h1 className="text-3xl font-bold text-dark-100 mb-4">Analytics Dashboard</h1>
          <p className="text-dark-400">Advanced payment analytics and insights coming soon.</p>
        </div>
      </main>
    </div>
  )
} 