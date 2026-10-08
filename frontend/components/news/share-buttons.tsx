'use client'

import { Button } from '@/components/ui/button'
import { Facebook, Link as LinkIcon, MessageCircle, X } from 'lucide-react'
import { toast } from 'sonner'

interface ShareButtonsProps {
  articleUrl: string
  postTitle: string
  postContent: string
}

export function ShareButtons({ articleUrl, postTitle, postContent }: ShareButtonsProps) {
  const shareText = encodeURIComponent(`${postTitle}\n${postContent}`)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl)
      toast.success('Link copied')
    } catch {
      toast.error('Unable to copy link')
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-foreground/60">Share:</span>
      <div className="flex items-center gap-1">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}&quote=${encodeURIComponent(postTitle)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            size="sm"
            variant="ghost"
            className="text-foreground/60 hover:text-blue-600 hover:bg-blue-600/10"
            title="Share on Facebook"
            type="button"
          >
            <Facebook className="w-4 h-4" />
          </Button>
        </a>

        <a
          href={`https://x.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(articleUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            size="sm"
            variant="ghost"
            className="text-foreground/60 hover:text-blue-500 hover:bg-blue-500/10"
            title="Share on X"
            type="button"
          >
            <X className="w-4 h-4" />
          </Button>
        </a>

        <a
          href={`https://wa.me/?text=${encodeURIComponent(`${postTitle}\n\n${postContent}\n\n${articleUrl}`)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            size="sm"
            variant="ghost"
            className="text-foreground/60 hover:text-green-600 hover:bg-green-600/10"
            title="Share on WhatsApp"
            type="button"
          >
            <MessageCircle className="w-4 h-4" />
          </Button>
        </a>

        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopyLink}
          className="text-foreground/60 hover:text-green-600 hover:bg-green-600/10"
          title="Copy link"
          type="button"
        >
          <LinkIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
