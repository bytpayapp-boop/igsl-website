import { Navbar } from '@/components/common/navbar'
import { Footer } from '@/components/common/footer'
import { HeroSection } from '@/components/sections/hero-section'
import { ServicesSection } from '@/components/sections/services-section'
import { StatsSection } from '@/components/sections/stats-section'
import { ChairmanMessage } from '@/components/sections/chairman-message'
import { AnnouncementsSection } from '@/components/sections/announcements-section'

export const metadata = {
  title: 'IGSL Government Portal',
  description: 'Official portal for Igbo-Eze South Local Government services including identification, birth certificates, and community information.',
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        {/* <ServicesSection /> */}
         <ChairmanMessage />
        <StatsSection />
       
        <AnnouncementsSection />
      </main>
      <Footer />
    </div>
  )
}
