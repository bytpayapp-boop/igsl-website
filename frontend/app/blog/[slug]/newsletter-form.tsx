'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = () => {
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <div className="mt-12 bg-gradient-to-r from-accent/10 to-green-600/10 border border-accent/30 rounded-lg p-8">
      <h3 className="text-xl font-bold text-primary mb-2">Stay Updated</h3>
      <p className="text-foreground/70 mb-4">
        Get the latest news and announcements delivered directly to your inbox.
      </p>
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubscribe()}
          className="flex-1"
        />
        <Button 
          className="bg-accent hover:bg-accent/90"
          onClick={handleSubscribe}
        >
          Subscribe
        </Button>
      </div>
      {subscribed && (
        <p className="text-sm text-green-600 mt-2">✓ Thanks for subscribing!</p>
      )}
    </div>
  )
}
