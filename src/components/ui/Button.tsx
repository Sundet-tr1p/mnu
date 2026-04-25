'use client'

import { ReactNode, ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={clsx(
        'relative inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl font-semibold transition-all',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/25',
        {
          'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-600/15 hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-600/20 hover:from-blue-700 hover:to-indigo-700 active:translate-y-0 active:shadow-sm disabled:from-blue-400 disabled:to-blue-400':
            variant === 'primary',
          'border border-gray-200/80 bg-white/80 text-gray-800 shadow-sm backdrop-blur hover:bg-white disabled:bg-white/60':
            variant === 'secondary',
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
          'cursor-not-allowed opacity-50': disabled || isLoading,
        },
        className,
      )}
      {...rest}
    >
      {isLoading && (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white"
        />
      )}
      <span className={clsx(isLoading && 'opacity-90')}>{children}</span>
    </button>
  )
}

export default Button
