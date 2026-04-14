'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Upload as UploadIcon, X } from 'lucide-react'

interface GalleryUploadFormProps {
  onBack: () => void
}

export default function GalleryUploadForm({ onBack }: GalleryUploadFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    images: [] as File[],
  })
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const galleryCategories = ['events', 'community', 'leadership', 'ceremonies', 'programs']

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleMultipleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles: File[] = []
      const newPreviews: string[] = []

      Array.from(files).forEach((file) => {
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not a valid image file`)
          return
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is larger than 5MB`)
          return
        }
        newFiles.push(file)

        const reader = new FileReader()
        reader.onloadend = () => {
          newPreviews.push(reader.result as string)
          if (newPreviews.length === newFiles.length) {
            setImagePreviews((prev) => [...prev, ...newPreviews])
          }
        }
        reader.readAsDataURL(file)
      })

      setFormData((prev) => ({ ...prev, images: [...prev.images, ...newFiles] }))
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Gallery title is required')
      return false
    }
    if (!formData.category) {
      toast.error('Category is required')
      return false
    }
    if (formData.images.length === 0) {
      toast.error('At least one image is required')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      // TODO: Replace with actual API call
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('category', formData.category)
      formData.images.forEach((image, index) => {
        formDataToSend.append(`images[${index}]`, image)
      })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast.success(`Gallery uploaded successfully with ${formData.images.length} photo(s)!`)
      // Reset form
      setFormData({
        title: '',
        category: '',
        images: [],
      })
      setImagePreviews([])
    } catch (error) {
      toast.error('Failed to upload gallery')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Gallery Form Card */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>🖼️ Gallery Upload Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Gallery Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="font-semibold">
              Gallery Title *
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Independence Day Celebration 2026"
              value={formData.title}
              onChange={handleInputChange}
              maxLength={150}
            />
            <p className="text-xs text-foreground/50">{formData.title.length}/150</p>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="font-semibold">
              Gallery Category *
            </Label>
            <Select value={formData.category} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {galleryCategories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="capitalize">
                    {cat.replace('-', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Images Upload */}
          <div className="space-y-2">
            <Label className="font-semibold">Gallery Images *</Label>
            {imagePreviews.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-border"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-1 left-1 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
                <label className="border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:bg-muted transition block">
                  <div className="flex flex-col items-center justify-center">
                    <UploadIcon className="w-6 h-6 text-primary mb-2" />
                    <p className="font-medium text-foreground mb-1">Add more photos</p>
                    <p className="text-sm text-foreground/50">
                      {imagePreviews.length} photo(s) selected
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleMultipleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <label className="border-2 border-dashed border-border rounded-lg p-8 cursor-pointer hover:bg-muted transition block">
                <div className="flex flex-col items-center justify-center">
                  <UploadIcon className="w-8 h-8 text-primary mb-2" />
                  <p className="font-medium text-foreground mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-foreground/50">
                    PNG, JPG, GIF up to 5MB each (multiple files allowed)
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleMultipleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Info Note */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              💡 Tip: You can upload multiple images at once. Each image will be stored with the
              gallery title and category.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={onBack} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || formData.images.length === 0}>
          {isLoading
            ? 'Uploading...'
            : `Upload ${formData.images.length} Photo${formData.images.length !== 1 ? 's' : ''}`}
        </Button>
      </div>
    </form>
  )
}
