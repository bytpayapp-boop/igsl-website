'use client'

import { useState, useMemo } from 'react'
import { GalleryCard } from '@/components/cards/gallery-card'
import { Button } from '@/components/ui/button'
import { mockGalleryItems } from '@/lib/mock-data'
import { GalleryCategory } from '@/lib/types'
import Image from 'next/image'
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

const categories: GalleryCategory[] = ['events', 'community', 'leadership', 'ceremonies', 'programs']

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const filteredItems = useMemo(() => {
    if (!selectedCategory) return mockGalleryItems
    return mockGalleryItems.filter((item) => item.category === selectedCategory)
  }, [selectedCategory])

  const handlePrevImage = () => {
    setSelectedIndex((prev) => (prev === 0 ? filteredItems.length - 1 : prev - 1))
    setSelectedImage(filteredItems[(selectedIndex - 1 + filteredItems.length) % filteredItems.length].image)
  }

  const handleNextImage = () => {
    setSelectedIndex((prev) => (prev === filteredItems.length - 1 ? 0 : prev + 1))
    setSelectedImage(filteredItems[(selectedIndex + 1) % filteredItems.length].image)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Community Gallery
          </h1>
          <p className="text-lg text-foreground/70">
            View community events, celebrations, and government activities
          </p>
        </div>

        {/* Category Filter */}
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

        {/* Gallery Grid */}
        {filteredItems.length > 0 ? (
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
            <p className="text-foreground/70 text-lg">
              No gallery items found in this category.
            </p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] p-0">
          <DialogClose className="absolute right-4 top-4 z-50 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          {selectedImage && (
            <div className="relative w-full h-[70vh] flex items-center justify-center bg-primary">
              <Image
                src={selectedImage}
                alt="Gallery Image"
                fill
                className="object-contain"
              />
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-accent/90 hover:bg-accent text-primary p-2 rounded-full transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-accent/90 hover:bg-accent text-primary p-2 rounded-full transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-primary-foreground/20 text-primary-foreground px-4 py-2 rounded-full text-sm">
                {selectedIndex + 1} / {filteredItems.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
