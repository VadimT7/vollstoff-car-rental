'use client'

import { motion } from 'framer-motion'
import { Car, Camera, Users, Globe } from 'lucide-react'
import Image from 'next/image'
import { Card } from '@valore/ui'
import { staggerContainer, staggerItem } from '@valore/ui'

const services = [
  {
    icon: Car,
    title: 'Self-Drive Excellence',
    description: 'Take the wheel of automotive perfection with our comprehensive insurance and 24/7 support',
    image: '/SF90-1.jpg',
  },
  {
    icon: Users,
    title: 'Chauffeur Service',
    description: 'Professional drivers trained to deliver comfort and discretion for your journey',
    image: '/Mercedes-Benz-S580-1.jpg',
  },
  {
    icon: Camera,
    title: 'Photoshoot Package',
    description: 'Capture your experience with professional photographers and stunning locations',
    image: '/Bentley Continental Speed W12 - 1.jpg',
  },
  {
    icon: Globe,
    title: 'Curated Experiences',
    description: 'Exclusive driving routes, private track days, and bespoke automotive adventures',
    image: '/Rolls-Royce-Dawn.jpg',
  },
]

export function ServicesSection() {
  return (
    <section className="section-spacing">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-luxury text-primary mb-4">Beyond the Drive</p>
          <h2 className="heading-large mb-4">Exceptional Services</h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Elevate your experience with our suite of premium services designed for the most discerning clientele
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-2 gap-8"
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={staggerItem}>
              <Card className="group h-full overflow-hidden" padding="none">
                <div className="grid lg:grid-cols-2 h-full">
                  {/* Image */}
                  <div className="relative h-64 lg:h-auto">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                  </div>
                  
                  {/* Content */}
                  <div className="p-8 lg:p-10 flex flex-col justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-display mb-3">{service.title}</h3>
                    <p className="text-neutral-600 leading-relaxed">{service.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
