import Link from 'next/link'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-primary/20 text-gray-700 dark:text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Organization Info */}
          <div>
            <h3 className="font-bold text-xl mb-4">IGSL</h3>
            <p className="text-sm ">
              Serving our community with integrity, transparency, and commitment to development.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-accent transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-accent transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services/identification" className="hover:text-accent transition">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-accent transition">
                  News
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone size={16} className="mt-0.5 flex-shrink-0" />
                <span>+234-800-123-4567</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-0.5 flex-shrink-0" />
                <span>info@igsl.gov</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>Government House, IGSL</span>
              </li>
            </ul>
          </div>

          {/* Office Hours */}
          <div>
            <h4 className="font-semibold mb-4">Office Hours</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Clock size={16} className="mt-0.5 flex-shrink-0" />
                <div>
                  <div>Monday - Friday</div>
                  <div className="">8:00 AM - 5:00 PM</div>
                </div>
              </li>
              <li className="font-semibold">
                Closed on weekends and public holidays
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm font-semibold">
            <p>&copy; 2024 IGSL - Enugu State. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-accent transition">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-accent transition">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-accent transition">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
