import Link from 'next/link'
import { BlogCard } from '@/components/cards/blog-card'
import { Button } from '@/components/ui/button'
import { mockBlogPosts } from '@/lib/mock-data'

export function AnnouncementsSection() {
  const featuredPosts = mockBlogPosts.slice(0, 3)

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            Latest News & Announcements
          </h2>
          <p className="text-lg text-foreground/70">
            Stay updated with recent government activities and important announcements
          </p>
        </div>
        <Link href="/blog">
          <Button variant="outline" className="hidden md:inline-flex">
            View All News
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {featuredPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      <div className="flex justify-center md:hidden">
        <Link href="/blog">
          <Button>View All News</Button>
        </Link>
      </div>
    </section>
  )
}
