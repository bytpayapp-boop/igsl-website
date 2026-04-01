'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { mockArchiveItems } from '@/lib/mock-data'
import { Search } from 'lucide-react'

export default function ArchivePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedYear, setSelectedYear] = useState('')

  const categories = [...new Set(mockArchiveItems.map((item) => item.category))]
  const years = [...new Set(mockArchiveItems.map((item) => item.year))].sort((a, b) => b - a)

  const filteredItems = useMemo(() => {
    return mockArchiveItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !selectedCategory || item.category === selectedCategory
      const matchesYear = !selectedYear || item.year === parseInt(selectedYear)
      return matchesSearch && matchesCategory && matchesYear
    })
  }, [searchTerm, selectedCategory, selectedYear])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Government Archive
          </h1>
          <p className="text-lg text-foreground/70">
            Access historical records, reports, and official government documents
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-6 mb-12">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
            <Input
              placeholder="Search archive..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Buttons */}
          <div className="space-y-4">
            {/* Category Filter */}
            <div>
              <p className="text-sm font-medium text-foreground/70 mb-2">Category</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={!selectedCategory ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('')}
                  className="text-sm"
                >
                  All Categories
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(cat)}
                    className="text-sm capitalize"
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Year Filter */}
            <div>
              <p className="text-sm font-medium text-foreground/70 mb-2">Year</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={!selectedYear ? 'default' : 'outline'}
                  onClick={() => setSelectedYear('')}
                  className="text-sm"
                >
                  All Years
                </Button>
                {years.map((year) => (
                  <Button
                    key={year}
                    variant={selectedYear === year.toString() ? 'default' : 'outline'}
                    onClick={() => setSelectedYear(year.toString())}
                    className="text-sm"
                  >
                    {year}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Archive Items */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredItems.map((item) => (
              <Link key={item.id} href={`/archive/${item.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden cursor-pointer border-border hover:border-accent">
                  {item.image && (
                    <div className="relative w-full h-40 bg-muted">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-medium bg-accent/10 text-accent px-2 py-1 rounded capitalize">
                        {item.category}
                      </span>
                      <span className="text-xs text-foreground/60 whitespace-nowrap">{item.year}</span>
                    </div>
                    <h3 className="font-bold text-primary text-lg line-clamp-2">
                      {item.title}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground/70 line-clamp-2">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-foreground/70 text-lg">
              No archive items found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
