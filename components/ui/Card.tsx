import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export default function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <div
      className={`rounded-2xl bg-white p-6 md:p-8 shadow-premium ${
        hover ? 'transition-all duration-300 hover:shadow-premium-lg hover:-translate-y-1' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
