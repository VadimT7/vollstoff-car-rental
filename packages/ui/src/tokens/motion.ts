export const motion = {
  // Duration scales (in milliseconds)
  duration: {
    instant: 0,
    fast: 150,
    normal: 300,
    slow: 500,
    slower: 700,
    slowest: 1000,
    // Luxury-specific durations
    'luxury-reveal': 1200,
    'luxury-transition': 800,
    'luxury-fade': 600,
  },
  
  // Easing functions - using framer-motion compatible values
  easing: {
    // Standard easings
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    
    // Custom easings for luxury feel - using framer-motion compatible values
    luxury: [0.4, 0, 0.2, 1], // Smooth and elegant
    luxuryOut: [0, 0, 0.2, 1], // Smooth deceleration
    luxuryIn: [0.4, 0, 1, 1], // Smooth acceleration
    bounce: [0.68, -0.55, 0.265, 1.55],
    smooth: [0.25, 0.1, 0.25, 1],
    sharp: [0.4, 0, 0.6, 1],
    
    // Spring animations (for Framer Motion)
    spring: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      mass: 1,
    },
    springBouncy: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
      mass: 0.8,
    },
    springSoft: {
      type: 'spring',
      stiffness: 50,
      damping: 20,
      mass: 1,
    },
  },
  
  // Transition presets
  transitions: {
    // Base transitions
    base: {
      duration: 300,
      ease: [0.4, 0, 0.2, 1],
    },
    fast: {
      duration: 150,
      ease: [0.4, 0, 0.2, 1],
    },
    slow: {
      duration: 500,
      ease: [0.4, 0, 0.2, 1],
    },
    
    // Luxury transitions
    luxuryFade: {
      duration: 600,
      ease: [0.25, 0.1, 0.25, 1],
    },
    luxurySlide: {
      duration: 800,
      ease: [0.4, 0, 0.2, 1],
    },
    luxuryScale: {
      duration: 700,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  
  // Animation keyframes
  keyframes: {
    fadeIn: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    fadeInUp: {
      from: { opacity: 0, transform: 'translateY(20px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
    fadeInDown: {
      from: { opacity: 0, transform: 'translateY(-20px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
    scaleIn: {
      from: { opacity: 0, transform: 'scale(0.9)' },
      to: { opacity: 1, transform: 'scale(1)' },
    },
    slideInLeft: {
      from: { transform: 'translateX(-100%)' },
      to: { transform: 'translateX(0)' },
    },
    slideInRight: {
      from: { transform: 'translateX(100%)' },
      to: { transform: 'translateX(0)' },
    },
    // Luxury-specific keyframes
    luxuryReveal: {
      from: { 
        opacity: 0, 
        transform: 'translateY(30px) scale(0.98)',
        filter: 'blur(10px)',
      },
      to: { 
        opacity: 1, 
        transform: 'translateY(0) scale(1)',
        filter: 'blur(0px)',
      },
    },
    shimmer: {
      '0%': { transform: 'translateX(-100%)' },
      '100%': { transform: 'translateX(100%)' },
    },
    pulse: {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.5 },
    },
  },
} as const

// Framer Motion variants
export const variants = {
  // Container variants for stagger effects
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  },
  
  // Item variants
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: motion.transitions.base,
    },
  },
  
  // Luxury reveal variants
  luxuryReveal: {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.98,
      filter: 'blur(10px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: motion.duration['luxury-reveal'] / 1000,
        ease: motion.easing.luxury,
      },
    },
  },
  
  // Page transition variants
  pageTransition: {
    initial: { opacity: 0, x: -20 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: motion.duration['luxury-transition'] / 1000,
        ease: motion.easing.luxuryOut,
      },
    },
    exit: { 
      opacity: 0, 
      x: 20,
      transition: {
        duration: motion.duration.normal / 1000,
        ease: motion.easing.luxuryIn,
      },
    },
  },
} as const

// Hover animations
export const hoverEffects = {
  lift: {
    scale: 1.02,
    y: -4,
    transition: motion.transitions.base,
  },
  glow: {
    scale: 1.01,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    transition: motion.transitions.base,
  },
  shine: {
    backgroundPosition: '200% center',
    transition: {
      duration: motion.duration.slow / 1000,
      ease: motion.easing.luxury,
    },
  },
} as const

// Scroll-triggered animations
export const scrollAnimations = {
  fadeInUp: {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: motion.transitions.luxuryFade,
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, margin: '-100px' },
    transition: motion.transitions.luxuryScale,
  },
  slideInLeft: {
    initial: { opacity: 0, x: -100 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: motion.transitions.luxurySlide,
  },
  slideInRight: {
    initial: { opacity: 0, x: 100 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: motion.transitions.luxurySlide,
  },
} as const
