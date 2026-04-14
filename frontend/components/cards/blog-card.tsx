import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { BlogPost } from '@/lib/types'
import { format } from 'date-fns'

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="h-full hover:shadow-lg group transition-shadow overflow-hidden cursor-pointer border-border hover:border-primary/80">
        <div className="relative w-full h-48 bg-muted">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-[1.2] transition-all"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium bg-accent/10 text-accent px-2 py-1 rounded">
              {post.category}
            </span>
            <span className="text-xs text-foreground/60">
              {format(post.date, 'MMM d, yyyy')}
            </span>
          </div>
          <h3 className="font-bold text-primary line-clamp-2">{post.title}</h3>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 dark:text-white/90 line-clamp-2">{post.content}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
