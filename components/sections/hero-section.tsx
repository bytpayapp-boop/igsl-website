import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileText, Users, Award } from 'lucide-react'

export function HeroSection() {
  const features = [
    {
      icon: FileText,
      title: 'Digital Services',
      description: 'Access birth certificates and identification documents online.'
    },
    {
      icon: Users,
      title: 'Community Engagement',
      description: 'Connect with local government and community programs.'
    },
    {
      icon: Award,
      title: 'Excellence & Integrity',
      description: 'Serving with transparency and commitment to development.'
    }
  ]

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 w-96 h-96 bg-gradient-to-br from-yellow-400 via-pink-500 to-blue-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-20 right-20 w-96 h-96 bg-gradient-to-tl from-purple-600 via-pink-500 to-blue-400 rounded-full opacity-5 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-2">Welcome to</p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4">
                Igbo-Eze South <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500">LGA</span>
              </h1>
              <p className="text-gray-300 text-lg md:text-xl mt-4">
                Discover the new ways to engage with local governance
              </p>
            </div>

            {/* Feature Cards */}
            <div className="space-y-4 pt-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur p-4 hover:border-gray-600 transition-all duration-300"
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <Icon className="h-6 w-6 text-gradient-to-r from-yellow-400 to-pink-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg">{feature.title}</h3>
                        <p className="text-gray-400 text-sm mt-1">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* CTA Link */}
            <div className="pt-4">
              <Link
                href="/services"
                className="text-accent hover:text-accent/80 transition-colors font-medium inline-flex items-center gap-2"
              >
                Explore services
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Right Visual Section */}
          <div className="relative h-full hidden lg:flex items-center justify-center">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-transparent to-blue-500/20 rounded-3xl blur-2xl"></div>

            {/* Service Preview Cards */}
            <div className="relative space-y-4 w-full max-w-sm">
              <div className="transform -rotate-6 opacity-90">
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-2xl border border-yellow-400/30">
                  <h3 className="text-xl font-bold mb-2">Birth Certificate</h3>
                  <p className="text-sm opacity-90">Secure digital documentation</p>
                </div>
              </div>

              <div className="transform rotate-3 opacity-90">
                <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white shadow-2xl border border-pink-400/30">
                  <h3 className="text-xl font-bold mb-2">Local ID</h3>
                  <p className="text-sm opacity-90">Government identification</p>
                </div>
              </div>

              <div className="transform -rotate-2 opacity-90">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-2xl border border-blue-400/30">
                  <h3 className="text-xl font-bold mb-2">Public Services</h3>
                  <p className="text-sm opacity-90">Access all government services</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
