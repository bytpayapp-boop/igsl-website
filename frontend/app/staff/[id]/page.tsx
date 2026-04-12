import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { mockStaffMembers } from '@/lib/mock-data'
import { StaffCard } from '@/components/cards/staff-card'
import { ChevronLeft, Mail, Phone, Building } from 'lucide-react'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return mockStaffMembers.map((member) => ({
    id: member.id,
  }))
}

export default function StaffDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const member = mockStaffMembers.find((m) => m.id === params.id)

  if (!member) {
    notFound()
  }

  const colleagues = mockStaffMembers
    .filter((m) => m.id !== member.id && m.department === member.department)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <Link href="/staff">
          <Button variant="ghost" className="mb-6 -ml-2">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Staff Directory
          </Button>
        </Link>

        {/* Staff Profile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Profile Image */}
          <div className="md:col-span-1">
            <div className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden mb-4">
              <Image
                src={member.profileImage}
                alt={member.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Profile Information */}
          <div className="md:col-span-2 space-y-6">
            {/* Basic Info */}
            <div>
              <h1 className="text-4xl font-bold text-primary mb-2">{member.name}</h1>
              <p className="text-2xl text-accent font-semibold mb-2">{member.role}</p>
              <div className="flex items-center gap-2 text-foreground/70 mb-4">
                <Building className="w-4 h-4" />
                <span className="capitalize">{member.department}</span>
              </div>
            </div>

            {/* Bio */}
            <Card className="border-border bg-secondary/5">
              <CardContent className="pt-6">
                <p className="text-foreground/80 leading-relaxed">{member.bio}</p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground/70">Contact Information</p>
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition"
                >
                  <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-foreground/80">{member.email}</span>
                </a>
              )}
              {member.phone && (
                <a
                  href={`tel:${member.phone}`}
                  className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition"
                >
                  <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-foreground/80">{member.phone}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Department Colleagues */}
        {colleagues.length > 0 && (
          <div className="border-t border-border pt-12">
            <h2 className="text-2xl font-bold text-primary mb-6">
              {member.department} Department
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {colleagues.map((colleague) => (
                <StaffCard key={colleague.id} member={colleague} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
