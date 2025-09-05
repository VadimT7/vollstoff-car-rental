export const colors = {
  // Primary brand colors - midnight black and champagne accents
  primary: {
    50: '#faf9f7',
    100: '#f3f1eb',
    200: '#e8e3d6',
    300: '#d9cfba',
    400: '#c7b595',
    500: '#b59968', // Champagne gold
    600: '#9d7d4f',
    700: '#836540',
    800: '#6b5236',
    900: '#59442f',
    950: '#302316',
  },
  
  // Neutral colors - true blacks and warm grays
  neutral: {
    0: '#ffffff',
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
    1000: '#000000', // True black for luxury feel
  },
  
  // Accent colors
  accent: {
    red: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    green: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
  },
  
  // Special luxury finishes
  metallic: {
    gold: '#FFD700',
    silver: '#C0C0C0',
    bronze: '#CD7F32',
    chrome: '#E5E4E2',
  },
  
  // Semantic colors
  semantic: {
    success: '#16a34a',
    warning: '#f59e0b',
    error: '#dc2626',
    info: '#3b82f6',
  },
} as const

// CSS variables for runtime theming
export const cssVariables = {
  '--color-background': colors.neutral[0],
  '--color-foreground': colors.neutral[1000],
  '--color-card': colors.neutral[0],
  '--color-card-foreground': colors.neutral[950],
  '--color-popover': colors.neutral[0],
  '--color-popover-foreground': colors.neutral[950],
  '--color-primary': colors.primary[500],
  '--color-primary-foreground': colors.neutral[50],
  '--color-secondary': colors.neutral[100],
  '--color-secondary-foreground': colors.neutral[900],
  '--color-muted': colors.neutral[100],
  '--color-muted-foreground': colors.neutral[500],
  '--color-accent': colors.primary[500],
  '--color-accent-foreground': colors.neutral[900],
  '--color-destructive': colors.semantic.error,
  '--color-destructive-foreground': colors.neutral[50],
  '--color-border': colors.neutral[200],
  '--color-input': colors.neutral[200],
  '--color-ring': colors.primary[500],
} as const
