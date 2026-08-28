import HighlightedText from './HighlightedText'

interface SectionHeaderProps {
  title: string
  highlight?: string
  description?: string
  align?: 'center' | 'left'
  className?: string
  titleClassName?: string
  descriptionClassName?: string
}

export default function SectionHeader({
  title,
  highlight,
  description,
  align = 'center',
  className = '',
  titleClassName = '',
  descriptionClassName = '',
}: SectionHeaderProps) {
  const alignClass = align === 'left' ? 'text-left' : 'text-center'

  return (
    <div className={`${alignClass} mb-16 ${className}`}>
      <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 ${titleClassName}`}>
        <HighlightedText text={title} highlight={highlight} />
      </h2>
      {description ? (
        <p className={`text-lg text-gray-600 font-light max-w-2xl mx-auto ${descriptionClassName}`}>
          {description}
        </p>
      ) : null}
    </div>
  )
}
