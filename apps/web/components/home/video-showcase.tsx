'use client'

import { motion } from 'framer-motion'
import { Play, Instagram } from 'lucide-react'
import { Button } from '@valore/ui'

export function VideoShowcase() {
  return (
    <section className="section-spacing bg-black text-white overflow-hidden">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-luxury text-primary mb-4">Cinematic Experience</p>
          <h2 className="heading-large mb-4">See Our Fleet in Action</h2>
          <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
            Watch our luxury vehicles in their natural habitat - the open road
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* First Video - CLA AMG */}
          <motion.div
            initial={{ opacity: 0, x: -200 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative group"
          >
            <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-slate-900">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/AudiS5-Video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              
              {/* Overlay content */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Instagram className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Audi S5</p>
                    <p className="text-xs text-neutral-300">A Showcase of Excellence and Luxury</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Second Video - Lamborghini */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative group"
          >
            <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-slate-900">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/lamborghini-driving2.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              
              {/* Overlay content */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Instagram className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Luxury and Pure Wealth</p>
                    <p className="text-xs text-neutral-300">Get behind the wheel you deserve to drive</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <a 
            href="https://www.instagram.com/vollstoff.rentals/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button 
              size="xl" 
              className="min-w-[250px] h-15 px-9 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-luxury hover:shadow-luxury-hover border-0 hover:scale-105 transition-all duration-300 [&>span]:text-base [&>span]:font-semibold"
              shimmer
              rightIcon={<Play className="h-4 w-4" />}
            >
              Watch More on Instagram
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
