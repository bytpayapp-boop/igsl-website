import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface ServiceCardProps {
  icon: LucideIcon
  title: string
  description: string
  href: string
}

export function ServiceCard({ icon: Icon, title, description, href }: ServiceCardProps) {
  return (
    <Link href={href}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-border hover:border-accent">
        <CardHeader>
          <div className="mb-4 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-accent" />
          </div>
          <CardTitle className="text-primary">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-foreground/70">{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  )
}
