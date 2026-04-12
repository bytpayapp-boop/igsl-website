import Image from 'next/image'
import { GalleryItem } from '@/lib/types'
import { format } from 'date-fns'

interface GalleryCardProps {
  item: GalleryItem
  onClick?: () => void
}

export function GalleryCard({ item, onClick }: GalleryCardProps) {
  return (
    <div
      className="relative group overflow-hidden rounded-lg cursor-pointer bg-muted h-48 md:h-56 lg:h-64"
      onClick={onClick}
    >
      <Image
        src={item.image}
        alt={item.title}
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-300"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <h3 className="font-bold text-primary-foreground text-lg">{item.title}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs font-medium bg-accent/90 text-primary px-2 py-1 rounded capitalize">
            {item.category}
          </span>
          <span className="text-xs text-primary-foreground/80">
            {format(item.date, 'MMM d, yyyy')}
          </span>
        </div>
      </div>
    </div>
  )
}
