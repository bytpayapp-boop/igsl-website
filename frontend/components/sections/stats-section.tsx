'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface StatItemProps {
  number: number
  label: string
  index:number
}

function StatItem({ number, index, label }: StatItemProps) {
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
    <Card className="text-center border-transparent hover:border-green-600/10 relative overflow-hidden hover:shadow-lg transition-all">
      <div className={`absolute h-40 w-40 rounded-full animate-pul group:hover:scale-[1.4] group-hover:-top-10 -left-10 transition-all bg-green-600/10 z-[80] ${index%2==0?'-top-20 -left-20':'-bottom-20 -right-20'} -top-20 -left-20`}/>
      <CardContent className="pt-8 pb-8 z-[100] ">
        <div className="text-4xl md:text-5xl font-bold text-green-600/80 mb-2">
          {count.toLocaleString()}+
        </div>
        <p className="text-foreground/70 text-lg">{label}</p>
      </CardContent>
    </Card>
  )
}

export function StatsSection() {
  const stats = [
    { number: 4500, label: 'Capacity Modern Secretariat Building' },
    { number: 3500, label: 'Youths Trained & Empowered' },
    { number: 2300, label: 'Kilometers of New Asphated Roads' },
    { number: 10000, label: 'Students supported in WAEC & JAMB' },
  ]

  return (
    <section className="bg-white/20 dark:bg-gray-800 bg-gradient-to-br  dark:from-gray-800 dark:via-gray-900 dark:to-gray-200/90 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Our Imapact in Our People
          </h2>
          <p className="text-lg text-foreground/70">
            Serving the community with dedication and excellence
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat,i) => (
            <StatItem key={stat.label} index={i} number={stat.number} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  )
}
