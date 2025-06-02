'use client'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Security Policy', href: '/security' },
    { name: 'Compliance', href: '/compliance' },
    { name: 'API Documentation', href: '/docs' },
    { name: 'Developer Portal', href: '/developers' },
    { name: 'Support Center', href: '/support' },
    { name: 'Contact Us', href: '/contact' }
  ]

  const socialLinks = [
    { name: 'Twitter', href: 'https://twitter.com/starlingpay' },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/starlingpay' },
    { name: 'GitHub', href: 'https://github.com/starlingpay' },
    { name: 'Discord', href: 'https://discord.gg/starlingpay' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' }
  ]

  return (
    <footer className="bg-dark-900 border-t border-dark-600/30">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Logo */}
        <div className="mb-12">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-green to-accent-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-2xl font-bold text-dark-100 tracking-wide">STARLING</span>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Legal & Resources */}
          <div>
            <div className="flex items-center mb-6">
              <span className="text-accent-green font-mono text-sm mr-4">01</span>
              <div className="h-px bg-dark-600/50 flex-1"></div>
            </div>
            <div className="space-y-4">
              {legalLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-dark-300 hover:text-accent-green transition-colors duration-200 text-sm font-medium"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Social & Community */}
          <div>
            <div className="flex items-center mb-6">
              <span className="text-accent-blue font-mono text-sm mr-4">02</span>
              <div className="h-px bg-dark-600/50 flex-1"></div>
            </div>
            <div className="space-y-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : '_self'}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="block text-dark-300 hover:text-accent-blue transition-colors duration-200 text-sm font-medium"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-dark-600/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="text-dark-500 text-sm">
              © {currentYear} STARLING FINANCIAL LTD. ALL RIGHTS RESERVED
            </div>
            <div className="flex items-center space-x-6 text-xs text-dark-500">
              <span>Licensed by FCA</span>
              <span>•</span>
              <span>Member of FSCS</span>
              <span>•</span>
              <span>ISO 27001 Certified</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-6 border-t border-dark-600/20">
          <p className="text-dark-400 text-xs leading-relaxed max-w-4xl">
            Starling Financial Ltd is authorised by the Financial Conduct Authority under the Payment Services Regulations 2017 for the provision of payment services. 
            Your eligible deposits with Starling are protected up to a total of £85,000 by the Financial Services Compensation Scheme, the UK's deposit protection scheme.
          </p>
        </div>
      </div>
    </footer>
  )
} 