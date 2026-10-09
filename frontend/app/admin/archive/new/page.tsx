'use client'

import { useRouter } from 'next/navigation'
import ArchiveUploadForm from '@/components/forms/archive-upload-form'

export default function ArchiveNewPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background p-0 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Upload Archive Document</h1>
          <p className="text-foreground/70 mt-2">Add government records, reports, and other vital documents to the archive.</p>
        </div>
        <ArchiveUploadForm onBack={() => router.push('/admin/archive')} />
      </div>
    </div>
  )
}
