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
        'rounded-2xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur transition',
        'hover:-translate-y-0.5 hover:border-white/80 hover:bg-white/90 hover:shadow-xl hover:shadow-black/5',
        className,
      )}
    >
      {children}
    </div>
  )
}

export default Card
