'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getBackendUrl } from '@/lib/api/backendUrl'
import { Download, FileText, Plus, Search } from 'lucide-react'

interface ArchiveDocument {
  id: string
  title: string
  description: string
  category: string
  year: number
  documentUrl: string
  fileName: string
  mimeType: string
}

export default function ArchiveManagementPage() {
  const router = useRouter()
  const [items, setItems] = useState<ArchiveDocument[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchArchiveItems = async () => {
      try {
        const response = await fetch(`${getBackendUrl()}/api/archive`, { cache: 'no-store' })
        const payload = await response.json().catch(() => ({ data: [] }))

        if (!response.ok) {
          throw new Error(payload?.message || 'Failed to fetch archive documents')
        }

        if (isMounted) {
          setItems(Array.isArray(payload?.data) ? payload.data : [])
        }
      } catch (error) {
        console.error('Failed to load archive documents:', error)
        if (isMounted) {
          setItems([])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchArchiveItems()
    return () => {
      isMounted = false
    }
  }, [])

  const filteredItems = useMemo(() => {
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [items, searchTerm])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold  mb-2">Archive Management</h1>
            <p className="text-foreground/70">Manage government documents and records</p>
          </div>
          <Button size="lg"
          className='-mt-34 md:mt-0' 
          onClick={() => router.push('/admin/archive/new')}>
            <Plus className="mr-2 w-4 h-4" />
            Add Document
          </Button>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-foreground/40" />
              <Input
                placeholder="Search archive items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="text-center py-12 text-foreground/70">Loading documents…</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-foreground/70">No archive items found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition">
                <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-muted p-3">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded capitalize">
                          {item.category}
                        </span>
                        <span className="text-xs text-foreground/60">{item.year}</span>
                      </div>
                      <p className="text-sm text-foreground/70 line-clamp-2">{item.description}</p>
                      <p className="text-xs text-foreground/50 mt-1">{item.fileName}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <Button asChild variant="outline">
                      <a href={item.documentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center">
                        <Download className="mr-2 w-4 h-4" />
                        Open
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
