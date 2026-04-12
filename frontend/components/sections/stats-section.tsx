'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface StatItemProps {
  number: number
  label: string
}

function StatItem({ number, label }: StatItemProps) {
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
    <Card className="text-center border-border hover:border-accent transition-colors">
      <CardContent className="pt-8 pb-8">
        <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
          {count.toLocaleString()}+
        </div>
        <p className="text-foreground/70 text-lg">{label}</p>
      </CardContent>
    </Card>
  )
}

export function StatsSection() {
  const stats = [
    { number: 45000, label: 'Citizens Served' },
    { number: 8500, label: 'Documents Issued' },
    { number: 2300, label: 'Applications Processed' },
    { number: 12, label: 'Development Projects' },
  ]

  return (
    <section className="bg-secondary/5 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Our Impact
          </h2>
          <p className="text-lg text-foreground/70">
            Serving the community with dedication and excellence
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatItem key={stat.label} number={stat.number} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  )
}
