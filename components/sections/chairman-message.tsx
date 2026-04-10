import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ChairmanMessage() {
  return (
    <section className="bg-primary/50  py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="overflow-hidden bg-white/90 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Image */}
            <div className="relative h-64 md:h-96 w-full rounded-lg">
              <Image
                src="/lgaChairman (1).png"
                alt="Chairman IGSL"
                fill
                className="object-cover rounded-tr-[20px] rounded-br-[20px]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Message */}
            <CardContent className="pt-8 md:pt-0 text-gray-700">
              <div className="mb-4">
                <h3 className="text-sm font-semibold  uppercase tracking-wider mb-2">
                  A Message From
                </h3>
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                  Hon. Bar. Ugo Ferdinand Ukwueze
                </h2>
                <p className="text-gray-500 font-medium mb-4">
                  Chairman, IGSL
                </p>
              </div>

              <p className=" leading-relaxed mb-6">
                Welcome to the official portal of our local government. We are committed to serving our community with integrity, transparency, and dedication. Through this platform, we strive to make government services more accessible and keep our citizens informed about development initiatives across our jurisdiction.
              </p>

              <p className=" leading-relaxed mb-8">
                Our administration believes in collaborative governance where citizens actively participate in the development process. We encourage you to engage with us through our various services, attend public forums, and contribute ideas for the betterment of our community.
              </p>

              <Link href="/about">
                <Button className="bg-primary hover:bg-primary/90">
                  Learn More About Our Vision
                </Button>
              </Link>
            </CardContent>
          </div>
        </Card>
      </div>
    </section>
  )
}
