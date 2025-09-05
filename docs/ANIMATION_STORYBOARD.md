# Valore Rental - Animation Storyboard

## 🎬 Animation Philosophy

**Core Principles**:
- **Purposeful**: Every animation has a clear function
- **Elegant**: Smooth, refined movements
- **Performant**: 60fps on all devices
- **Accessible**: Respects prefers-reduced-motion

## 🏠 Homepage Animations

### Initial Load Sequence

**Timeline (0-3000ms)**:
1. **0-300ms**: Fade in black overlay
2. **300-800ms**: Logo fade + scale in
3. **800-1500ms**: Hero text reveal (line by line)
4. **1200-1800ms**: CTA buttons slide up + fade
5. **1500-2500ms**: 3D car model fade in + slow rotation
6. **2000-3000ms**: Scroll indicator pulse begins

```css
/* Logo Animation */
@keyframes logo-reveal {
  0% { 
    opacity: 0; 
    transform: scale(0.9);
  }
  100% { 
    opacity: 1; 
    transform: scale(1);
  }
}

/* Hero Text Animation */
@keyframes hero-text-reveal {
  0% { 
    opacity: 0; 
    transform: translateY(30px);
    filter: blur(10px);
  }
  100% { 
    opacity: 1; 
    transform: translateY(0);
    filter: blur(0);
  }
}
```

### Hero Carousel Transitions

**Between Slides (0-800ms)**:
1. **0-300ms**: Current text fade out + slide up
2. **200-600ms**: 3D model rotation to new position
3. **400-800ms**: New text fade in + slide up
4. **600-800ms**: Background gradient shift

### Scroll-Triggered Animations

#### Instant Booking Widget
- **Trigger**: 50% in viewport
- **Animation**: Scale from 0.95 → 1, fade in
- **Duration**: 600ms
- **Easing**: ease-luxury

#### Featured Fleet Cards
- **Trigger**: 30% in viewport
- **Animation**: Staggered fade up
- **Delay**: 100ms between cards
- **Duration**: 500ms per card

```javascript
// Framer Motion Config
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
}
```

## 🚗 Car Showcase Animations

### 3D Model Interactions

#### Auto-Rotation
- **Speed**: 0.5 rpm
- **Direction**: Clockwise
- **Pause on**: User interaction

#### User Controls
- **Drag**: Rotate model
- **Pinch**: Zoom in/out
- **Double-tap**: Reset position

#### Loading State
```css
@keyframes car-skeleton-pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.7; }
}

.car-skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  animation: car-skeleton-pulse 2s infinite;
}
```

### Car Card Hover Effects

**Mouse Enter**:
1. **0-200ms**: Scale image 1.1x
2. **0-300ms**: Darken overlay 0 → 0.3 opacity
3. **100-400ms**: Slide up car details
4. **200-400ms**: Fade in "View Details" text

**Mouse Leave**:
- Reverse all animations
- Duration: 300ms
- Easing: ease-out

## 📅 Booking Flow Animations

### Step Transitions

**Forward Navigation**:
1. **0-200ms**: Current step fade out + slide left
2. **200-400ms**: Progress bar fill animation
3. **300-600ms**: Next step fade in + slide from right

**Backward Navigation**:
- Same timing, reversed directions
- Progress bar shrinks

### Form Interactions

#### Input Focus
```css
.luxury-input {
  border-bottom: 1px solid #e5e5e5;
  transition: all 300ms ease-luxury;
}

.luxury-input:focus {
  border-bottom-width: 2px;
  border-color: var(--color-gold);
  transform: translateY(-2px);
}
```

#### Date Picker
- **Calendar appear**: Scale 0.95 → 1, fade in (300ms)
- **Date hover**: Background color transition (150ms)
- **Date select**: Ripple effect from center (400ms)

#### Add-on Selection
```css
@keyframes addon-select {
  0% { transform: scale(1); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
}

.addon-card.selected {
  animation: addon-select 300ms ease-luxury;
  border-color: var(--color-gold);
  background: var(--color-gold-light);
}
```

### Payment Processing

**Timeline (0-2000ms)**:
1. **0-300ms**: Submit button disabled + loading spinner
2. **300-1500ms**: Progress dots animation
3. **1500-1800ms**: Success checkmark draw
4. **1800-2000ms**: Redirect to confirmation

```css
@keyframes progress-dots {
  0%, 20% { content: '.'; }
  40% { content: '..'; }
  60%, 100% { content: '...'; }
}

@keyframes checkmark-draw {
  0% { stroke-dashoffset: 100; }
  100% { stroke-dashoffset: 0; }
}
```

## 🎯 Micro-Interactions

### Button States

#### Primary Button Hover
```css
.btn-luxury {
  position: relative;
  overflow: hidden;
}

.btn-luxury::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 70%
  );
  transform: translateX(-100%);
  transition: transform 700ms ease-luxury;
}

.btn-luxury:hover::before {
  transform: translateX(100%);
}
```

#### Loading State
```css
@keyframes btn-loading-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.btn-loading-icon {
  animation: btn-loading-spin 1s linear infinite;
}
```

