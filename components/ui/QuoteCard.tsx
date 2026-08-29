import Card from './Card'

interface QuoteCardProps {
  quote: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  attribution?: string
  className?: string
}

export default function QuoteCard({ quote, icon: Icon, attribution, className = '' }: QuoteCardProps) {
  return (
    <Card className={`p-8 bg-gradient-cobalt text-white ${className}`} hover={false}>
      <Icon className="w-12 h-12 text-cyan-400 mb-6" strokeWidth={1.5} />
      <blockquote className="text-lg font-light leading-relaxed italic mb-6">
        &ldquo;{quote}&rdquo;
      </blockquote>
      {attribution ? <div className="text-sm text-[var(--accent-200)]">{attribution}</div> : null}
    </Card>
  )
}
