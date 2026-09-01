'use client'

import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import Card from '@/components/ui/Card'
import StaggerChildren, { StaggerItem } from '@/components/motion/StaggerChildren'

interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

interface FeatureGridProps {
  features: Feature[]
  columns?: 2 | 3 | 4
  className?: string
  iconColor?: string
}

const gridCols = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-2 lg:grid-cols-3',
  4: 'md:grid-cols-2 lg:grid-cols-4',
}

export default function FeatureGrid({
  features,
  columns = 3,
  className = '',
  iconColor = 'text-[var(--accent-900)]',
}: FeatureGridProps) {
  return (
    <StaggerChildren className={`grid grid-cols-1 ${gridCols[columns]} gap-6 md:gap-8 ${className}`}>
      {features.map((feature) => (
        <StaggerItem key={feature.title}>
          <Card className="h-full">
            <feature.icon className={`w-8 h-8 ${iconColor} mb-4`} strokeWidth={1.5} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600 font-light leading-relaxed">{feature.description}</p>
          </Card>
        </StaggerItem>
      ))}
    </StaggerChildren>
  )
}

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  tags?: string[]
}

export function FeatureCard({ icon, title, description, tags }: FeatureCardProps) {
  return (
    <Card className="h-full">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 font-light leading-relaxed mb-4">{description}</p>
      {tags && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
              {tag}
            </span>
          ))}
        </div>
      )}
    </Card>
  )
}
