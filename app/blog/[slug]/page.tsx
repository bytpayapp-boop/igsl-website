import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { mockBlogPosts } from '@/lib/mock-data'
import { BlogCard } from '@/components/cards/blog-card'
import { ChevronLeft, Calendar, User, Tag } from 'lucide-react'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'

export async function generateStaticParams() {
  return mockBlogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export default function BlogDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = mockBlogPosts.find((p) => p.slug === params.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = mockBlogPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <Link href="/blog">
          <Button variant="ghost" className="mb-6 -ml-2">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to News
          </Button>
        </Link>

        {/* Article */}
        <article className="mb-12">
          {/* Featured Image */}
          <div className="relative w-full h-96 bg-muted rounded-lg overflow-hidden mb-8">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-6">
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/70">
              <span className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded capitalize font-medium">
                <Tag className="w-4 h-4" />
                {post.category}
              </span>
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {format(post.date, 'MMMM d, yyyy')}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
              {post.title}
            </h1>

            {/* Content */}
            <Card className="border-border bg-secondary/5">
              <CardContent className="pt-8">
                <div className="prose prose-sm max-w-none text-foreground/80 leading-relaxed space-y-4">
                  <p>{post.content}</p>
                  <p>
                    This announcement is part of our commitment to keeping the community informed about important government initiatives and developments. For more information, please visit our offices during business hours or contact us through the communication channels listed on our website.
                  </p>
                  <p>
                    We welcome your feedback and suggestions on how we can continue to improve our services and communication with the public.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div>
                <p className="text-sm font-medium text-foreground/70 mb-3">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-2 bg-muted px-3 py-1 rounded text-sm text-foreground/70 capitalize"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="border-t border-border pt-12">
            <h2 className="text-2xl font-bold text-primary mb-6">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relPost) => (
                <BlogCard key={relPost.id} post={relPost} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
