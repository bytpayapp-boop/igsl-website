import type { Metadata } from 'next'
import { fetchStaffMembers } from '@/lib/api/staffApi'
import { StaffMember } from '@/lib/types'
import StaffDetailClient from './staff-detail-client'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://igsl.vercel.app'

function findStaffMember(directory: StaffMember[], id: string): StaffMember | undefined {
  const decoded = decodeURIComponent(id || '').trim()
  const normalized = decoded.toLowerCase()

  return directory.find((item) => {
    const name = (item.name || '').trim()
    const displayName = `${item.title ? `${item.title} ` : ''}${name}`.trim()
    return (
      item.id === id ||
      name === decoded ||
      name === id ||
      displayName === decoded ||
      name.toLowerCase() === normalized ||
      displayName.toLowerCase() === normalized ||
      normalized.endsWith(name.toLowerCase())
    )
  })
}

function getDisplayName(member: StaffMember): string {
  return `${member.title ? `${member.title} ` : ''}${member.name}`.trim()
}

function getShareText(member: StaffMember): string {
  const bio = (member.bio || '').trim()
  return bio ? `${member.role} — ${bio}` : member.name
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params

  try {
    const directory = await fetchStaffMembers()
    const member = findStaffMember(directory, id)

    if (!member) {
      return { title: 'Staff | IGSL' }
    }

    const displayName = getDisplayName(member)
    const description = getShareText(member).slice(0, 160)
    const profileUrl = `${BASE_URL}/staff/${encodeURIComponent(member.profileImage)}`
    const socialImage = member.profileImage || `${BASE_URL}/og-image.png`

    return {
      title: displayName,
      description,
      openGraph: {
        title: displayName,
        description,
        url: profileUrl,
        siteName: 'IGSL',
        type: 'profile',
        images: [
          {
            url: socialImage,
            width: 1200,
            height: 630,
            alt: displayName,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: displayName,
        description,
        images: [socialImage],
      },
    }
  } catch {
    return { title: 'Staff | IGSL' }
  }
}

export default async function StaffDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <StaffDetailClient id={id} />
}
