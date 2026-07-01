'use client'

import { AlertCircle, RefreshCcw } from 'lucide-react'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  message = 'An error occurred while loading the data.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center" role="alert">
      <div className="bg-error/10 rounded-full p-4">
        <AlertCircle className="text-error h-8 w-8" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <p className="text-text-primary text-sm font-medium">{message}</p>
        <p className="text-text-secondary text-xs">Check your connection and try again.</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-surface text-text-primary border-border hover:border-border-hi inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors duration-[180ms]"
          aria-label="Try again"
        >
          <RefreshCcw className="h-4 w-4" aria-hidden="true" />
          Try again
        </button>
      )}
    </div>
  )
}
