'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
   
    { href: '/services/identification', label: 'Services' },
    { href: '/archive', label: 'Archive' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/blog', label: 'News' },
    
  ]

  return (
    <nav className="sticky top-0 z-500 bg-primary/30 backdrop-blur-md  text-primary-foreground shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 font-bold text-xl hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1 shadow-md">
              <img 
                src="/coatOfArm.png" 
                alt="Nigerian Coat of Arms" 
                className="w-10 h-10"
              />
            </div>
            <span className="sm:inline text-gray-700 dark:text-gray-300">IGSL</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button  className="text-primary-foreground hover:translate-y-[4px] cursor-pointer hover:bg-white transition-all hover:text-green-600">
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Auth Links */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/auth/register">
              <Button className="text-primary-foreground bg-transparent hover:bg-white/20">
                Login
              </Button>
            </Link>
            <Link href="/admin">
              <Button className="border border-white bg-white text-primary hover:bg-primary hover:text-white">
                Staff
              </Button>
            </Link>
            {/* <Link href="/admin">
              <Button className="border border-white bg-transparent text-white hover:bg-orange-600">
                Staff
              </Button>
            </Link> */}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-primary-foreground/10"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-primary-foreground/20">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 hover:bg-primary-foreground/10 rounded-md transition"
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 py-2 space-y-2">
              <Link href="/auth/login">
                <Button className="w-full text-primary-foreground bg-green-600 hover:bg-green-700">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="w-full border border-green-600 bg-white text-green-600 hover:bg-green-50">
                  Sign Up
                </Button>
              </Link>
              <Link href="/admin">
                <Button className="w-full border border-orange-600 bg-orange-600/10 text-orange-600 hover:bg-orange-600/20">
                  Staff Portal
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
