'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { Button, Input } from '@valore/ui'
import { staggerContainer, staggerItem } from '@valore/ui'

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    details: '+1 (438) 680-3936',
    href: 'tel:+14386803936',
    description: '24/7 Premium Support'
  },
  {
    icon: Mail,
    title: 'Email',
    details: 'flyrentalsca@gmail.com',
    href: 'mailto:flyrentalsca@gmail.com',
    description: 'Quick Response Guaranteed'
  },
  {
    icon: MapPin,
    title: 'Location',
    details: 'Montreal, Quebec',
    href: '/contact',
    description: 'Our Premium Showroom'
  },
  {
    icon: Clock,
    title: 'Hours',
    details: '24/7 Service',
    href: '/contact',
    description: 'Always Available for You'
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Simulate API call - replace with actual email service
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Here you would typically send the data to your email service
      // For now, we'll just simulate success
      console.log('Contact form submitted:', formData)
      
      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-black via-slate-900 to-black py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="heading-large text-white mb-4">Contact Us</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Get in touch with our luxury car rental experts. We're here to provide you with 
              exceptional service and make your dream car experience a reality.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800">
              <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-primary focus:ring-primary"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-primary focus:ring-primary"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-primary focus:ring-primary"
                      placeholder="+1 (438) 680-3936"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Subject *
                    </label>
                    <Input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-primary focus:ring-primary"
                      placeholder="How can we help you?"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                    placeholder="Tell us about your luxury car rental needs..."
                  />
                </div>

                {/* Submit Status */}
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 bg-green-900/20 border border-green-700 rounded-lg"
                  >
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <p className="text-green-400">Thank you! Your message has been sent successfully.</p>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 bg-red-900/20 border border-red-700 rounded-lg"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-red-400">Something went wrong. Please try again.</p>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      Send Message
                    </div>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
              <p className="text-slate-300 leading-relaxed mb-8">
                Experience the pinnacle of luxury car rental service. Our dedicated team is here 
                to provide you with personalized attention and ensure your journey exceeds expectations.
              </p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              {contactInfo.map((contact, index) => (
                <motion.div key={index} variants={staggerItem}>
                  <a
                    href={contact.href}
                    className="flex items-start gap-4 p-6 bg-slate-900/30 rounded-xl border border-slate-800 hover:border-primary/50 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                      <contact.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{contact.title}</h3>
                      <p className="text-primary font-medium mb-1">{contact.details}</p>
                      <p className="text-sm text-slate-400">{contact.description}</p>
                    </div>
                  </a>
                </motion.div>
              ))}
            </motion.div>

            {/* Additional Info */}
            <div className="bg-gradient-to-br from-primary/10 to-transparent rounded-2xl p-8 border border-primary/20">
              <h3 className="text-xl font-bold text-white mb-4">Why Choose Valore?</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>24/7 Premium Customer Support</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Fully Insured Luxury Vehicles</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Professional Delivery Service</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Flexible Booking Options</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Competitive Pricing</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>


    </div>
  )
}
