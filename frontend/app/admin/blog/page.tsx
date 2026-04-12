'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { mockBlogPosts } from '@/lib/mock-data'
import { Edit, Trash2, Plus, Eye, EyeOff } from 'lucide-react'

export default function BlogManagementPage() {
  const [posts, setPosts] = useState(mockBlogPosts)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = (id: string) => {
    setPosts(posts.filter((post) => post.id !== id))
  }

  const handleTogglePublish = (id: string) => {
    setPosts(
      posts.map((post) =>
        post.id === id
          ? {
              ...post,
              status: post.status === 'published' ? 'draft' : 'published',
            }
          : post
      )
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header with Create Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Blog Posts Management</h1>
            <p className="text-foreground/70">Create, edit, and manage blog content</p>
          </div>
          <Button size="lg">
            <Plus className="mr-2 w-4 h-4" />
            New Post
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <Input
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Posts Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Blog Posts ({filteredPosts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Title
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Author
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post) => (
                    <tr
                      key={post.id}
                      className="border-b border-border hover:bg-muted/50 transition"
                    >
                      <td className="py-3 px-4">
                        <p className="font-medium text-foreground line-clamp-1">
                          {post.title}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-foreground/70">
                        {post.author}
                      </td>
                      <td className="py-3 px-4 capitalize text-foreground/70">
                        {post.category}
                      </td>
                      <td className="py-3 px-4 text-xs text-foreground/70">
                        {new Date(post.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            post.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleTogglePublish(post.id)}
                            title={
                              post.status === 'published'
                                ? 'Unpublish'
                                : 'Publish'
                            }
                          >
                            {post.status === 'published' ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(post.id)}
                            className="text-destructive hover:text-destructive"
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
                <p className="text-foreground/70">No blog posts found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
