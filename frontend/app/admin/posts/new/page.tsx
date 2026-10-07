'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import NewsUploadForm from '@/components/forms/news-upload-form'

export default function NewBlogPostPage() {
  const router = useRouter()

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">
            Create content
          </p>
          <h1 className="mt-2 text-3xl font-bold text-primary">New Blog Post</h1>
        </div>

        <Button variant="outline" asChild>
          <Link href="/admin/posts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to posts
          </Link>
        </Button>
      </div>

      <NewsUploadForm onBack={() => router.push('/admin/posts')} />
    </div>
  )
}
