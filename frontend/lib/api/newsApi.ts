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

async function fetchNewsResponse(page = 1, limit = 0) {
  const url = new URL(`${getBackendUrl()}/api/news`)
  url.searchParams.set('type', 'NEWS')
  url.searchParams.set('page', String(page))
  if (limit > 0) {
    url.searchParams.set('limit', String(limit))
  }

  const response = await fetch(url.toString(), {
    cache: 'no-store',
    next: { revalidate: 0 },
  })

  if (!response.ok) {
    return { items: [], page, totalPages: 1, total: 0 }
  }

  const payload = await response.json().catch(() => ({ data: [], page, totalPages: 1, total: 0 }))
  const items = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : []

  return {
    items: items
      .map((item) => normalizeNewsItem(item))
      .filter((item): item is BlogPost => Boolean(item)),
    page: Number(payload?.page ?? page) || page,
    totalPages: Number(payload?.totalPages ?? 1) || 1,
    total: Number(payload?.total ?? items.length) || 0,
  }
}

export async function fetchNews(page = 1, limit = 0): Promise<BlogPost[]> {
  const { items } = await fetchNewsResponse(page, limit)
  return items
}

export async function fetchPaginatedNews(page = 1, limit = 0) {
  return fetchNewsResponse(page, limit)
}

export async function fetchNewsBySlug(slug: string): Promise<BlogPost | null> {
  const { items } = await fetchNewsResponse(1, 0)
  return items.find((article) => article.slug === slug) ?? null
}
