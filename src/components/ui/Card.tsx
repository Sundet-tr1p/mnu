'use client'

import { ReactNode } from 'react'
import clsx from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-white/60 bg-white/90 p-6 shadow-md backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-xl',
        className,
      )}
    >
      {children}
    </div>
  )
}

export default Card
