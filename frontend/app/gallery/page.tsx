'use client'

import { useEffect, useMemo, useState } from 'react'
import { GalleryCard } from '@/components/cards/gallery-card'
import { Button } from '@/components/ui/button'
import { getBackendUrl } from '@/lib/api/backendUrl'
import { GalleryCategory, GalleryItem } from '@/lib/types'
import Image from 'next/image'
import { Dialog, DialogContent, DialogClose, DialogTitle } from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

const GALLERY_PAGE_SIZE = 6

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory | string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [selectedGallery, setSelectedGallery] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isChangingPage, setIsChangingPage] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState<string | null>(null)

  const fetchGalleryPage = async (pageNumber: number) => {
    try {
      setError(null)
      if (pageNumber === 1) {
        setIsLoading(true)
      } else {
        setIsChangingPage(true)
      }

      const response = await fetch(
        `${getBackendUrl()}/api/news?type=GALLERY&page=${pageNumber}&limit=${GALLERY_PAGE_SIZE}`,
        {
          cache: 'no-store',
          next: { revalidate: 0 },
        }
      )

      const payload = await response.json().catch(() => ({ data: [], page: pageNumber, total: 0 }))

      if (!response.ok) {
        throw new Error(payload?.message || 'Failed to fetch gallery items')
      }

      const items = Array.isArray(payload?.data) ? payload.data : []

      const mappedItems: GalleryItem[] = items
        .map((item: any) => {
          const galleryImages = Array.isArray(item.galleryImages)
            ? item.galleryImages
                .map((image: any) => image?.fileUrl || image?.url || image?.src || '')
                .filter(Boolean)
            : []

          const imageUrl =
            item.coverImageUrl ||
            item.coverImage ||
            galleryImages[0] ||
            '/placeholder-image.jpg'

          return {
            id: String(item.id ?? `${item.title}-${item.createdAt}`),
            title: String(item.title || 'Gallery item'),
            category: String(item.category || 'events').toLowerCase(),
            image: imageUrl,
            galleryImages: Array.isArray(item.galleryImages) ? item.galleryImages : [],
            date: new Date(item.date || item.createdAt || Date.now()),
          }
        })
        .filter((item) => Boolean(item.image))

      const nextPage = Number(payload?.page ?? pageNumber) || pageNumber
      const totalItems = Number(payload?.total ?? mappedItems.length) || 0
      const pages = Number(payload?.totalPages ?? (Math.ceil(totalItems / GALLERY_PAGE_SIZE) || 1)) || 1

      setGalleryItems(mappedItems)
      setCurrentPage(nextPage)
      setTotalPages(pages)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load gallery items')
      setGalleryItems([])
    } finally {
      setIsLoading(false)
      setIsChangingPage(false)
    }
  }

  useEffect(() => {
    void fetchGalleryPage(1)
  }, [])

  const categories = useMemo(
    () => [...new Set(galleryItems.map((item) => item.category))],
    [galleryItems]
  )

  const filteredItems = useMemo(() => {
    if (!selectedCategory) return galleryItems
    return galleryItems.filter(
      (item) => String(item.category).toLowerCase() === String(selectedCategory).toLowerCase()
    )
  }, [galleryItems, selectedCategory])

  const openImageViewer = (item: GalleryItem) => {
    const galleryUrls = Array.isArray(item.galleryImages) && item.galleryImages.length > 0
      ? item.galleryImages
          .map((image) => image?.fileUrl || image?.url || image?.src || '')
          .filter(Boolean)
      : [item.image].filter(Boolean)

    const urls = galleryUrls.length > 0 ? galleryUrls : [item.image]

    setSelectedGallery(urls)
    setSelectedIndex(0)
    setSelectedImage(urls[0] ?? null)
  }

  const handlePrevImage = () => {
    if (selectedGallery.length === 0) return
    const previousIndex = (selectedIndex - 1 + selectedGallery.length) % selectedGallery.length
    setSelectedIndex(previousIndex)
    setSelectedImage(selectedGallery[previousIndex])
  }

  const handleNextImage = () => {
    if (selectedGallery.length === 0) return
    const nextIndex = (selectedIndex + 1) % selectedGallery.length
    setSelectedIndex(nextIndex)
    setSelectedImage(selectedGallery[nextIndex])
  }

  const handleNextBatch = async () => {
    if (currentPage >= totalPages) return
    await fetchGalleryPage(currentPage + 1)
  }

  const handlePrevBatch = async () => {
    if (currentPage <= 1) return
    await fetchGalleryPage(currentPage - 1)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h1>
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} onClick={() => openImageViewer(item)}>
                  <GalleryCard item={item} />
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between gap-4 border-t border-border pt-6">
              <Button
                variant="outline"
                onClick={handlePrevBatch}
                disabled={currentPage <= 1 || isChangingPage}
                className="min-w-[120px]"
              >
                Prev
              </Button>

              <p className="text-sm text-foreground/70">
                Page {currentPage} of {totalPages}
              </p>

              <Button
                variant="default"
                onClick={handleNextBatch}
                disabled={currentPage >= totalPages || isChangingPage}
                className="min-w-[120px]"
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-foreground/70 text-lg">No gallery items found in this category.</p>
          </div>
        )}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-4xl md:max-w-5xl w-full group max-h-[950vh] p-0">
          <DialogTitle asChild>
            <VisuallyHidden>Gallery image viewer</VisuallyHidden>
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 z-50 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          {selectedImage && (
            <div className="relative w-full h-[90vh] md:h-[100vh] flex items-center justify-center z-[20] bg-background">
              <Image src={selectedImage} alt="Gallery Image" fill className="object-contain" />
              <button
                onClick={handlePrevImage}
                className="absolute left-4 cursor-pointer flex z-[150] top-1/2 -translate-y-1/2 bg-accent/90 hover:bg-accent text-primary p-2 rounded-full transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 cursor-pointer top-1/2 -translate-y-1/2 bg-accent/90 hover:bg-accent text-primary p-2 rounded-full z-[100] transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-600/70 text-primary-foreground px-4 py-2 rounded-full opacity-80 text-sm">
                {selectedGallery.length > 0 ? `${selectedIndex + 1} / ${selectedGallery.length}` : '1 / 1'}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
