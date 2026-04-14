'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { ArrowLeft, Upload as UploadIcon } from 'lucide-react'
import NewsUploadForm from '@/components/forms/news-upload-form'
import InfoUploadForm from '@/components/forms/info-upload-form'
import GalleryUploadForm from '@/components/forms/gallery-upload-form'

type UploadCategory = 'news' | 'info' | 'gallery'

export default function UploadPage() {
  const router = useRouter()
  const [category, setCategory] = useState<UploadCategory | ''>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleBack = () => {
    router.back()
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value as UploadCategory)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="hover:bg-muted"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-primary">Upload Content</h1>
            <p className="text-foreground/70 mt-2">
              Create and upload news, information, or gallery content
            </p>
          </div>
        </div>

        {/* Category Selection Card */}
        <Card className="mb-8 border-border">
          <CardHeader>
            <CardTitle>Select Content Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-base font-semibold">
                  What would you like to upload?
                </Label>
                <Select value={category} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a category..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="news">
                      <span className="font-medium">📰 News</span>
                    </SelectItem>
                    <SelectItem value="info">
                      <span className="font-medium">ℹ️ Info</span>
                    </SelectItem>
                    <SelectItem value="gallery">
                      <span className="font-medium">🖼️ Gallery</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {category && (
                <div className="p-4 bg-muted rounded-lg border border-border">
                  <p className="text-sm text-foreground/70">
                    {category === 'news' &&
                      'Create engaging news articles with title, content, and featured images.'}
                    {category === 'info' &&
                      'Share important information with title, description, and category classification.'}
                    {category === 'gallery' &&
                      'Upload photos to the gallery with title and category tags.'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Form Content */}
        {category === 'news' && <NewsUploadForm onBack={handleBack} />}
        {category === 'info' && <InfoUploadForm onBack={handleBack} />}
        {category === 'gallery' && <GalleryUploadForm onBack={handleBack} />}

        {/* Empty State */}
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
                Choose News, Info, or Gallery from the dropdown above to get started with your
                upload.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
