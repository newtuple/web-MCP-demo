import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'cobalt' | 'cyan' | 'outline'
  className?: string
}

const badgeVariants = {
  default: 'bg-gray-100 text-gray-700',
  cobalt: 'bg-[var(--accent-50)] text-[var(--accent-900)]',
  cyan: 'bg-cyan-500/10 text-cyan-600',
  outline: 'border border-[var(--accent-200)] text-[var(--accent-700)]',
}

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${badgeVariants[variant]} ${className}`}>
      {children}
    </span>
  )
}
