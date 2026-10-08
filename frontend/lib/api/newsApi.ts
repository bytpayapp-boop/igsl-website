import { BlogPost } from '@/lib/types'
import { getBackendUrl } from '@/lib/api/backendUrl'

function normalizeNewsItem(item: any): BlogPost | null {
  if (!item || !item.title) return null

  const coverImage =
    item.coverImageUrl ||
    item.coverImage ||
    (Array.isArray(item.galleryImages) && item.galleryImages[0]?.fileUrl) ||
    '/blog-1.png'

  const tagList = Array.isArray(item.tags)
    ? item.tags
    : typeof item.tags === 'string'
      ? item.tags
          .split(',')
          .map((tag: string) => tag.trim())
          .filter(Boolean)
      : []

  return {
    id: String(item.id),
    title: String(item.title),
    slug: String(item.slug || item.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'news-item'),
    coverImage,
    content: String(item.content || item.description || ''),
    category: String(item.category || 'announcements'),
    tags: tagList,
    author: String(item.author || 'IGSL Communications'),
    date: new Date(item.date || item.createdAt || Date.now()),
    status: 'published',
  }
}

async function fetchNewsResponse() {
  const response = await fetch(`${getBackendUrl()}/api/news`, {
    cache: 'no-store',
    next: { revalidate: 0 },
  })

  if (!response.ok) {
    return []
  }

  const payload = await response.json().catch(() => ({ data: [] }))
  const items = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : []

  return items
    .map((item) => normalizeNewsItem(item))
    .filter((item): item is BlogPost => Boolean(item))
}

export async function fetchNews(): Promise<BlogPost[]> {
  return fetchNewsResponse()
}

export async function fetchNewsBySlug(slug: string): Promise<BlogPost | null> {
  const articles = await fetchNewsResponse()
  return articles.find((article) => article.slug === slug) ?? null
}
