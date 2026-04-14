'use client'

import { useState } from 'react'
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
import { Upload as UploadIcon, X } from 'lucide-react'

interface InfoUploadFormProps {
  onBack: () => void
}

export default function InfoUploadForm({ onBack }: InfoUploadFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    content: '',
    image: null as File | null,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const infoCategories = ['announcements', 'guidelines', 'services', 'updates', 'policies']

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB')
        return
      }
      setFormData((prev) => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setFormData((prev) => ({ ...prev, image: null }))
    setImagePreview(null)
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Title is required')
      return false
    }
    if (!formData.category) {
      toast.error('Category is required')
      return false
    }
    if (!formData.description.trim()) {
      toast.error('Description is required')
      return false
    }
    if (!formData.content.trim()) {
      toast.error('Content is required')
      return false
    }
    if (!formData.image) {
      toast.error('Image is required')
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
      formDataToSend.append('description', formData.description)
      formDataToSend.append('content', formData.content)
      if (formData.image) {
        formDataToSend.append('image', formData.image)
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast.success('Information uploaded successfully!')
      // Reset form
      setFormData({
        title: '',
        category: '',
        description: '',
        content: '',
        image: null,
      })
      setImagePreview(null)
    } catch (error) {
      toast.error('Failed to upload information')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Info Form Card */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>ℹ️ Information Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="font-semibold">
              Information Title *
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter information title"
              value={formData.title}
              onChange={handleInputChange}
              maxLength={150}
            />
            <p className="text-xs text-foreground/50">{formData.title.length}/150</p>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="font-semibold">
              Category *
            </Label>
            <Select value={formData.category} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {infoCategories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="capitalize">
                    {cat.replace('-', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description (Short) */}
          <div className="space-y-2">
            <Label htmlFor="description" className="font-semibold">
              Short Description *
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Brief summary of the information (will appear in previews)"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-foreground/50">{formData.description.length}/500</p>
          </div>

          {/* Content (Detailed) */}
          <div className="space-y-2">
            <Label htmlFor="content" className="font-semibold">
              Detailed Content *
            </Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Write comprehensive information here..."
              value={formData.content}
              onChange={handleInputChange}
              rows={8}
              maxLength={5000}
            />
            <p className="text-xs text-foreground/50">{formData.content.length}/5000</p>
          </div>

          {/* Image */}
          <div className="space-y-2">
            <Label className="font-semibold">Information Image *</Label>
            {imagePreview ? (
              <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-border">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-border rounded-lg p-8 cursor-pointer hover:bg-muted transition block">
                <div className="flex flex-col items-center justify-center">
                  <UploadIcon className="w-8 h-8 text-primary mb-2" />
                  <p className="font-medium text-foreground mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-foreground/50">PNG, JPG, GIF up to 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={onBack} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Uploading...' : 'Upload Information'}
        </Button>
      </div>
    </form>
  )
}
