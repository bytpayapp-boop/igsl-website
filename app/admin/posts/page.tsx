'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { mockBlogPosts } from '@/lib/mock-data'
import { Trash2, Edit, Plus, Search, Eye } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function AdminPostsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')

  const filteredPosts = mockBlogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filter === 'all' || post.status === filter
    return matchesSearch && matchesFilter
  })

  const handleDelete = (id: string) => {
    console.log('Delete post:', id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Blog Posts</h1>
          <p className="text-foreground/70 mt-1">Manage all blog posts and news articles</p>
        </div>
        <Link href="/admin/posts/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-foreground/40" />
              <Input
                placeholder="Search posts..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {(['all', 'published', 'draft'] as const).map((status) => (
                <Button
                  key={status}
                  variant={filter === status ? 'default' : 'outline'}
                  onClick={() => setFilter(status)}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Posts ({filteredPosts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground/70">Title</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground/70">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground/70">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground/70">Published</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground/70">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-border hover:bg-muted/50 transition"
                  >
                    <td className="py-3 px-4">
                      <p className="font-medium text-primary line-clamp-1">{post.title}</p>
                      <p className="text-sm text-foreground/70 line-clamp-1">{post.content.substring(0, 50)}...</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-foreground/70 capitalize">{post.category}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block text-xs font-medium px-2 py-1 rounded capitalize ${
                          post.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-foreground/70">
                        {formatDistanceToNow(new Date(post.date), { addSuffix: true })}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-2"
                          asChild
                        >
                          <Link href={`/blog/${post.slug}`}>
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">View</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(post.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-foreground/70">No posts found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
