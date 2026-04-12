import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { mockArchiveItems } from '@/lib/mock-data'
import { ChevronLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return mockArchiveItems.map((item) => ({
    slug: item.slug,
  }))
}

export default function ArchiveDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const item = mockArchiveItems.find((i) => i.slug === params.slug)

  if (!item) {
    notFound()
  }

  const relatedItems = mockArchiveItems
    .filter((i) => i.id !== item.id && i.category === item.category)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <Link href="/archive">
          <Button variant="ghost" className="mb-6 -ml-2">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Archive
          </Button>
        </Link>

        {/* Article */}
        <article className="mb-12">
          {item.image && (
            <div className="relative w-full h-96 bg-muted rounded-lg overflow-hidden mb-8">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="space-y-6">
            {/* Meta */}
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-sm font-medium bg-accent/10 text-accent px-3 py-1 rounded capitalize">
                {item.category}
              </span>
              <span className="text-sm text-foreground/60">{item.year}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-primary">{item.title}</h1>

            {/* Description */}
            <p className="text-xl text-foreground/80 leading-relaxed">
              {item.description}
            </p>

            {/* Content */}
            <Card className="border-border bg-secondary/5">
              <CardContent className="pt-8">
                <div className="prose prose-sm max-w-none text-foreground/80 leading-relaxed">
                  <p>{item.content}</p>
                  <p className="mt-4">
                    For more information about this archival item or to request official documentation, please contact our Records Department at{' '}
                    <a href="tel:+234-800-567-8901" className="text-accent font-medium">
                      +234-800-567-8901
                    </a>{' '}
                    or email{' '}
                    <a href="mailto:records@igsl.gov" className="text-accent font-medium">
                      records@igsl.gov
                    </a>
                    .
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </article>

        {/* Related Items */}
        {relatedItems.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-primary mb-6">
              Related Archive Items
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedItems.map((relItem) => (
                <Link key={relItem.id} href={`/archive/${relItem.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden cursor-pointer border-border hover:border-accent">
                    {relItem.image && (
                      <div className="relative w-full h-40 bg-muted">
                        <Image
                          src={relItem.image}
                          alt={relItem.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="pt-4">
                      <span className="text-xs font-medium bg-accent/10 text-accent px-2 py-1 rounded capitalize inline-block mb-2">
                        {relItem.category}
                      </span>
                      <h3 className="font-bold text-primary line-clamp-2">
                        {relItem.title}
                      </h3>
                      <p className="text-sm text-foreground/70 line-clamp-2 mt-2">
                        {relItem.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
