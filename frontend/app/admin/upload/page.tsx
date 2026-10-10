'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Upload as UploadIcon } from 'lucide-react'
import NewsUploadForm from '@/components/forms/news-upload-form'
import InfoUploadForm from '@/components/forms/info-upload-form'
import GalleryUploadForm from '@/components/forms/gallery-upload-form'
import ArchiveUploadForm from '@/components/forms/archive-upload-form'

type UploadCategory = 'news' | 'info' | 'gallery' | 'archive'

export default function UploadPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialType = searchParams.get('type') as UploadCategory | null
  const [category, setCategory] = useState<UploadCategory | ''>(initialType || 'gallery')

  useEffect(() => {
    if (initialType && ['news', 'info', 'gallery', 'archive'].includes(initialType)) {
      setCategory(initialType)
    }
  }, [initialType])

  const handleBack = () => {
    router.back()
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value as UploadCategory)
  }

  return (
    <div className="min-h-screen bg-background p-0 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack} className="hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold">Upload Projects, Events, Ceremonies</h1>
            <p className="text-foreground/70 mt-2">Create and upload gallery content</p>
          </div>
        </div>

        {/* <Card className="mb-6 border-border">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="content-type" className="font-semibold">
                Content Type
              </Label>
              <Select value={category || 'archive'} onValueChange={handleCategoryChange}>
                <SelectTrigger id="content-type">
                  <SelectValue placeholder="Choose content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="news">News</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="gallery">Gallery</SelectItem>
                  <SelectItem value="archive">Archive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card> */}

        {category === 'news' && <NewsUploadForm onBack={handleBack} />}
        {category === 'info' && <InfoUploadForm onBack={handleBack} />}
        {category === 'gallery' && <GalleryUploadForm onBack={handleBack} />}
        {category === 'archive' && <ArchiveUploadForm onBack={handleBack} />}

        {!category && (
          <Card className="border-border border-2 border-dashed">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <UploadIcon className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Select a content type to begin
              </h3>
              <p className="text-foreground/70 max-w-sm mx-auto">
                Choose News, Info, Gallery, or Archive from the dropdown above to get started.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
