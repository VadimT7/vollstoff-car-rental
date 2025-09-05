import { motion } from '../tokens/motion'

// Page transition animations
export const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.8,
      ease: motion.easing.luxury,
    },
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: {
      duration: 0.3,
      ease: motion.easing.luxuryIn,
    },
  },
}

// Stagger children animations
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: motion.easing.luxury,
    },
  },
}

// Luxury reveal animation
export const luxuryReveal = {
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
      duration: 1.2,
      ease: motion.easing.luxury,
    },
  },
}

// Fade animations
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: motion.easing.luxury,
    },
  },
}

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: motion.easing.luxury,
    },
  },
}

export const fadeInDown = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: motion.easing.luxury,
    },
  },
}

// Scale animations
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: motion.easing.luxury,
    },
  },
}

export const scaleUp = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.7,
      ease: motion.easing.springBouncy,
    },
  },
}

// Slide animations
export const slideInLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.8,
      ease: motion.easing.luxury,
    },
  },
}

export const slideInRight = {
  hidden: { opacity: 0, x: 100 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.8,
      ease: motion.easing.luxury,
    },
  },
}

// Hover effects
export const hoverLift = {
  rest: { y: 0, scale: 1 },
  hover: { 
    y: -4, 
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: motion.easing.luxury,
    },
  },
}

export const hoverGlow = {
  rest: { scale: 1, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' },
  hover: { 
    scale: 1.01,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    transition: {
      duration: 0.3,
      ease: motion.easing.luxury,
    },
  },
}

// Text animations
export const textReveal = {
  hidden: { 
    opacity: 0,
    y: 20,
    rotateX: -90,
  },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.8,
      delay: i * 0.1,
      ease: motion.easing.luxury,
    },
  }),
}

// Shimmer effect
export const shimmer = {
  initial: { x: '-100%' },
  animate: { 
    x: '100%',
    transition: {
      repeat: Infinity,
      duration: 3,
      ease: 'linear',
    },
  },
}

// Parallax scroll
export const parallax = (offset: number = 50) => ({
  initial: { y: offset },
  animate: { 
    y: -offset,
    transition: {
      duration: 0.8,
      ease: motion.easing.luxury,
    },
  },
})

// 3D card tilt
export const cardTilt = {
  rest: {
    rotateX: 0,
    rotateY: 0,
    scale: 1,
  },
  hover: {
    rotateX: -5,
    rotateY: 5,
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: motion.easing.luxury,
    },
  },
}

// Loading animations
export const pulse = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: 1,
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: 'reverse' as const,
      ease: motion.easing.luxury,
    },
  },
}

export const spin = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

// Draw SVG path
export const drawPath = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 2, ease: motion.easing.luxury },
      opacity: { duration: 0.5 },
    },
  },
}
