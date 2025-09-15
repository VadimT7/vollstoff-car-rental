'use client'

import Link from 'next/link'
import { 
  Car, 
  Star, 
  Shield, 
  Award, 
  Phone, 
  Mail, 
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube
} from 'lucide-react'
import { Button } from '@valore/ui'

const footerLinks = {
  fleet: [
    { name: 'Supercars', href: '/fleet?category=SUPERCAR' },
    { name: 'Luxury', href: '/fleet?category=LUXURY' },
    { name: 'SUVs', href: '/fleet?category=SUV' },
    { name: 'Sports', href: '/fleet?category=SPORTS' },
    { name: 'Classic', href: '/fleet?category=CLASSIC' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Story', href: '/about/story' },
    { name: 'Team', href: '/about/team' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Insurance', href: '/insurance' },
  ],
}

const socialLinks = [
  { name: 'Facebook', href: '#', icon: Facebook },
  { name: 'Instagram', href: '#', icon: Instagram },
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'LinkedIn', href: '#', icon: Linkedin },
  { name: 'YouTube', href: '#', icon: Youtube },
]

const contactInfo = [
  { icon: Phone, text: '+1 (438) 680-3936', href: 'tel:+14386803936' },
  { icon: Mail, text: 'flyrentalsca@gmail.com', href: 'mailto:flyrentalsca@gmail.com' },
  { icon: MapPin, text: 'Montreal, Quebec', href: '/contact' },
]

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold tracking-wider text-white">
                  FLY
                </span>
                <span className="text-xs tracking-luxury text-slate-400">
                  RENTALS
                </span>
              </div>
            </Link>
            
            <p className="text-slate-400 mb-6 leading-relaxed">
              Experience the pinnacle of automotive luxury with our curated collection of the world's most prestigious vehicles. 
              From exotic supercars to elegant luxury sedans, we deliver exceptional service and unforgettable experiences.
            </p>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">5.0 Rating</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium">Fully Insured</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium">Award Winning</span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              {contactInfo.map((contact, index) => (
                <a
                  key={index}
                  href={contact.href}
                  className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
                >
                  <contact.icon className="w-4 h-4" />
                  {contact.text}
                </a>
              ))}
            </div>
          </div>

          {/* Fleet */}
          <div>
            <h3 className="text-white font-semibold mb-4">Our Fleet</h3>
            <ul className="space-y-2">
              {footerLinks.fleet.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>



          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="max-w-md">
            <h3 className="text-white font-semibold mb-2">Stay Updated</h3>
            <p className="text-sm text-slate-400 mb-4">
              Subscribe to our newsletter for exclusive offers and luxury car updates.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Button className="bg-primary hover:bg-primary/90">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm">
                              <span>&copy; 2025 FlyRentals. All rights reserved.</span>
              <div className="flex items-center gap-4">
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Terms
                </Link>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy
                </Link>
                <Link href="/cookies" className="hover:text-primary transition-colors">
                  Cookies
                </Link>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
