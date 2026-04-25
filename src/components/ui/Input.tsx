'use client'

import { InputHTMLAttributes } from 'react'
import clsx from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="mb-4 w-full">
      {label && <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>}
      <input
        className={clsx(
          'w-full rounded-xl border bg-white/80 px-4 py-2 transition-all',
          'placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20',
          {
            'border-red-400 focus-visible:ring-red-500/20': error,
            'border-gray-200/80 hover:border-gray-300 focus:border-blue-300': !error,
          },
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

export default Input
