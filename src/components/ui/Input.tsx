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
          'w-full rounded-xl border bg-white/90 px-4 py-2 transition-all focus:outline-none focus:ring-2',
          {
            'border-red-500 focus:ring-red-500': error,
            'border-gray-300 focus:ring-blue-500 hover:border-blue-300': !error,
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
