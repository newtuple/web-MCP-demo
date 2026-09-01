import { BLOG_CONFIG } from '@/lib/blogConfig'

export default function NewsletterForm({ className }: { className?: string }) {
  const config = BLOG_CONFIG.newsletter

  if (config.provider === 'none') {
    return null
  }

  const method = config.method ?? 'post'
  const emailFieldName = config.emailFieldName ?? 'EMAIL'
  const submitLabel = config.submitLabel ?? 'Subscribe'

  return (
    <section className={className} aria-label="Newsletter">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-premium">
        <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">Stay in the loop</h3>
        <p className="text-gray-600 mb-6">Get new posts, product updates, and research notes once a week.</p>
        <form action={config.action} method={method} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            name={emailFieldName}
            required
            placeholder="you@company.com"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent-400)]"
          />
          <button
            type="submit"
            className="rounded-lg bg-[var(--accent-700)] text-white px-6 py-3 font-semibold hover:bg-[var(--accent-800)] transition-colors"
          >
            {submitLabel}
          </button>
          {config.hiddenFields
            ? Object.entries(config.hiddenFields).map(([key, value]) => (
                <input key={key} type="hidden" name={key} value={value} />
              ))
            : null}
        </form>
        {config.privacyText ? (
          <p className="text-sm text-gray-500 mt-4">{config.privacyText}</p>
        ) : null}
      </div>
    </section>
  )
}
