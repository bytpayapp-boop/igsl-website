'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { mockArchiveItems } from '@/lib/mock-data'
import { Edit, Trash2, Plus } from 'lucide-react'

export default function ArchiveManagementPage() {
  const [items, setItems] = useState(mockArchiveItems)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Archive Management</h1>
            <p className="text-foreground/70">Manage government documents and records</p>
          </div>
          <Button size="lg">
            <Plus className="mr-2 w-4 h-4" />
            Add Document
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <Input
              placeholder="Search archive items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition">
              <div className="relative h-40 bg-muted overflow-hidden">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <CardContent className="pt-4">
                <div className="mb-3">
                  <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
                    {item.title}
                  </h3>
                  <div className="flex gap-2 mb-2">
                    <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded capitalize">
                      {item.category}
                    </span>
                    <span className="text-xs text-foreground/60">{item.year}</span>
                  </div>
                </div>
                <p className="text-sm text-foreground/70 line-clamp-2 mb-4">
                  {item.description}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="mr-1 w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground/70">No archive items found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
