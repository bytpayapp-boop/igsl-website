import { ServiceCard } from '@/components/cards/service-card'
import {
  FileText,
  Baby,
  Archive,
  Image,
  Newspaper,
  Users,
} from 'lucide-react'

export function ServicesSection() {
  const services = [
    {
      icon: FileText,
      title: 'Local Government ID',
      description: 'Apply for official local government identification with simplified online processing.',
      href: '/services/identification',
    },
    {
      icon: Baby,
      title: 'Birth Certificate',
      description: 'Register and obtain certified birth certificates for vital records.',
      href: '/services/birth-certificate',
    },
    {
      icon: Archive,
      title: 'Government Archive',
      description: 'Access historical records, reports, and official government documents.',
      href: '/archive',
    },
    {
      icon: Image,
      title: 'Gallery',
      description: 'View community events, celebrations, and government activities.',
      href: '/gallery',
    },
    {
      icon: Newspaper,
      title: 'News & Updates',
      description: 'Stay informed with latest announcements and development updates.',
      href: '/blog',
    },
    {
      icon: Users,
      title: 'Staff Directory',
      description: 'Connect with government officials and department heads.',
      href: '/staff',
    },
  ]

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
          Our Services
        </h2>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
          Access essential government services and information tailored for our community.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard
            key={service.title}
            icon={service.icon}
            title={service.title}
            description={service.description}
            href={service.href}
          />
        ))}
      </div>
    </section>
  )
}
