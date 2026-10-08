'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { getAdminToken } from '@/lib/api/adminApi'
import { getBackendUrl } from '@/lib/api/backendUrl'
import { GalleryCategory, GalleryItem } from '@/lib/types'
import { Trash2, Edit, Search, Upload } from 'lucide-react'
import { toast } from 'sonner'

type AdminGalleryItem = GalleryItem & {
  images?: string[]
}

export default function AdminGalleryPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [galleryItems, setGalleryItems] = useState<AdminGalleryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<AdminGalleryItem | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editCategory, setEditCategory] = useState<GalleryCategory>('events')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let isMounted = true

    const fetchGalleryItems = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`${getBackendUrl()}/api/news?type=GALLERY`, {
          cache: 'no-store',
          next: { revalidate: 0 },
        })

        const payload = await response.json().catch(() => ({ data: [] }))

        if (!response.ok) {
          throw new Error(payload?.message || 'Failed to fetch gallery items')
        }

        const items = Array.isArray(payload?.data) ? payload.data : []

        const mappedItems: AdminGalleryItem[] = items
          .map((item: any): AdminGalleryItem => {
            const galleryImages = Array.isArray(item.galleryImages)
              ? item.galleryImages
                  .map((image: any) => image?.fileUrl || image?.url || image?.src || '')
                  .filter(Boolean)
              : []

            const primaryImage =
              item.coverImageUrl ||
              item.coverImage ||
              galleryImages[0] ||
              '/placeholder-image.jpg'

            const category = String(item.category || 'events').toLowerCase() as GalleryCategory

            return {
              id: String(item.id ?? `${item.title}-${item.createdAt}`),
              title: String(item.title || 'Gallery item'),
              category,
              image: primaryImage,
              images: galleryImages.length ? galleryImages : [primaryImage],
              date: new Date(item.date || item.createdAt || Date.now()),
            }
          })
          .filter((item: AdminGalleryItem) => Boolean(item.image))

        if (isMounted) {
          setGalleryItems(mappedItems)
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load gallery items')
          setGalleryItems([])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchGalleryItems()

    return () => {
      isMounted = false
    }
  }, [])

  const categories = useMemo(
    () => [...new Set(galleryItems.map((item) => item.category))],
    [galleryItems]
  )

  const filteredItems = useMemo(() => {
    return galleryItems.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !selectedCategory || item.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [galleryItems, searchTerm, selectedCategory])

  const handleDelete = async (item: AdminGalleryItem) => {
    const confirmed = window.confirm(`Delete "${item.title}"? This action cannot be undone.`)
    if (!confirmed) return

    const adminPassword = window.prompt('Enter your admin password to confirm deletion:')
    if (!adminPassword || !adminPassword.trim()) {
      toast.error('Admin password is required to delete a gallery item.')
      return
    }

    const adminToken = getAdminToken()
    if (!adminToken) {
      toast.error('Please log in as an admin to delete content.')
      return
    }

    try {
      setIsSaving(true)
      const response = await fetch(`${getBackendUrl()}/api/admin/uploads/gallery/${item.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ password: adminPassword.trim() }),
      })

      const payload = await response.json().catch(() => ({ message: 'Failed to delete gallery item' }))

      if (!response.ok) {
        throw new Error(payload?.message || 'Failed to delete gallery item')
      }

      setGalleryItems((prev) => prev.filter((galleryItem) => galleryItem.id !== item.id))
      toast.success('Gallery item deleted successfully.')
    } catch (deleteError) {
      toast.error(
        deleteError instanceof Error ? deleteError.message : 'Failed to delete gallery item'
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (item: AdminGalleryItem) => {
    setEditingItem(item)
    setEditTitle(item.title)
    setEditCategory((item.category as GalleryCategory) || 'events')
  }

  const handleSaveEdit = async () => {
    if (!editingItem) return

    const adminToken = getAdminToken()
    if (!adminToken) {
      toast.error('Please log in as an admin to edit content.')
      return
    }

    const cleanedTitle = editTitle.trim()
    if (!cleanedTitle) {
      toast.error('Gallery title is required.')
      return
    }

    try {
      setIsSaving(true)
      const response = await fetch(`${getBackendUrl()}/api/admin/uploads/gallery/${editingItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          title: cleanedTitle,
          category: editCategory,
        }),
      })

      const payload = await response.json().catch(() => ({ message: 'Failed to update gallery item' }))

      if (!response.ok) {
        throw new Error(payload?.message || 'Failed to update gallery item')
      }

      setGalleryItems((prev) =>
        prev.map((galleryItem) =>
          galleryItem.id === editingItem.id
            ? {
                ...galleryItem,
                title: cleanedTitle,
                category: editCategory,
              }
            : galleryItem
        )
      )
      toast.success('Gallery item updated successfully.')
      setEditingItem(null)
      setEditTitle('')
      setEditCategory('events')
    } catch (saveError) {
      toast.error(
        saveError instanceof Error ? saveError.message : 'Failed to update gallery item'
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Gallery</h1>
          <p className="text-foreground/70 mt-1">Manage gallery photos and images</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => router.push('/admin/upload')}>
          <Upload className="w-4 h-4" />
          Upload More
        </Button>
      </div>

      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-foreground/40" />
              <Input
                placeholder="Search gallery items..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={!selectedCategory ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(null)}
              >
                All Categories
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(cat)}
                  className="capitalize"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="text-center py-12 text-foreground/70">Loading gallery items...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="border-border overflow-hidden hover:shadow-lg transition">
              <div className="relative w-full h-48 bg-muted">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-medium capitalize">
                  {item.category}
                </div>
              </div>
              <CardContent className="pt-4">
                <h3 className="font-bold text-primary text-lg mb-1 line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-sm text-foreground/70 mb-4 line-clamp-2">
                  {new Date(item.date).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 flex items-center gap-2"
                    onClick={() => handleEdit(item)}
                    disabled={isSaving}
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(item)}
                    disabled={isSaving}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && !error && filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-foreground/70">No gallery items found</p>
        </div>
      )}

      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit gallery item</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={editTitle}
                onChange={(event) => setEditTitle(event.target.value)}
                placeholder="Gallery item title"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select
                value={editCategory}
                onChange={(event) => setEditCategory(event.target.value as GalleryCategory)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="events">Events</option>
                <option value="community">Community</option>
                <option value="leadership">Leadership</option>
                <option value="ceremonies">Ceremonies</option>
                <option value="programs">Programs</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
