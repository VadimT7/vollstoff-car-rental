'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@valore/ui'
import { cn } from '@valore/ui'

const heroContent = [
  {
    title: 'Redefine\nLuxury',
    subtitle: 'Experience automotive excellence',
  },
  {
    title: 'Unleash\nPower',
    subtitle: 'Feel the thrill of perfection',
  },
  {
    title: 'Command\nPresence',
    subtitle: 'Make every journey memorable',
  },
]

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroContent.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoaded(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  const current = heroContent[currentIndex]

  return (
    <section className="relative h-screen overflow-hidden bg-black">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
          style={{ objectPosition: 'center 30%' }}
        >
          <source src="/lamborghini-driving.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Gradient overlays for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full">
        <div className="container-luxury flex h-full items-center">
          <div className="max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {/* Small heading */}
                <motion.p
                  className="text-luxury text-primary mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  FlyRentals
                </motion.p>

                {/* Main heading */}
                <motion.h1
                  className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-light tracking-luxury uppercase text-white mb-8"
                  style={{ lineHeight: '0.9' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  {current.title.split('\n').map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  className="text-2xl text-neutral-300 mb-12 font-light"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {current.subtitle}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <Link href="/fleet">
                    <Button
                      className="bg-white text-black hover:bg-neutral-100 h-14 px-10 text-base"
                      shimmer
                      rightIcon={<ArrowRight className="h-5 w-5" />}
                    >
                      Book Now


                      
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Slide indicators */}
            <div className="mt-16 flex gap-2">
              {heroContent.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    'h-1 w-12 rounded-full transition-all duration-500',
                    index === currentIndex
                      ? 'bg-white w-24'
                      : 'bg-white/30 hover:bg-white/50'
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="h-8 w-8 text-white/50" />
        </motion.div>
      </div>

      {/* Loading overlay */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            className="absolute inset-0 z-50 bg-black flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="text-center">
              <div className="mb-4">
                <div className="h-px w-32 bg-primary animate-pulse" />
              </div>
              <p className="text-luxury text-white">Loading Experience</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
