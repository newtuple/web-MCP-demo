import Link from 'next/link'
import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  href?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  fillClassName?: string
  external?: boolean
  onClick?: () => void
  type?: 'button' | 'submit'
}

const variants = {
  primary: {
    button: 'bg-cobalt-900 text-white shadow-premium hover:shadow-premium-lg',
    fill: 'bg-cobalt-800',
  },
  secondary: {
    button: 'bg-cyan-500 text-white shadow-premium hover:shadow-premium-lg',
    fill: 'bg-cyan-600',
  },
  outline: {
    button: 'border-2 border-cobalt-900 text-cobalt-900 hover:text-white',
    fill: 'bg-cobalt-900',
  },
  ghost: {
    button: 'text-cobalt-900',
    fill: 'bg-cobalt-100',
  },
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm',
  md: 'px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base',
  lg: 'px-5 py-2.5 text-base sm:px-8 sm:py-4 sm:text-lg',
}

export default function Button({
  children,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  fillClassName,
  external = false,
  onClick,
  type = 'button',
}: ButtonProps) {
  const variantStyles = variants[variant]
  const fillClass = fillClassName || variantStyles.fill
  const baseClasses = `group/btn relative isolate inline-flex items-center justify-center rounded-full overflow-hidden font-medium transition-all duration-300 active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-400/60 ${variantStyles.button} ${sizes[size]} ${className}`
  const innerContent = (
    <>
      <span
        aria-hidden="true"
        className={`absolute inset-0 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover/btn:scale-x-100 group-focus-visible/btn:scale-x-100 ${fillClass}`}
      />
      <span className="relative z-10">{children}</span>
    </>
  )

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={baseClasses}>
          {innerContent}
        </a>
      )
    }
    return (
      <Link href={href} className={baseClasses}>
        {innerContent}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} className={baseClasses}>
      {innerContent}
    </button>
  )
}
