'use client'

import { useEffect, useMemo, useState } from 'react'
import { GalleryCard } from '@/components/cards/gallery-card'
import { Button } from '@/components/ui/button'
import { getBackendUrl } from '@/lib/api/backendUrl'
import { GalleryCategory, GalleryItem } from '@/lib/types'
import Image from 'next/image'
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { it } from 'node:test'

const defaultCategories: GalleryCategory[] = ['events', 'community', 'leadership', 'ceremonies', 'programs']

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

        const mappedItems: GalleryItem[] = items
          .map((item: any) => {
            console.log('Gallery Item:',item)
            const galleryImages = Array.isArray(item.galleryImages)
              ? item.galleryImages
                  .map((image: any) => image?.fileUrl || image?.url || image?.src || '')
                  .filter(Boolean)
              : [];
              console.log('Gallery Images',galleryImages)

            const imageUrl =
              item.coverImageUrl ||
              item.coverImage ||
              galleryImages[0] ||
              '/placeholder-image.jpg'

            const normalizedCategory = String(item.category || 'events').toLowerCase() as GalleryCategory

            return {
              id: String(item.id ?? `${item.title}-${item.createdAt}`),
              title: String(item.title || 'Gallery item'),
              category: defaultCategories.includes(normalizedCategory)
                ? normalizedCategory
                : 'events',
              image: imageUrl,
              date: new Date(item.date || item.createdAt || Date.now()),
            }
          })
          .filter((item: GalleryItem) => Boolean(item.image))

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
    if (!selectedCategory) return galleryItems
    return galleryItems.filter((item) => item.category === selectedCategory)
  }, [galleryItems, selectedCategory])

  const handlePrevImage = () => {
    if (filteredItems.length === 0) return
    const previousIndex = (selectedIndex - 1 + filteredItems.length) % filteredItems.length
    setSelectedIndex(previousIndex)
    setSelectedImage(filteredItems[previousIndex].image)
  }

  const handleNextImage = () => {
    if (filteredItems.length === 0) {
      console.log('No filtered items')
      return}
    const nextIndex = (selectedIndex + 1) % filteredItems.length
    setSelectedIndex(nextIndex)
    setSelectedImage(filteredItems[nextIndex].image)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Community Gallery</h1>
          <p className="text-lg text-foreground/70">
            View community events, celebrations, and government activities
          </p>
        </div>

        <div className="mb-12">
          <p className="text-sm font-medium text-foreground/70 mb-4">Filter by Category</p>
          <div className="flex flex-wrap gap-3">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(null)}
              className="capitalize"
            >
              All Gallery
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-foreground/70">Loading gallery items...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedImage(item.image)
                  setSelectedIndex(index)
                }}
              >
                <GalleryCard item={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-foreground/70 text-lg">No gallery items found in this category.</p>
          </div>
        )}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] p-0">
          <DialogClose className="absolute right-4 top-4 z-50 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          {selectedImage && (
            <div className="relative w-full h-[70vh] flex items-center justify-center z-[20] bg-background">
              <Image
                src={selectedImage}
                alt="Gallery Image"
                fill
                className="object-contain"
              />
              <button
                onClick={handlePrevImage}
                className="absolute left-4 cursor-pointer flex z-[150] top-1/2 -translate-y-1/2 bg-accent/90 hover:bg-accent text-primary p-2 rounded-full transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={()=>handleNextImage()}
                className="absolute right-4 cursor-pointer top-1/2 -translate-y-1/2 bg-accent/90 hover:bg-accent text-primary p-2 rounded-full z-[100] transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-primary-foreground/20 text-primary-foreground px-4 py-2 rounded-full text-sm">
                {filteredItems.length > 0 ? `${selectedIndex + 1} / ${filteredItems.length}` : '0 / 0'}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
