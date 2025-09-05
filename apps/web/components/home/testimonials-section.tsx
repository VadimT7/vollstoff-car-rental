'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import Image from 'next/image'
import { Button, Card } from '@valore/ui'
import { cn } from '@valore/ui'

// Mock testimonials - in production these would come from Sanity CMS
const testimonials = [
  {
    id: '1',
    authorName: 'Alexander Chen',
    authorTitle: 'CEO, Tech Innovations',
    content: 'Exceptional service from start to finish. The Mercedes CLA AMG was immaculate, and the delivery to my hotel was seamless. FlyRentals sets the standard for luxury car rentals.',
    rating: 5,
    carModel: 'Lamborghini Huracán EVO',
    authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  },
  {
    id: '2',
    authorName: 'Isabella Martinez',
    authorTitle: 'Fashion Designer',
    content: 'The Mercedes C43 AMG was perfect for my photoshoot in Monaco. The team at FlyRentals understood exactly what I needed and went above and beyond to accommodate my schedule.',
    rating: 5,
    carModel: 'BMW M8 Competition',
    authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  },
  {
    id: '3',
    authorName: 'James Wellington',
    authorTitle: 'Private Investor',
    content: "I've rented luxury cars worldwide, but FlyRentals' attention to detail is unmatched. The Porsche Cayenne was pristine, and their concierge service made everything effortless.",
    rating: 5,
    carModel: 'Mercedes-AMG G63',
    authorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
  },
  {
    id: '4',
    authorName: 'Sophia Laurent',
    authorTitle: 'Art Gallery Director',
    content: "Driving the CLA AMG along the St-Laurent river was a dream come true. FlyRentals' team curated the perfect route and even arranged a private lunch at a vineyard.",
    rating: 5,
    carModel: 'Ferrari F8 Tributo',
    authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  const current = testimonials[currentIndex]

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <p className="text-luxury text-primary mb-4">Client Experiences</p>
        <h2 className="heading-large mb-4">Voices of Excellence</h2>
        <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
          Discover why discerning individuals choose FlyRentals for their luxury automotive experiences
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto">
        <Card className="relative overflow-hidden">
          <div className="grid md:grid-cols-5 gap-8 p-8 lg:p-12">
            {/* Author info */}
            <div className="md:col-span-2 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <div className="relative w-32 h-32 mx-auto md:mx-0 mb-4">
                  <Image
                    src={current.authorImage}
                    alt={current.authorName}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <h3 className="text-xl font-medium mb-1">{current.authorName}</h3>
                <p className="text-neutral-600 text-sm">{current.authorTitle}</p>
                <p className="text-sm text-primary mt-2">{current.carModel}</p>
              </motion.div>
              
              {/* Rating */}
              <div className="flex gap-1 justify-center md:justify-start mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-primary fill-primary" />
                ))}
              </div>
            </div>

            {/* Testimonial content */}
            <div className="md:col-span-3 flex flex-col justify-center">
              <Quote className="h-12 w-12 text-primary/20 mb-4" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-lg leading-relaxed text-neutral-700 italic">
                    "{current.content}"
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between p-6 border-t border-neutral-100">
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    'h-2 w-2 rounded-full transition-all duration-300',
                    index === currentIndex
                      ? 'bg-primary w-8'
                      : 'bg-neutral-300 hover:bg-neutral-400'
                  )}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={handlePrevious}
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={handleNext}
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
