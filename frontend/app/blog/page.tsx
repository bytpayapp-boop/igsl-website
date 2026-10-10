'use client'

import { useEffect, useMemo, useState } from 'react'
import { BlogCard } from '@/components/cards/blog-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fetchPaginatedNews } from '@/lib/api/newsApi'
import { BlogPost } from '@/lib/types'
import { Search } from 'lucide-react'
import Link from 'next/link'

const NEWS_PAGE_SIZE = 6

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [isChangingPage, setIsChangingPage] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const loadPosts = async (pageNumber: number) => {
    try {
      setIsChangingPage(pageNumber !== 1)
      setLoading(pageNumber === 1)

      const { items, page, totalPages: pages } = await fetchPaginatedNews(pageNumber, NEWS_PAGE_SIZE)
      setPosts(items)
      setCurrentPage(page)
      setTotalPages(pages)
    } catch (error) {
      console.error('Failed to load news articles:', error)
      setPosts([])
    } finally {
      setLoading(false)
      setIsChangingPage(false)
    }
  }

  useEffect(() => {
    void loadPosts(1)
  }, [])

  const categories = useMemo(() => [...new Set(posts.map((post) => post.category))], [posts])

  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => post.status === 'published')
      .filter((post) => {
        const matchesSearch =
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = !selectedCategory || post.category === selectedCategory
        return matchesSearch && matchesCategory
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [posts, searchTerm, selectedCategory])

  const handleNextBatch = async () => {
    if (currentPage >= totalPages) return
    await loadPosts(currentPage + 1)
  }

  const handlePrevBatch = async () => {
    if (currentPage <= 1) return
    await loadPosts(currentPage - 1)
  }

  return (
    <div className="min-h-screen bg-background">
      <Link href="/" className="flex items-center gap-3 font-bold top-5 left-5 text-xl md:top-5 md:left-10 absolute md:block md:flex hover:opacity-80 transition-opacity">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1 shadow-md">
          <img src="/coatOfArm.png" alt="Nigerian Coat of Arms" className="w-10 h-10" />
        </div>
        <span className="sm:inline text-gray-700 dark:text-gray-300">IGSL</span>
      </Link>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-22">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">News & Updates</h1>
          <p className="text-lg text-foreground/70">
            Stay informed about the latest announcements and developments from Igbo-Eze South
          </p>
        </div>

        <div className="space-y-6 mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-2 w-5 h-5 text-foreground/40" />
            <Input
              placeholder="Search articles..."
              className="pl-10 dark:border-gray-300/40 border-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

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

        {loading ? (
          <div className="text-center py-12">
            <p className="text-foreground/70 text-lg">Loading news articles...</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
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
            <p className="text-foreground/70 text-lg">No articles found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
