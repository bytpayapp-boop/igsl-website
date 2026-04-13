import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { mockBlogPosts } from '@/lib/mock-data'
import { BlogCard } from '@/components/cards/blog-card'
import { 
  ChevronLeft, 
  Calendar, 
  User, 
  Tag, 
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon
} from 'lucide-react'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import NewsletterForm from './newsletter-form'

export async function generateStaticParams() {
  return mockBlogPosts.map((post) => ({
    slug: post.slug,
  }))
}

// Calculate reading time
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  
  const post = mockBlogPosts.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  const readingTime = calculateReadingTime(post.content)
  const relatedPosts = mockBlogPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 3)
  const baseUrl = 'https://igsl-website.com'
  const articleUrl = `${baseUrl}/blog/${post.slug}`
  const shareTitle = encodeURIComponent(post.title)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative w-full h-[500px] bg-muted overflow-hidden">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        
        {/* Back Button - Overlay */}
        <div className="absolute top-6 left-6 z-20">
          <Link href="/blog">
            <Button 
              variant="ghost" 
              className="bg-black/40 hover:bg-black/60 text-white border-white/20"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to News
            </Button>
          </Link>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-8 sm:p-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="inline-flex items-center gap-2 bg-green-600/40 text-gray-100 px-4 py-2 rounded-full capitalize font-semibold text-sm border border-green-500/30">
                <Tag className="w-4 h-4" />
                {post.category}
              </span>
              <span className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-white/20">
                <Clock className="w-4 h-4" />
                {readingTime} min read
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              {post.title}
            </h1>
            <p className="text-lg text-gray-200 max-w-2xl">
              {post.content.substring(0, 150)}...
            </p>
          </div>
        </div>
      </div>

      {/* Article Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Meta Information */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-8 pb-8 border-b border-border">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-foreground/70">
              <User className="w-4 h-4 text-accent" />
              <span className="font-medium">{post.author}</span>
            </div>
            <div className="flex items-center gap-2 text-foreground/70">
              <Calendar className="w-4 h-4 text-accent" />
              <span>{format(post.date, 'MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2 text-foreground/70">
              <Clock className="w-4 h-4 text-accent" />
              <span>{readingTime} min read</span>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground/60">Share:</span>
            <div className="flex items-center gap-1">
              <a
                href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${articleUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-foreground/60 hover:text-blue-500 hover:bg-blue-500/10"
                  title="Share on Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </Button>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${articleUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-foreground/60 hover:text-blue-600 hover:bg-blue-600/10"
                  title="Share on Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </Button>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${articleUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-foreground/60 hover:text-blue-700 hover:bg-blue-700/10"
                  title="Share on LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </Button>
              </a>
              <Button
                size="sm"
                variant="ghost"
                className="text-foreground/60 hover:text-green-600 hover:bg-green-600/10"
                title="Copy link"
              >
                <LinkIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Article Content - 3 cols */}
          <article className="lg:col-span-3 space-y-6">
            <div className="prose prose-lg max-w-none text-foreground/80 leading-relaxed space-y-6">
              <p className="text-lg font-medium text-foreground/90">
                {post.content}
              </p>
              
              <p className="text-base">
                This announcement is part of our commitment to keeping the community informed about important government initiatives and developments. Our administration believes in transparency and timely communication with all stakeholders.
              </p>

              <div className="bg-accent/5 border-l-4 border-accent px-6 py-4 rounded-r">
                <p className="font-medium text-accent mb-2">💡 Key Takeaway</p>
                <p className="text-sm text-foreground/70">
                  This initiative demonstrates our dedication to public service and community development. We encourage all citizens to take advantage of these programs and services.
                </p>
              </div>

              <p>
                For more detailed information, interested parties can reach out to our office during business hours. We have dedicated staff ready to assist with inquiries and provide additional context about this announcement.
              </p>

              <p>
                We welcome your feedback and suggestions on how we can continue to improve our services and communication with the public. Your input is valuable in helping us serve you better.
              </p>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="pt-6 border-t border-border">
                <p className="text-sm font-semibold text-foreground/70 mb-4">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-2 bg-muted hover:bg-accent/20 px-4 py-2 rounded-full text-sm text-foreground/70 capitalize font-medium transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Newsletter CTA */}
            <NewsletterForm />

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-16 pt-12 border-t border-border">
                <h2 className="text-3xl font-bold text-primary mb-8">
                  Related Articles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedPosts.slice(0, 2).map((relPost) => (
                    <BlogCard key={relPost.id} post={relPost} />
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar - 1 col */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Article Info Card */}
            <Card className="border border-border bg-secondary sticky top-20">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-1">
                      Published
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {format(post.date, 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-1">
                      Reading Time
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {readingTime} minutes
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-1">
                      Category
                    </p>
                    <p className="text-sm font-medium text-accent capitalize">
                      {post.category}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-3">
                      By {post.author}
                    </p>
                    <p className="text-xs text-foreground/60">
                      Official news and updates from IGSL Communications Department
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Latest Articles Widget */}
            {/* <Card className="border border-border bg-secondary">
              <CardContent className="pt-6">
                <h3 className="font-bold text-foreground mb-4">Latest Articles</h3>
                <div className="space-y-3">
                  {mockBlogPosts
                    .filter((p) => p.id !== post.id)
                    .slice(0, 4)
                    .map((article) => (
                      <Link
                        key={article.id}
                        href={`/blog/${article.slug}`}
                        className="block group"
                      >
                        <div className="flex gap-3">
                          <div className="relative h-16 w-20 flex-shrink-0 rounded overflow-hidden bg-muted">
                            <Image
                              src={article.coverImage}
                              alt={article.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-accent capitalize mb-1">
                              {article.category}
                            </p>
                            <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors line-clamp-2">
                              {article.title}
                            </p>
                            <p className="text-xs text-foreground/60 mt-1">
                              {format(article.date, 'MMM d')}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </CardContent>
            </Card> */}
          </aside>
        </div>
      </div>
    </div>
  )
}
