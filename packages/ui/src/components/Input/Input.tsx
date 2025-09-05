import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const inputVariants = cva(
  'flex w-full bg-transparent px-4 py-2 text-base transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border border-neutral-300 rounded-md focus:border-neutral-500 focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2',
        luxury:
          'border-b border-neutral-300 rounded-none focus:border-primary-500 focus-visible:ring-0 focus-visible:border-b-2',
        filled:
          'bg-neutral-100 border border-transparent rounded-md focus:bg-neutral-50 focus:border-neutral-300 focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2',
        ghost:
          'border-none focus-visible:ring-0 px-0 focus:bg-neutral-50 rounded-md focus:px-4',
      },
      size: {
        sm: 'h-9 text-sm',
        md: 'h-11',
        lg: 'h-12 text-lg',
        xl: 'h-14 text-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      type = 'text',
      leftIcon,
      rightIcon,
      error,
      ...props
    },
    ref
  ) => {
    if (leftIcon || rightIcon) {
      return (
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 flex h-full items-center pointer-events-none text-neutral-500">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              inputVariants({ variant, size }),
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-red-500 focus:border-red-500 focus-visible:ring-red-500',
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 flex h-full items-center pointer-events-none text-neutral-500">
              {rightIcon}
            </div>
          )}
        </div>
      )
    }

    return (
      <input
        type={type}
        className={cn(
          inputVariants({ variant, size }),
          error && 'border-red-500 focus:border-red-500 focus-visible:ring-red-500',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

// Textarea component
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    Omit<VariantProps<typeof inputVariants>, 'size'> {
  error?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          inputVariants({ variant, size: 'md' }),
          'min-h-[80px] py-3 resize-none',
          error && 'border-red-500 focus:border-red-500 focus-visible:ring-red-500',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'

// Label component
export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
  error?: boolean
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, error, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          error && 'text-red-600',
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
    )
  }
)

Label.displayName = 'Label'

// Helper text component
export interface HelperTextProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  error?: boolean
}

const HelperText = React.forwardRef<HTMLParagraphElement, HelperTextProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          'text-sm mt-1',
          error ? 'text-red-600' : 'text-neutral-600',
          className
        )}
        {...props}
      />
    )
  }
)

HelperText.displayName = 'HelperText'

// Form Field wrapper component
export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('space-y-2', className)}
        {...props}
      />
    )
  }
)

FormField.displayName = 'FormField'

export {
  Input,
  Textarea,
  Label,
  HelperText,
  FormField,
  inputVariants,
}