### Navigation Menu

#### Mobile Menu Open
1. **0-100ms**: Hamburger → X morph
2. **0-300ms**: Overlay fade in
3. **100-500ms**: Menu slide from right
4. **200-700ms**: Links stagger in

#### Desktop Dropdown
```css
.nav-dropdown {
  opacity: 0;
  transform: translateY(-10px);
  transition: all 200ms ease-luxury;
  pointer-events: none;
}

.nav-item:hover .nav-dropdown {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
```

### Toast Notifications

**Appear (0-400ms)**:
1. **0-200ms**: Slide in from right
2. **200-400ms**: Progress bar starts

**Dismiss (0-300ms)**:
1. **0-300ms**: Slide out to right + fade

```css
@keyframes toast-slide-in {
  from { 
    transform: translateX(100%);
    opacity: 0;
  }
  to { 
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes toast-progress {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
```

## 📸 Image Loading

### Progressive Loading

1. **Initial**: Blurred placeholder (10x10 base64)
2. **0-500ms**: Fade to full image
3. **Complete**: Remove blur filter

```css
.image-wrapper {
  position: relative;
  overflow: hidden;
}

.image-placeholder {
  filter: blur(20px);
  transform: scale(1.1);
}

.image-full {
  opacity: 0;
  transition: opacity 500ms ease-in-out;
}

.image-loaded .image-full {
  opacity: 1;
}
```

### Gallery Transitions

#### Thumbnail Click
1. **0-300ms**: Thumbnail scales up
2. **200-500ms**: Main image cross-fade
3. **400-600ms**: Caption update

#### Lightbox Open
1. **0-200ms**: Background overlay fade
2. **100-400ms**: Image scale + fade in
3. **300-500ms**: Controls fade in

## 📊 Data Visualizations

### Loading Skeletons

```css
@keyframes skeleton-wave {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f0 0%,
    #e0e0e0 20%,
    #f0f0f0 40%,
    #f0f0f0 100%
  );
  background-size: 200% 100%;
  animation: skeleton-wave 1.5s infinite;
}
```

### Progress Indicators

#### Circular Progress
```css
@keyframes progress-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes progress-dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
```

## ⚡ Performance Guidelines

### Animation Optimization

1. **Use CSS transforms** over position changes
2. **Animate opacity** and transform only
3. **Enable GPU acceleration** with `will-change`
4. **Remove will-change** after animation
5. **Use requestAnimationFrame** for JS animations

### Best Practices

```css
/* Good - GPU accelerated */
.animate-slide {
  transform: translateX(0);
  transition: transform 300ms ease;
}

/* Bad - Causes reflow */
.animate-slide {
  left: 0;
  transition: left 300ms ease;
}
```

### Reducing Motion

```css
@media (prefers-reduced-motion: reduce) {
  /* Disable non-essential animations */
  .luxury-reveal,
  .hover-effect,
  .parallax {
    animation: none !important;
    transition: none !important;
  }
  
  /* Keep essential transitions but make instant */
  .page-transition {
    transition-duration: 0.01ms !important;
  }
}
```

## 🎭 Special Effects

### Parallax Scrolling

```javascript
// Three.js camera movement
useFrame((state) => {
  const scrollY = window.scrollY
  camera.position.y = -(scrollY * 0.001)
  camera.rotation.x = -(scrollY * 0.0001)
})
```

### Mouse Follow

```javascript
// Luxury cursor glow
const handleMouseMove = (e) => {
  const x = (e.clientX / window.innerWidth) * 2 - 1
  const y = -(e.clientY / window.innerHeight) * 2 + 1
  
  glowRef.current.style.transform = `
    translate(${x * 20}px, ${y * 20}px)
  `
}
```

### Scroll-Triggered 3D

```javascript
// Car rotation on scroll
const scrollProgress = scrollY / (docHeight - viewHeight)
const rotation = scrollProgress * Math.PI * 2
carModel.rotation.y = rotation
```

## 📱 Mobile Animations

### Touch Interactions

- **Swipe gestures**: 300ms transitions
- **Tap feedback**: Scale 0.98 for 100ms
- **Pull to refresh**: Elastic bounce
- **Momentum scrolling**: Native iOS/Android

### Reduced Animations

Mobile devices get simplified animations:
- Shorter durations (50% reduction)
- No parallax effects
- Simpler transitions
- GPU-optimized transforms only

## 🎯 Implementation Checklist

### Homepage
- [ ] Loading sequence
- [ ] Hero transitions
- [ ] Scroll animations
- [ ] Hover effects

### Car Pages
- [ ] 3D model controls
- [ ] Image loading
- [ ] Gallery transitions
- [ ] Card interactions

### Booking Flow
- [ ] Step transitions
- [ ] Form animations
- [ ] Progress indicators
- [ ] Success states

### Global
- [ ] Page transitions
- [ ] Loading states
- [ ] Error states
- [ ] Micro-interactions

---

**Version**: 1.0
**Last Updated**: January 2024

For implementation examples, see `/packages/ui/src/animations/`
