'use client'

import { useState } from 'react'
import axios from 'axios'
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
import { ArrowLeft, FileText, Upload as UploadIcon, X } from 'lucide-react'
import { getAdminToken } from '@/lib/api/adminApi'
import { uploadApi } from '@/lib/api/uploadApi'

const ARCHIVE_CATEGORIES = ['policies', 'reports', 'minutes', 'publications', 'records', 'miscellaneous']
const MAX_DOCUMENT_BYTES = 20 * 1024 * 1024
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const MAX_VIDEO_BYTES = 50 * 1024 * 1024

interface ArchiveUploadFormProps {
  onBack: () => void
}

const isAllowedDocumentType = (file: File) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
  ]

  return allowedTypes.includes(file.type) || file.name.toLowerCase().endsWith('.pdf')
}

const isAllowedArchiveFile = (file: File) => {
  const isMedia = file.type.startsWith('image/') || file.type.startsWith('video/')
  return isMedia || isAllowedDocumentType(file)
}

export default function ArchiveUploadForm({ onBack }: ArchiveUploadFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    year: new Date().getFullYear().toString(),
    document: null as File | null,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!isAllowedArchiveFile(file)) {
      toast.error('Only PDF, DOC, DOCX, XLS, XLSX, TXT, image, and video files are allowed.')
      return
    }

    if (file.type.startsWith('image/')) {
      if (file.size > MAX_IMAGE_BYTES) {
        toast.error('Image files must be 5MB or smaller.')
        return
      }
    } else if (file.type.startsWith('video/')) {
      if (file.size > MAX_VIDEO_BYTES) {
        toast.error('Video files must be 50MB or smaller.')
        return
      }
    } else if (file.size > MAX_DOCUMENT_BYTES) {
      toast.error('Document files must be 20MB or smaller.')
      return
    }

    setFormData((prev) => ({ ...prev, document: file }))
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Document title is required')
      return false
    }
    if (!formData.category) {
      toast.error('Category is required')
      return false
    }
    if (!formData.document) {
      toast.error('Please select a document file')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const adminToken = getAdminToken()
    if (!adminToken) {
      toast.error('Please log in as an admin to upload content')
      return
    }

    setIsLoading(true)
    try {
      const documentForm = new FormData()
      documentForm.append('file', formData.document!)
      documentForm.append('upload_preset', 'igsl_news_uploads')

      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dadvxxgl1/upload',
        documentForm
      );
      console.log('Response from cloud:',response.data)

      const documentUrl = response.data.secure_url

      await uploadApi.saveArchive(adminToken, {
        title: formData.title.trim(),
        category: formData.category,
        description: formData.description.trim(),
        year: formData.year || new Date().getFullYear(),
        document: {
          fileUrl: documentUrl,
          url: documentUrl,
          fileName: formData.document?.name || 'archive-document',
          fileId: '',
          fileSize: formData.document?.size || 0,
          mimeType: formData.document?.type || 'application/octet-stream',
          folder: 'igsl/archive',
        },
      })

      toast.success('Archive document uploaded successfully!')
      setFormData({
        title: '',
        category: '',
        description: '',
        year: new Date().getFullYear().toString(),
        document: null,
      })
    } catch (error) {
      console.error(error);
      
      toast.error('Error uploading file to Cloudinary')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Archive Document Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="font-semibold">
              Document Title *
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Annual Development Report 2025"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="font-semibold">
              Category *
            </Label>
            <Select value={formData.category} onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {ARCHIVE_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category} className="capitalize">
                    {category.replace('-', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="year" className="font-semibold">
              Year *
            </Label>
            <Input
              id="year"
              name="year"
              type="number"
              min="1900"
              max="2100"
              value={formData.year}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="font-semibold">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief summary of the document and its purpose"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Document or Media File *</Label>
            <label className="border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:bg-muted transition block">
              <div className="flex flex-col items-center justify-center text-center">
                <UploadIcon className="w-7 h-7 text-primary mb-2" />
                <p className="font-medium text-foreground mb-1">
                  {formData.document ? formData.document.name : 'Click to upload document or media'}
                </p>
                <p className="text-sm text-foreground/50">
                  PDF, DOC, DOCX, XLS, XLSX, TXT, image, or video files
                </p>
              </div>
              <input
                type="file"
                accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,application/pdf,application/msword,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain"
                className="hidden"
                onChange={handleDocumentChange}
              />
            </label>

            {formData.document && (
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm">
                <span className="truncate">{formData.document.name}</span>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, document: null }))}
                  className="ml-2 text-red-500 hover:text-red-600"
                  aria-label="Remove document"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-between gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
