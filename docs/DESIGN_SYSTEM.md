# Valore Rental - Design System Documentation

## 🎨 Brand Identity

### Brand Essence
> "If Louis Vuitton & Gucci ran a supercar fleet"

**Core Values**:
- Exclusivity
- Precision
- Innovation
- Elegance
- Performance

### Visual Language
- **Minimalist luxury**: Clean lines, ample whitespace
- **Premium materials**: Glass morphism, subtle gradients
- **Kinetic elegance**: Smooth, purposeful animations
- **Cinematic imagery**: Dramatic angles, shallow depth

## 🎨 Color System

### Primary Palette

```css
/* Midnight Black - Primary dark */
--color-black: #000000;
--color-black-light: #1a1a1a;

/* Ivory - Primary light */
--color-ivory: #faf9f7;
--color-ivory-dark: #f3f1eb;

/* Champagne Gold - Accent */
--color-gold: #b59968;
--color-gold-light: #d9cfba;
--color-gold-dark: #9d7d4f;
```

### Neutral Scale

```css
--neutral-0: #ffffff;
--neutral-50: #fafafa;
--neutral-100: #f5f5f5;
--neutral-200: #e5e5e5;
--neutral-300: #d4d4d4;
--neutral-400: #a3a3a3;
--neutral-500: #737373;
--neutral-600: #525252;
--neutral-700: #404040;
--neutral-800: #262626;
--neutral-900: #171717;
--neutral-950: #0a0a0a;
--neutral-1000: #000000;
```

### Semantic Colors

```css
/* Success */
--color-success: #16a34a;
--color-success-light: #86efac;

/* Warning */
--color-warning: #f59e0b;
--color-warning-light: #fcd34d;

/* Error */
--color-error: #dc2626;
--color-error-light: #fca5a5;

/* Info */
--color-info: #3b82f6;
--color-info-light: #93bbfe;
```

### Usage Guidelines

- **Black**: Primary UI, text, luxury emphasis
- **Ivory**: Backgrounds, light UI elements
- **Gold**: CTAs, highlights, premium accents
- **Neutrals**: Text hierarchy, borders, subtle UI

## 📝 Typography

### Font Families

```css
/* Display - Editorial luxury */
--font-display: 'Playfair Display', 'Didot', serif;

/* Body - Modern clarity */
--font-body: 'Inter', -apple-system, sans-serif;

/* Mono - Data precision */
--font-mono: 'JetBrains Mono', 'SF Mono', monospace;
```

### Type Scale

```css
/* Display sizes */
--text-hero: clamp(4.5rem, 3.3rem + 6vw, 6rem);     /* 72-96px */
--text-display-lg: clamp(3rem, 2.4rem + 3vw, 4rem); /* 48-64px */
--text-display: clamp(2.25rem, 1.9rem + 1.75vw, 3rem); /* 36-48px */

/* Headings */
--text-h1: clamp(2.25rem, 1.9rem + 1.75vw, 3rem);   /* 36-48px */
--text-h2: clamp(1.875rem, 1.65rem + 1.125vw, 2.25rem); /* 30-36px */
--text-h3: clamp(1.5rem, 1.35rem + 0.75vw, 1.875rem); /* 24-30px */
--text-h4: clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem); /* 20-24px */
--text-h5: clamp(1.125rem, 1.05rem + 0.375vw, 1.25rem); /* 18-20px */

/* Body */
--text-body-lg: clamp(1.125rem, 1.05rem + 0.375vw, 1.25rem); /* 18-20px */
--text-body: clamp(1rem, 0.95rem + 0.25vw, 1.125rem); /* 16-18px */
--text-body-sm: clamp(0.875rem, 0.825rem + 0.25vw, 1rem); /* 14-16px */
--text-caption: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem); /* 12-14px */
```

### Typography Styles

#### Display Hero
```css
.heading-hero {
  font-family: var(--font-display);
  font-size: var(--text-hero);
  font-weight: 300;
  line-height: 0.9;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
```

#### Body Luxury
```css
.text-luxury {
  font-family: var(--font-body);
  font-size: var(--text-caption);
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
```

#### Price Display
```css
.text-price {
  font-family: var(--font-mono);
  font-size: var(--text-h3);
  font-weight: 300;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}
```

