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
import { getAdminToken } from '@/lib/api/adminApi'
import { uploadApi } from '@/lib/api/uploadApi'
import { uploadFileToImageKit } from '@/lib/imagekit/upload-file'
import {
  isVideoFile,
  UPLOAD_MEDIA_ACCEPT,
  UPLOAD_MEDIA_HINT,
  validateUploadMediaFile,
} from '@/lib/upload-media'
import axios from 'axios'

interface NewsUploadFormProps {
  onBack: () => void
}

export default function NewsUploadForm({ onBack }: NewsUploadFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    author: '',
    tags: '',
    coverImage: null as File | null,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const newsCategories = ['announcements', 'updates', 'leadership', 'infrastructure']

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
      const validationError = validateUploadMediaFile(file)
      if (validationError) {
        toast.error(validationError)
        return
      }
      setFormData((prev) => ({ ...prev, coverImage: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setFormData((prev) => ({ ...prev, coverImage: null }))
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
    if (!formData.content.trim()) {
      toast.error('Content is required')
      return false
    }
    if (!formData.author.trim()) {
      toast.error('Author is required')
      return false
    }
    if (!formData.coverImage) {
      toast.error('Cover image or video is required')
      return false
    }
    return true
  }

//The helper function to upload selected image or video files
   const handleSubmit = async (e) => {
      e.preventDefault()
    if (!validateForm()) return
    try {
      setIsLoading(true)
      const adminToken = getAdminToken();
       if (!adminToken) {
      toast.error('Please log in as an admin to upload content')
      return
    }
      const imageForm = new FormData();
      imageForm.append("file", formData.coverImage!);
      imageForm.append("upload_preset", "igsl_news_uploads");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dadvxxgl1/upload",
        imageForm,
      );
      console.log('Cloudinary feedback',response.data);
      

      const imgUrl = response.data.secure_url;
  
      console.log('secure-url:',imgUrl)

      //update the formData with the new image url from cloudinary secure url
   
      toast.success("File uploaded succesfully");
      const coverImage = imgUrl;
      
      await uploadApi.saveNews(adminToken, {
        title: formData.title.trim(),
        category: formData.category,
        content: formData.content.trim(),
        author: formData.author.trim(),
        tags: formData.tags.trim() || undefined,
        coverImage,
      })
      return imgUrl
    } catch (err) {
      toast.error('Error uploading file to cloudinary');
      console.log(err);
      setIsLoading(false)
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   if (!validateForm()) return

  //   const adminToken = getAdminToken()
  //   if (!adminToken) {
  //     toast.error('Please log in as an admin to upload content')
  //     return
  //   }

  //   setIsLoading(true)
  //   try {
  //     const coverImage = await uploadFileToImageKit(formData.coverImage!, 'igsl/news')
  //     await uploadApi.saveNews(adminToken, {
  //       title: formData.title.trim(),
  //       category: formData.category,
  //       content: formData.content.trim(),
  //       author: formData.author.trim(),
  //       tags: formData.tags.trim() || undefined,
  //       coverImage,
  //     })

  //     toast.success('News article uploaded successfully!')
  //     // Reset form
  //     setFormData({
  //       title: '',
  //       category: '',
  //       content: '',
  //       author: '',
  //       tags: '',
  //       coverImage: null,
  //     })
  //     setImagePreview(null)
  //   } catch (error) {
  //     toast.error('Failed to upload news article')
  //     console.error(error)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* News Form Card */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>📰 News Article Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="font-semibold">
              Article Title *
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter news article title"
              value={formData.title}
              onChange={handleInputChange}
              maxLength={200}
            />
            <p className="text-xs text-foreground/50">{formData.title.length}/200</p>
          </div>

          {/* Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="font-semibold">
                Category *
              </Label>
              <Select value={formData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {newsCategories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="capitalize">
                      {cat.replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Author */}
            <div className="space-y-2">
              <Label htmlFor="author" className="font-semibold">
                Author *
              </Label>
              <Input
                id="author"
                name="author"
                placeholder="e.g., IGSL Communications"
                value={formData.author}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="font-semibold">
              Article Content *
            </Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Write your news article content here..."
              value={formData.content}
              onChange={handleInputChange}
              rows={8}
              maxLength={5000}
            />
            <p className="text-xs text-foreground/50">{formData.content.length}/5000</p>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="font-semibold">
              Tags (comma-separated)
            </Label>
            <Input
              id="tags"
              name="tags"
              placeholder="e.g., government, update, announcement"
              value={formData.tags}
              onChange={handleInputChange}
            />
            <p className="text-xs text-foreground/50">
              Separate tags with commas for better categorization
            </p>
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <Label className="font-semibold">Cover Image or Video *</Label>
            {imagePreview ? (
              <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-border">
                {formData.coverImage && isVideoFile(formData.coverImage) ? (
                  <video
                    src={imagePreview}
                    controls
                    className="w-full h-full object-cover bg-black"
                  />
                ) : (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                )}
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
                  <p className="text-sm text-foreground/50">{UPLOAD_MEDIA_HINT}</p>
                </div>
                <input
                  type="file"
                  accept={UPLOAD_MEDIA_ACCEPT}
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
          {isLoading ? 'Uploading...' : 'Upload News Article'}
        </Button>
      </div>
    </form>
  )
}
