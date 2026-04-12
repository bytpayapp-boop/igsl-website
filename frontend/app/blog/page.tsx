'use client'

import { useMemo, useState } from 'react'
import { mockBlogPosts } from '@/lib/mock-data'
import { BlogCard } from '@/components/cards/blog-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const categories = [...new Set(mockBlogPosts.map((post) => post.category))]

  const filteredPosts = useMemo(() => {
    return mockBlogPosts
      .filter((post) => post.status === 'published')
      .filter((post) => {
        const matchesSearch =
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = !selectedCategory || post.category === selectedCategory
        return matchesSearch && matchesCategory
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [searchTerm, selectedCategory])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">News & Updates</h1>
          <p className="text-lg text-foreground/70">
            Stay informed about the latest announcements and developments from IGSL
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-6 mb-12">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
            <Input
              placeholder="Search articles..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

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
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className="text-sm capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-foreground/70 text-lg">
              No articles found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
