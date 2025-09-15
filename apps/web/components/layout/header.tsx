'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Menu, 
  X, 
  ChevronDown, 
  Phone, 
  Mail, 
  MapPin,
  Car,
  Star,
  Users,
  Shield,
  Award
} from 'lucide-react'
import { Button } from '@valore/ui'
import { cn } from '@valore/ui'
import Image from 'next/image'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Fleet', href: '/fleet' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

const contactInfo = [
  { icon: Phone, text: '+1 (438) 680-3936', href: 'tel:+14386803936' },
  { icon: Mail, text: 'flyrentalsca@gmail.com', href: 'mailto:flyrentalsca@gmail.com' },
  { icon: MapPin, text: 'Montreal, Quebec', href: '/contact' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
             {/* Top Contact Bar */}
       <div className="bg-black text-slate-300 py-2 text-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {contactInfo.map((contact, index) => (
                <a
                  key={index}
                  href={contact.href}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <contact.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{contact.text}</span>
                </a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden lg:inline">24/7 Premium Service</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="hidden sm:inline">5.0 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

             {/* Main Header */}
       <header
         className={cn(
           'sticky top-0 z-50 transition-all duration-300',
           isScrolled
             ? 'bg-black/95 backdrop-blur-md shadow-luxury-lg border-b border-slate-700'
             : 'bg-black/90 backdrop-blur-md'
         )}
       >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                                                              className={cn(
                       'flex items-center gap-1 py-2 text-base font-medium transition-colors relative',
                       isActive(item.href)
                         ? 'text-primary'
                         : 'text-slate-200 hover:text-white'
                     )}
                   >
                     {item.name}
                   </Link>

                                     {/* Active indicator */}
                   {isActive(item.href) && (
                     <motion.div
                       layoutId="activeTab"
                       className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                       initial={false}
                       transition={{ type: "spring", stiffness: 500, damping: 30 }}
                     />
                   )}
                </div>
              ))}
            </nav>

            {/* Logo - Centered */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Link href="/" className="flex items-center group">
                <Image
                  src="/FlyRentalsLogo.png"
                  alt="FlyRentals Luxury Rental"
                  width={180}
                  height={60}
                  className="h-16 w-auto object-contain"
                  priority
                />
              </Link>
            </div>

                         {/* CTA Buttons */}
             <div className="hidden lg:flex items-center space-x-4">
               <Link href="/fleet">
                 <Button
                   className="bg-primary text-white hover:bg-primary/90 transition-colors"
                 >
                   Book Now
                 </Button>
               </Link>
             </div>

                         {/* Mobile Menu Button */}
             <button
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
             >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

                 {/* Mobile Menu */}
         <AnimatePresence>
           {isMobileMenuOpen && (
             <motion.div
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               exit={{ opacity: 0, height: 0 }}
               className="lg:hidden bg-slate-800 border-t border-slate-700"
             >
              <div className="container mx-auto px-4 py-6">
                <nav className="space-y-4">
                  {navigation.map((item) => (
                    <div key={item.name}>
                      <Link
                        href={item.href}
                                                 className={cn(
                           'block py-3 text-lg font-medium transition-colors',
                           isActive(item.href)
                             ? 'text-primary'
                             : 'text-slate-200 hover:text-primary'
                         )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                      
                    </div>
                  ))}
                </nav>
                
                                 <div className="mt-6 pt-6 border-t border-slate-700 space-y-4">
                   <Link href="/fleet" className="block">
                     <Button className="w-full">
                       Book Now
                     </Button>
                   </Link>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
