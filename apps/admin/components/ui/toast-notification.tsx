'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-800',
    iconColor: 'text-green-600'
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
    iconColor: 'text-red-600'
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-800',
    iconColor: 'text-amber-600'
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    iconColor: 'text-blue-600'
  }
}

class ToastManager {
  private listeners: ((toasts: Toast[]) => void)[] = []
  private toasts: Toast[] = []

  subscribe(listener: (toasts: Toast[]) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  show(type: ToastType, message: string, duration = 5000) {
    const id = Math.random().toString(36).substr(2, 9)
    const toast: Toast = { id, type, message, duration }
    this.toasts = [...this.toasts, toast]
    this.notify()

    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration)
    }
  }

  dismiss(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id)
    this.notify()
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.toasts))
  }
}

export const toastManager = new ToastManager()

export function showToast(type: ToastType, message: string, duration?: number) {
  toastManager.show(type, message, duration)
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    return toastManager.subscribe(setToasts)
  }, [])

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => {
          const config = toastConfig[toast.type]
          const Icon = config.icon

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={`
                flex items-start gap-3 p-4 rounded-lg border shadow-lg pointer-events-auto
                ${config.bgColor} ${config.borderColor}
                min-w-[300px] max-w-[500px]
              `}
            >
              <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />
              <p className={`flex-1 text-sm font-medium ${config.textColor}`}>
                {toast.message}
              </p>
              <button
                onClick={() => toastManager.dismiss(toast.id)}
                className={`flex-shrink-0 ${config.textColor} hover:opacity-70 transition-opacity`}
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