## 📐 Spacing System

### Base Scale
```css
--space-0: 0;
--space-px: 1px;
--space-0.5: 0.125rem;  /* 2px */
--space-1: 0.25rem;     /* 4px */
--space-2: 0.5rem;      /* 8px */
--space-3: 0.75rem;     /* 12px */
--space-4: 1rem;        /* 16px */
--space-5: 1.25rem;     /* 20px */
--space-6: 1.5rem;      /* 24px */
--space-8: 2rem;        /* 32px */
--space-10: 2.5rem;     /* 40px */
--space-12: 3rem;       /* 48px */
--space-16: 4rem;       /* 64px */
--space-20: 5rem;       /* 80px */
--space-24: 6rem;       /* 96px */
--space-32: 8rem;       /* 128px */
```

### Layout Spacing

#### Container Padding
- Mobile: `--space-4` (16px)
- Tablet: `--space-6` (24px)
- Desktop: `--space-8` (32px)
- Wide: `--space-12` (48px)

#### Section Spacing
- Small: `--space-16` (64px)
- Medium: `--space-24` (96px)
- Large: `--space-32` (128px)

#### Component Spacing
- Tight: `--space-2` (8px)
- Default: `--space-4` (16px)
- Loose: `--space-6` (24px)

## 🎭 Motion & Animation

### Duration Scale
```css
--duration-instant: 0ms;
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
--duration-slower: 700ms;
--duration-slowest: 1000ms;

/* Luxury-specific */
--duration-luxury-reveal: 1200ms;
--duration-luxury-transition: 800ms;
--duration-luxury-fade: 600ms;
```

### Easing Functions
```css
/* Standard */
--ease-linear: linear;
--ease-in: ease-in;
--ease-out: ease-out;
--ease-in-out: ease-in-out;

/* Luxury curves */
--ease-luxury: cubic-bezier(0.4, 0, 0.2, 1);
--ease-luxury-out: cubic-bezier(0, 0, 0.2, 1);
--ease-luxury-in: cubic-bezier(0.4, 0, 1, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Animation Presets

#### Luxury Reveal
```css
@keyframes luxury-reveal {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.98);
    filter: blur(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

.animate-luxury-reveal {
  animation: luxury-reveal var(--duration-luxury-reveal) var(--ease-luxury) forwards;
}
```

#### Shimmer Effect
```css
@keyframes shimmer {
  from { transform: translateX(-100%); }
  to { transform: translateX(100%); }
}

.shimmer::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shimmer 3s infinite;
}
```

### Interaction States

#### Hover
```css
.hover-lift {
  transition: transform var(--duration-normal) var(--ease-luxury);
}
.hover-lift:hover {
  transform: translateY(-4px) scale(1.02);
}
```

#### Focus
```css
:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 2px;
  transition: outline-offset var(--duration-fast) var(--ease-out);
}
```

#### Active
```css
:active {
  transform: scale(0.98);
  transition: transform var(--duration-fast) var(--ease-out);
}
```

## 🧩 Component Library

### Buttons

#### Primary (Luxury)
```jsx
<Button variant="primary" size="lg" shimmer>
  Book Now
</Button>
```

**Styles**:
- Background: Black
- Text: White
- Hover: Scale + shimmer
- Active: Scale down
- Focus: Gold ring

#### Secondary
```jsx
<Button variant="secondary" size="md">
  Learn More
</Button>
```

#### Outline
```jsx
<Button variant="outline" size="md">
  Contact Us
</Button>
```

### Cards

#### Luxury Card
```jsx
<Card variant="luxury" hoverable>
  <CardHeader>
    <CardTitle>Lamborghini Huracán</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

**Features**:
- Gradient background
- Shadow on hover
- Smooth transitions
- Glass morphism option

### Form Elements

#### Luxury Input
```jsx
<Input variant="luxury" placeholder="Enter your email" />
```

**Styles**:
- Bottom border only
- Gold focus state
- Smooth transitions
- Clear typography

### Navigation

#### Header
- Fixed position with backdrop blur
- Transparent → solid on scroll
- Minimal height (80px)
- Centered logo
- Spaced navigation

#### Mobile Menu
- Full screen overlay
- Staggered link animation
- Smooth transitions
- Touch-optimized

