export const typography = {
  // Font families
  fonts: {
    // High-fashion editorial display font
    display: '"Playfair Display", "Didot", "Bodoni MT", serif',
    // Modern grotesk for body
    body: '"Inter", "Helvetica Neue", -apple-system, BlinkMacSystemFont, sans-serif',
    // Monospace for numbers and codes
    mono: '"JetBrains Mono", "SF Mono", "Monaco", monospace',
  },
  
  // Font sizes with fluid scaling
  sizes: {
    xs: 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
    sm: 'clamp(0.875rem, 0.825rem + 0.25vw, 1rem)',
    base: 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)',
    lg: 'clamp(1.125rem, 1.05rem + 0.375vw, 1.25rem)',
    xl: 'clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem)',
    '2xl': 'clamp(1.5rem, 1.35rem + 0.75vw, 1.875rem)',
    '3xl': 'clamp(1.875rem, 1.65rem + 1.125vw, 2.25rem)',
    '4xl': 'clamp(2.25rem, 1.9rem + 1.75vw, 3rem)',
    '5xl': 'clamp(3rem, 2.4rem + 3vw, 4rem)',
    '6xl': 'clamp(3.75rem, 2.85rem + 4.5vw, 5rem)',
    '7xl': 'clamp(4.5rem, 3.3rem + 6vw, 6rem)',
    '8xl': 'clamp(6rem, 4.2rem + 9vw, 8rem)',
    '9xl': 'clamp(8rem, 5.6rem + 12vw, 10rem)',
  },
  
  // Line heights
  lineHeights: {
    none: '1',
    tight: '1.1',
    snug: '1.2',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  
  // Font weights
  weights: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  // Letter spacing for luxury feel
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
    // Luxury heading spacing
    luxury: '0.15em',
    'luxury-wide': '0.2em',
  },
  
  // Text transforms
  transforms: {
    uppercase: 'uppercase',
    lowercase: 'lowercase',
    capitalize: 'capitalize',
    none: 'none',
  },
} as const

// Pre-composed text styles
export const textStyles = {
  // Display styles for hero sections
  'display-hero': {
    fontFamily: typography.fonts.display,
    fontSize: typography.sizes['8xl'],
    fontWeight: typography.weights.light,
    lineHeight: typography.lineHeights.none,
    letterSpacing: typography.letterSpacing.luxury,
    textTransform: typography.transforms.uppercase,
  },
  'display-large': {
    fontFamily: typography.fonts.display,
    fontSize: typography.sizes['6xl'],
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.tight,
    letterSpacing: typography.letterSpacing.wider,
  },
  'display-medium': {
    fontFamily: typography.fonts.display,
    fontSize: typography.sizes['4xl'],
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.tight,
    letterSpacing: typography.letterSpacing.wide,
  },
  'display-small': {
    fontFamily: typography.fonts.display,
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.medium,
    lineHeight: typography.lineHeights.snug,
    letterSpacing: typography.letterSpacing.normal,
  },
  
  // Heading styles
  h1: {
    fontFamily: typography.fonts.display,
    fontSize: typography.sizes['5xl'],
    fontWeight: typography.weights.light,
    lineHeight: typography.lineHeights.tight,
    letterSpacing: typography.letterSpacing.wide,
  },
  h2: {
    fontFamily: typography.fonts.display,
    fontSize: typography.sizes['4xl'],
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.snug,
    letterSpacing: typography.letterSpacing.normal,
  },
  h3: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.medium,
    lineHeight: typography.lineHeights.snug,
    letterSpacing: typography.letterSpacing.normal,
  },
  h4: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.medium,
    lineHeight: typography.lineHeights.normal,
    letterSpacing: typography.letterSpacing.normal,
  },
  h5: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.lineHeights.normal,
    letterSpacing: typography.letterSpacing.normal,
  },
  h6: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.lineHeights.normal,
    letterSpacing: typography.letterSpacing.normal,
  },
  
  // Body styles
  'body-large': {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.relaxed,
    letterSpacing: typography.letterSpacing.normal,
  },
  body: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.normal,
    letterSpacing: typography.letterSpacing.normal,
  },
  'body-small': {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.normal,
    letterSpacing: typography.letterSpacing.normal,
  },
  
  // Special styles
  caption: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    lineHeight: typography.lineHeights.normal,
    letterSpacing: typography.letterSpacing.wider,
    textTransform: typography.transforms.uppercase,
  },
  label: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    lineHeight: typography.lineHeights.none,
    letterSpacing: typography.letterSpacing.wide,
  },
  button: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.lineHeights.none,
    letterSpacing: typography.letterSpacing['luxury-wide'],
    textTransform: typography.transforms.uppercase,
  },
  'price-large': {
    fontFamily: typography.fonts.mono,
    fontSize: typography.sizes['4xl'],
    fontWeight: typography.weights.light,
    lineHeight: typography.lineHeights.none,
    letterSpacing: typography.letterSpacing.tight,
  },
  'price-small': {
    fontFamily: typography.fonts.mono,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.none,
    letterSpacing: typography.letterSpacing.normal,
  },
} as const
