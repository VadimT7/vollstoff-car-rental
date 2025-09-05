'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '../../lib/utils'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden',
  {
    variants: {
      variant: {
        primary:
          'bg-neutral-1000 text-neutral-0 hover:bg-neutral-900 focus-visible:ring-neutral-1000',
        secondary:
          'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus-visible:ring-neutral-500',
        outline:
          'border border-neutral-300 bg-transparent text-neutral-900 hover:bg-neutral-100 focus-visible:ring-neutral-500',
        ghost:
          'text-neutral-900 hover:bg-neutral-100 focus-visible:ring-neutral-500',
        luxury:
          'bg-gradient-to-r from-primary-600 to-primary-700 text-neutral-0 hover:from-primary-700 hover:to-primary-800 focus-visible:ring-primary-500 shadow-luxury hover:shadow-luxury-hover',
        destructive:
          'bg-red-600 text-neutral-0 hover:bg-red-700 focus-visible:ring-red-600',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-sm',
        lg: 'h-12 px-8 text-base',
        xl: 'h-14 px-10 text-base',
        icon: 'h-10 w-10',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

// Luxury button animations
const buttonMotion = {
  tap: { scale: 0.98 },
  hover: { scale: 1.02 },
  transition: {
    type: 'spring',
    stiffness: 400,
    damping: 17,
  },
}

// Shimmer effect for luxury variant
const shimmerMotion = {
  initial: { x: '-100%' },
  animate: { x: '100%' },
  transition: {
    repeat: Infinity,
    duration: 3,
    ease: 'linear',
  },
}

export interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'type' | 'children'>,
    VariantProps<typeof buttonVariants> {
  children?: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  shimmer?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading,
      disabled,
      children,
      leftIcon,
      rightIcon,
      shimmer = false,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading
    const showShimmer = shimmer && variant === 'luxury' && !isDisabled

    return (
      <motion.button
        ref={ref}
        type={type}
        className={cn(
          buttonVariants({ variant, size, fullWidth, className }),
          'group'
        )}
        disabled={isDisabled}
        whileTap={!isDisabled ? buttonMotion.tap : undefined}
        whileHover={!isDisabled ? buttonMotion.hover : undefined}
        transition={buttonMotion.transition}
        {...props}
      >
        {/* Shimmer effect for luxury variant */}
        {showShimmer && (
          <motion.div
            className="absolute inset-0 -top-[2px] -bottom-[2px] opacity-30"
            {...shimmerMotion}
          >
            <div className="h-full w-[2px] bg-gradient-to-r from-transparent via-white to-transparent" />
          </motion.div>
        )}

        {/* Loading spinner */}
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
        )}

        {/* Left icon */}
        {!loading && leftIcon && (
          <span className="mr-2" aria-hidden="true">
            {leftIcon}
          </span>
        )}

        {/* Button text with letter spacing */}
        <span className="relative tracking-wider uppercase text-xs font-semibold">
          {children}
        </span>

        {/* Right icon */}
        {rightIcon && (
          <span className="ml-2" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
