'use client'

import { motion } from 'framer-motion'
import { 
  Star, 
  Shield, 
  Award, 
  Users, 
  MapPin, 
  Phone, 
  Mail,
  Car,
  Clock,
  CheckCircle,
  TrendingUp,
  Heart
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@valore/ui'
import { staggerContainer, staggerItem } from '@valore/ui'

const stats = [
  { icon: Car, value: '10+', label: 'Luxury Vehicles' },
  { icon: Users, value: '700+', label: 'Happy Clients' },
  { icon: Star, value: '5.0', label: 'Customer Rating' },
  { icon: Award, value: '3+', label: 'Years Experience' },
]

const values = [
  {
    icon: Shield,
    title: 'Premium Safety',
    description: 'All our vehicles undergo rigorous safety inspections and are fully insured for your peace of mind.',
  },
  {
    icon: Star,
    title: 'Exceptional Service',
    description: 'Our dedicated team provides personalized attention and 24/7 support throughout your rental experience.',
  },
  {
    icon: Heart,
    title: 'Passion for Excellence',
    description: 'We\'re passionate about delivering the finest luxury vehicles and creating unforgettable experiences.',
  },
  {
    icon: TrendingUp,
    title: 'Continuous Innovation',
    description: 'We constantly update our fleet with the latest luxury models and cutting-edge technology.',
  },
]

const team = [
  {
    name: 'Alexandre Dubois',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    bio: 'Former racing driver with 15+ years in luxury automotive industry.',
  },
  {
    name: 'Sophie Tremblay',
    role: 'Operations Director',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    bio: 'Expert in premium customer service and fleet management.',
  },
  {
    name: 'Marc Lavoie',
    role: 'Head of Fleet',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    bio: 'Certified mechanic specializing in exotic and luxury vehicles.',
  },
]

const milestones = [
  {
    year: '2022',
    title: 'Company Founded',
    description: 'Started with a single Mercedes CLA in Montreal, establishing FlyRentals as the premier luxury car rental service.',
  },
  {
    year: '2023',
    title: 'Fleet Expansion & Showroom',
    description: 'Grew to 5 luxury vehicles and opened our first state-of-the-art showroom in downtown Montreal.',
  },
  {
    year: '2024',
    title: 'Premium Service Launch',
    description: 'Introduced 24/7 concierge service, nationwide delivery, and launched our advanced booking platform.',
  },
  {
    year: '2024',
    title: 'Industry Recognition',
    description: 'Awarded "Best Luxury Car Rental" in Quebec and "Excellence in Customer Service" by the Canadian Tourism Board.',
  },
  {
    year: '2025',
    title: 'Digital Innovation & Expansion',
    description: 'Launched mobile app, introduced AI-powered vehicle recommendations, and expanded to serve all major Canadian cities.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-black via-slate-900 to-black py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70" />
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="heading-large mb-4">
              <span 
                className="bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent"
                style={{
                  textShadow: '0 0 80px rgba(251, 191, 36, 0.3)'
                }}
              >
                About FlyRentals
              </span>
            </h1>
            <p className="text-xl text-neutral-300 max-w-3xl mx-auto font-light">
              Montreal's premier luxury car rental service, delivering exceptional experiences 
              with the world's most prestigious vehicles since 2022.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div key={index} variants={staggerItem} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</div>
                <div className="text-slate-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="heading-medium text-slate-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  Founded in 2022 in the heart of Montreal, FlyRentals began with a simple vision: 
                  to make luxury automotive experiences accessible to discerning clients who appreciate 
                  the finest things in life.
                </p>
                <p>
                  What started with a single Lamborghini has grown into Quebec's most prestigious 
                  luxury car rental service, featuring an exclusive collection of supercars, luxury 
                  sedans, and exotic vehicles from the world's most renowned manufacturers.
                </p>
                <p>
                  Based in Montreal, we serve clients across Quebec and beyond, providing not just 
                  vehicle rentals, but complete luxury experiences that exceed expectations and create 
                  lasting memories.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop"
                  alt="Luxury cars in Montreal"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-luxury-lg p-6">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold text-slate-900">Montreal, Quebec</p>
                    <p className="text-sm text-slate-600">Our Home Base</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="heading-medium text-slate-900 mb-4">Our Values</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              The principles that guide everything we do and every experience we create.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => (
              <motion.div key={index} variants={staggerItem}>
                <div className="bg-slate-50 rounded-2xl p-8 h-full">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">{value.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="heading-medium text-slate-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              The passionate professionals behind FlyRentals' success.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {team.map((member, index) => (
              <motion.div key={index} variants={staggerItem}>
                <div className="bg-white rounded-2xl shadow-luxury-lg overflow-hidden">
                  <div className="relative h-64">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-slate-900 mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">{member.role}</p>
                    <p className="text-slate-600 text-sm leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="heading-medium text-slate-900 mb-4">Our Journey</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              A journey of growth, innovation, and excellence in luxury car rental from 2022 to today.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-slate-200" />
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex items-center ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-slate-50 rounded-xl p-6">
                      <div className="text-2xl font-bold text-primary mb-2">{milestone.year}</div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">{milestone.title}</h3>
                      <p className="text-slate-600">{milestone.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-primary rounded-full border-4 border-white shadow-lg" />
                  </div>
                  
                  <div className="w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-black via-slate-900 to-black relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-medium text-white mb-4 drop-shadow-lg">Ready to Experience Luxury?</h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto drop-shadow-md">
              Join thousands of satisfied clients who have experienced the FlyRentals difference. 
              Book your luxury vehicle today and discover why we're Montreal's premier choice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/fleet">
                <Button size="lg" className="bg-white hover:bg-slate-100 text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  Explore Our Fleet
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" className="border-2 border-white text-white hover:bg-white hover:text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
