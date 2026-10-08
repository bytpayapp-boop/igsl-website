import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileText, MessageSquareText, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: 'IGSL Services',
  description: 'Apply for a local government ID, register a birth certificate, or send an anonymous message to the council.',
}

const services = [
  {
    title: 'Local Government ID Application',
    description:
      'Apply for your official local government identification with a simple online form and transparent processing.',
    href: '/services/identification',
    icon: ShieldCheck,
    accent: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300',
    details: ['Quick online application', 'Verification support', 'Secure document processing'],
  },
  {
    title: 'Birth Certificate Application',
    description:
      'Register a child’s birth and receive a certified certificate using a streamlined digital submission process.',
    href: '/services/birth-certificate',
    icon: FileText,
    accent: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    details: ['Fast application review', 'Clear requirements checklist', 'Official certificate issuance'],
  },
  {
    title: 'Anonymous Drop Message',
    description:
      'Share feedback, concerns, or reports confidentially with the local government administration.',
    href: '/anonymous-message',
    icon: MessageSquareText,
    accent: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
    details: ['Private message channel', 'Safe feedback submission', 'Reviewed by administrators'],
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <p className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
            Public Services
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Access the services you need
          </h1>
          <p className="mt-4 text-lg text-foreground/70">
            From official identification to birth registration and confidential feedback, IGSL provides a simple path to serve residents efficiently.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon

            return (
              <Card
                key={service.title}
                className="group flex h-full flex-col border-border/80 bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <CardHeader className="pb-4">
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${service.accent}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl leading-tight">{service.title}</CardTitle>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col">
                  <p className="mb-5 text-foreground/70">{service.description}</p>

                  <ul className="space-y-3">
                    {service.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-3 text-sm text-foreground/70">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 pt-4">
                    <Link href={service.href} className="block">
                      <Button className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                        Open service
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-12 rounded-2xl border border-primary/10 bg-primary/5 p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Need assistance?</p>
              <h2 className="mt-2 text-2xl font-bold text-foreground">We’re here to help you complete your request.</h2>
            </div>
            <Link href="/about" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              Learn about IGSL
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
