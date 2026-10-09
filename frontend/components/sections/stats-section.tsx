'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '../ui/button'

interface StatItemProps {
  number: number
  label: string
  image?: string
}

function StatItem({ number, label, image }: StatItemProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (count < number) {
      interval = setInterval(() => {
        setCount((prev) => Math.min(prev + Math.ceil(number / 30), number))
      }, 50)
    }
    return () => clearInterval(interval)
  }, [count, number])

  return (
    <Card className="group text-center border-transparent hover:border-green-600/10 relative overflow-hidden hover:shadow-lg transition-all">
      <div className="absolute h-40 w-40 rounded-full group-hover:scale-[1.8] transition-all bg-green-600/10 z-[80] -bottom-20 -right-20" />
      <CardContent className="pt-8 pb-5 z-[100]">
        <div className="space-y-3">
          <div className="text-4xl md:text-5xl font-bold text-primary">
            {count.toLocaleString()}
          </div>
          <p className="text-foreground/80 text-lg leading-relaxed">{label}</p>
        </div>

        {image ? (
          <div className="mt-5 overflow-hidden rounded-xl border border-green-600/10 bg-muted/20">
            <img
              src={image}
              alt={label}
              loading="lazy"
              className="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

export function StatsSection() {
  const stats = [
    { number: 4500, label: 'Capacity Modern Secretariat Building',img:'projects/buildingProject.jpg' },
    { number: 3500, label: 'Youths Trained & Empowered', img:'projects/aiTraining.jpg' },
      { number: 10000, label: 'Students supported in WAEC & JAMB', img:'projects/jambEmpowerment.jpg'},
    { number: 2300, label: 'Kilometers of New Asphated Roads',img:'projects/roadConstruction.jpg' }
  
  ]

  return (
    <section className="bg-white/20 dark:bg-gray-800 bg-gradient-to-b  from-white via-green-200/10 to-white dark:from-gray-800 dark:via-green-200/20 dark:to-gray-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Our Impacts In Office
          </h2>
          <p className="text-lg text-foreground/70">
            Serving the community with dedication and excellence
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatItem
              key={stat.label}
              number={stat.number}
              label={stat.label}
              image={stat.img}
            />
          ))}
        </div>
        <Button className='mt-4' >See More in Gallery</Button>
      </div>
    </section>
  )
}
