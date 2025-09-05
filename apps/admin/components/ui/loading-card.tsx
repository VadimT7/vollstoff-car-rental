import { cn } from '@valore/ui'

interface LoadingCardProps {
  count?: number
  className?: string
}

export function LoadingCard({ count = 1, className }: LoadingCardProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'stat-card animate-pulse',
            className
          )}
        >
          <div className="h-4 bg-neutral-200 rounded w-1/3 mb-4" />
          <div className="space-y-3">
            <div className="h-8 bg-neutral-200 rounded w-1/2" />
            <div className="h-3 bg-neutral-200 rounded w-2/3" />
          </div>
        </div>
      ))}
    </>
  )
}