## 🖼️ Image Guidelines

### Aspect Ratios
- **Hero**: 16:9 or 21:9
- **Car cards**: 16:10
- **Thumbnails**: 1:1
- **Gallery**: 16:9
- **Portrait**: 3:4

### Image Treatment
- **Contrast**: High, dramatic
- **Saturation**: Slightly desaturated
- **Blur**: Subtle depth of field
- **Overlay**: Gradient for text

### Optimization
- **Format**: WebP with JPEG fallback
- **Sizes**: Multiple for responsiveness
- **Loading**: Lazy with blur placeholder
- **Quality**: 85 for web, 95 for hero

## 📱 Responsive Design

### Breakpoints
```css
--breakpoint-xs: 475px;
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
--breakpoint-3xl: 1920px;
```

### Container Widths
```css
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--container-padding);
}

@media (min-width: 640px) { max-width: 640px; }
@media (min-width: 768px) { max-width: 768px; }
@media (min-width: 1024px) { max-width: 1024px; }
@media (min-width: 1280px) { max-width: 1280px; }
@media (min-width: 1536px) { max-width: 1536px; }
```

### Mobile Considerations
- Touch targets: Minimum 44x44px
- Font sizes: Minimum 16px
- Spacing: Increased on mobile
- Interactions: Touch-optimized

## ♿ Accessibility

### Color Contrast
- **Normal text**: 4.5:1 minimum
- **Large text**: 3:1 minimum
- **UI elements**: 3:1 minimum

### Focus States
- Visible focus indicators
- 2px gold outline
- Never remove outline
- Keyboard navigable

### Motion
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### ARIA Labels
- Descriptive button labels
- Form field descriptions
- Loading states announced
- Error messages linked

## 🎨 Special Effects

### Glass Morphism
```css
.glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

### Gradient Text
```css
.gradient-text {
  background: linear-gradient(135deg, var(--color-gold), var(--color-gold-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Luxury Shadow
```css
.shadow-luxury {
  box-shadow: 
    0 20px 40px -10px rgba(0, 0, 0, 0.2),
    0 10px 20px -5px rgba(0, 0, 0, 0.1);
}
```

### Parallax Layers
```css
.parallax-slow { transform: translateZ(-1px) scale(1.5); }
.parallax-medium { transform: translateZ(-2px) scale(2); }
.parallax-fast { transform: translateZ(-3px) scale(2.5); }
```

## 📋 Implementation Checklist

### Setup
- [ ] Import design tokens
- [ ] Configure Tailwind
- [ ] Load custom fonts
- [ ] Set CSS variables

### Components
- [ ] Button variants
- [ ] Card styles
- [ ] Form elements
- [ ] Navigation
- [ ] Modals
- [ ] Loading states

### Pages
- [ ] Hero sections
- [ ] Grid layouts
- [ ] Form layouts
- [ ] Content sections

### Polish
- [ ] Animations
- [ ] Transitions
- [ ] Hover states
- [ ] Focus states
- [ ] Error states
- [ ] Loading states

## 🚀 Usage Examples

### Hero Section
```jsx
<section className="relative h-screen bg-black text-white overflow-hidden">
  <div className="absolute inset-0">
    {/* Background image/video */}
  </div>
  <div className="relative z-10 container-luxury h-full flex items-center">
    <div className="max-w-3xl">
      <p className="text-luxury text-gold mb-6">Valore Rental</p>
      <h1 className="heading-hero mb-8">
        Redefine<br />Luxury
      </h1>
      <p className="text-xl mb-12 text-neutral-300">
        Experience automotive excellence
      </p>
      <Button size="xl" shimmer>
        Explore Fleet
      </Button>
    </div>
  </div>
</section>
```

### Product Card
```jsx
<Card variant="luxury" hoverable className="group">
  <div className="aspect-car overflow-hidden">
    <img 
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      src={car.image} 
      alt={car.name}
    />
  </div>
  <CardContent>
    <h3 className="text-2xl font-display mb-2">{car.name}</h3>
    <p className="text-price">{formatPrice(car.price)}/day</p>
  </CardContent>
</Card>
```

---

**Version**: 1.0
**Last Updated**: January 2024

For implementation details, see the `/packages/ui` directory.
