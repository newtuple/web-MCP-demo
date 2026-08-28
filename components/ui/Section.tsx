import { ReactNode } from 'react'
import Container from './Container'

interface SectionProps {
  children: ReactNode
  className?: string
  containerClassName?: string
  id?: string
}

export default function Section({ children, className = '', containerClassName = '', id }: SectionProps) {
  return (
    <section id={id} className={`py-20 md:py-28 ${className}`}>
      <Container className={containerClassName}>
        {children}
      </Container>
    </section>
  )
}
