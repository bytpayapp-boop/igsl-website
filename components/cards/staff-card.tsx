import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { StaffMember } from '@/lib/types'
import { Mail, Phone } from 'lucide-react'

interface StaffCardProps {
  member: StaffMember
}

export function StaffCard({ member }: StaffCardProps) {
  return (
    <Link href={`/staff/${member.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden cursor-pointer border-border hover:border-accent">
        <div className="relative w-full h-48 bg-muted">
          <Image
            src={member.profileImage}
            alt={member.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardContent className="pt-6">
          <h3 className="font-bold text-primary text-lg mb-1">{member.name}</h3>
          <p className="text-sm font-medium text-accent mb-2">{member.role}</p>
          <p className="text-xs text-foreground/70 mb-4 capitalize">{member.department}</p>
          <div className="space-y-2">
            {member.email && (
              <div className="flex items-center gap-2 text-xs text-foreground/60 hover:text-foreground transition">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${member.email}`}>{member.email}</a>
              </div>
            )}
            {member.phone && (
              <div className="flex items-center gap-2 text-xs text-foreground/60 hover:text-foreground transition">
                <Phone className="w-4 h-4" />
                <a href={`tel:${member.phone}`}>{member.phone}</a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
