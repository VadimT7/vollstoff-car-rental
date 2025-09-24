import { Suspense } from 'react'
import { HeroSection } from '@/components/home/hero-section'
import { FeaturedFleet } from '@/components/home/featured-fleet'
import { ExperienceSection } from '@/components/home/experience-section'
import { VideoShowcase } from '@/components/home/video-showcase'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { ServicesSection } from '@/components/home/services-section'
import { CTASection } from '@/components/home/cta-section'
import { InstantBooking } from '@/components/booking/instant-booking'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <>
      {/* Hero with 3D car showcase */}
      <HeroSection />
      
      {/* Instant booking widget */}
      <section className="relative z-10 -mt-32">
        <div className="container-luxury">
          <Suspense fallback={<LoadingSpinner />}>
            <InstantBooking />
          </Suspense>
        </div>
      </section>
      
      {/* Featured fleet */}
      <section className="section-spacing relative z-20">
        <div className="container-luxury">
          <Suspense fallback={<LoadingSpinner />}>
            <FeaturedFleet />
          </Suspense>
        </div>
      </section>
      
      {/* Experience section */}
      <ExperienceSection />
      
      {/* Video Showcase */}
      <VideoShowcase />
      
      {/* Services */}
      <ServicesSection />
      
      {/* Testimonials */}
      <section className="section-spacing bg-neutral-50">
        <div className="container-luxury">
          <Suspense fallback={<LoadingSpinner />}>
            <TestimonialsSection />
          </Suspense>
        </div>
      </section>
      
      {/* CTA */}
      <CTASection />
    </>
  )
}
