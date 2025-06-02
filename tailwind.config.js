/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme color palette
        dark: {
          900: '#0a0a0a',
          800: '#1a1a1a', 
          700: '#2a2a2a',
          600: '#3a3a3a',
          500: '#4a4a4a',
          400: '#6a6a6a',
          300: '#8a8a8a',
          200: '#aaaaaa',
          100: '#cccccc',
          50: '#f5f5f5',
        },
        // Sophisticated accent colors
        accent: {
          green: '#10b981',
          'green-light': '#34d399',
          gold: '#f59e0b',
          'gold-light': '#fbbf24',
          purple: '#8b5cf6',
          'purple-light': '#a78bfa',
          blue: '#3b82f6',
          'blue-light': '#60a5fa',
          coral: '#f97316',
          'coral-light': '#fb923c',
        },
        // Status colors for dark theme
        status: {
          success: '#10b981',
          warning: '#f59e0b', 
          error: '#ef4444',
          info: '#3b82f6',
          pending: '#8b5cf6',
        },
        // Glass morphism
        glass: {
          dark: 'rgba(42, 42, 42, 0.8)',
          darker: 'rgba(26, 26, 26, 0.9)',
          light: 'rgba(58, 58, 58, 0.6)',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'organic-pattern': `
          radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(245, 158, 11, 0.05) 0%, transparent 50%)
        `,
        'topographic': `
          linear-gradient(90deg, rgba(42, 42, 42, 0.05) 1px, transparent 1px),
          linear-gradient(rgba(42, 42, 42, 0.05) 1px, transparent 1px)
        `,
      },
      backgroundSize: {
        'topographic': '20px 20px',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-gold': '0 0 20px rgba(245, 158, 11, 0.3)',
        'elevated': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'elevated-lg': '0 35px 60px -12px rgba(0, 0, 0, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          from: { filter: 'drop-shadow(0 0 5px rgba(16, 185, 129, 0.3))' },
          to: { filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.6))' },
        }
      },
      fontFamily: {
        'heading': ['var(--font-space-grotesk)', 'sans-serif'],
        'display': ['var(--font-inter)', 'sans-serif'],
        'body': ['var(--font-inter)', 'sans-serif'],
        'mono': ['var(--font-jetbrains-mono)', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
    },
  },
  plugins: [],
}
