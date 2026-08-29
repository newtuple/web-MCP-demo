interface ImagePlaceholderProps {
  label?: string
  aspectRatio?: string
  className?: string
  variant?: 'dashboard' | 'chat' | 'chart' | 'flow'
}

export default function ImagePlaceholder({
  label = 'Screenshot coming soon',
  aspectRatio = 'aspect-[4/3]',
  className = '',
  variant = 'dashboard',
}: ImagePlaceholderProps) {
  return (
    <div className={`${aspectRatio} rounded-2xl bg-gradient-to-br from-[var(--accent-50)] to-[var(--accent-100)]/80 border border-[var(--accent-200)]/50 flex items-center justify-center p-8 ${className}`}>
      <div className="w-full space-y-3 opacity-60">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-300)]/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-300)]/30" />
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-300)]/20" />
        </div>

        {variant === 'dashboard' && (
          <>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="h-10 rounded bg-[var(--accent-200)]/30" />
              <div className="h-10 rounded bg-[var(--accent-200)]/25" />
              <div className="h-10 rounded bg-[var(--accent-200)]/20" />
            </div>
            <div className="h-20 rounded bg-[var(--accent-200)]/20" />
          </>
        )}

        {variant === 'chat' && (
          <>
            <div className="flex gap-2 items-end">
              <div className="w-6 h-6 rounded-full bg-[var(--accent-200)]/40 flex-shrink-0" />
              <div className="w-2/3 h-8 rounded-xl bg-[var(--accent-200)]/25" />
            </div>
            <div className="flex gap-2 items-end justify-end">
              <div className="w-1/2 h-8 rounded-xl bg-[var(--accent-200)]/35" />
            </div>
            <div className="flex gap-2 items-end">
              <div className="w-6 h-6 rounded-full bg-[var(--accent-200)]/40 flex-shrink-0" />
              <div className="w-3/4 h-12 rounded-xl bg-[var(--accent-200)]/25" />
            </div>
          </>
        )}

        {variant === 'chart' && (
          <>
            <div className="flex items-end gap-2 h-20">
              <div className="flex-1 h-1/3 rounded-t bg-[var(--accent-200)]/30" />
              <div className="flex-1 h-2/3 rounded-t bg-[var(--accent-200)]/35" />
              <div className="flex-1 h-full rounded-t bg-[var(--accent-200)]/40" />
              <div className="flex-1 h-3/4 rounded-t bg-[var(--accent-200)]/35" />
              <div className="flex-1 h-1/2 rounded-t bg-[var(--accent-200)]/30" />
            </div>
            <div className="h-0.5 bg-[var(--accent-200)]/30" />
          </>
        )}

        {variant === 'flow' && (
          <>
            <div className="flex items-center gap-3 justify-center">
              <div className="w-14 h-10 rounded bg-[var(--accent-200)]/30" />
              <div className="w-6 h-0.5 bg-[var(--accent-200)]/30" />
              <div className="w-14 h-10 rounded bg-[var(--accent-200)]/35" />
              <div className="w-6 h-0.5 bg-[var(--accent-200)]/30" />
              <div className="w-14 h-10 rounded bg-[var(--accent-200)]/40" />
            </div>
            <div className="flex items-center gap-3 justify-center mt-4">
              <div className="w-14 h-10 rounded bg-[var(--accent-200)]/25" />
              <div className="w-6 h-0.5 bg-[var(--accent-200)]/25" />
              <div className="w-14 h-10 rounded bg-[var(--accent-200)]/30" />
            </div>
          </>
        )}

        <div className="text-center mt-2">
          <span className="text-[10px] font-medium text-[var(--accent-400)]/60 uppercase tracking-wider">{label}</span>
        </div>
      </div>
    </div>
  )
}
