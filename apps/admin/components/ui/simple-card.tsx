  import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@valore/ui'

const cardVariants = cva(
  'rounded-lg border bg-card text-card-foreground shadow-sm',
  {
    variants: {
      variant: {
        default: 'bg-white border-neutral-200',
        outline: 'border-neutral-300',
        ghost: 'border-transparent shadow-none',
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
)

export interface SimpleCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const SimpleCard = React.forwardRef<HTMLDivElement, SimpleCardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, className }))}
      {...props}
    />
  )
)

SimpleCard.displayName = 'SimpleCard'

const SimpleCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
SimpleCardHeader.displayName = 'SimpleCardHeader'

const SimpleCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
))
SimpleCardTitle.displayName = 'SimpleCardTitle'

const SimpleCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
SimpleCardDescription.displayName = 'SimpleCardDescription'

const SimpleCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
SimpleCardContent.displayName = 'SimpleCardContent'

const SimpleCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
SimpleCardFooter.displayName = 'SimpleCardFooter'

export {
  SimpleCard,
  SimpleCardHeader,
  SimpleCardFooter,
  SimpleCardTitle,
  SimpleCardDescription,
  SimpleCardContent,
}
