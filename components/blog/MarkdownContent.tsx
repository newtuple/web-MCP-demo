/* eslint-disable @next/next/no-img-element */

import React, { Children, isValidElement } from 'react'
import ReactMarkdown, { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

const ALERT_TYPES = ['NOTE', 'TIP', 'IMPORTANT', 'WARNING', 'CAUTION'] as const
type AlertType = (typeof ALERT_TYPES)[number]

const alertStyles: Record<AlertType, { border: string; bg: string; icon: string; label: string; svg: string }> = {
  NOTE:      { border: 'border-blue-300',    bg: 'bg-blue-50',    icon: 'text-blue-600',    label: 'Note',      svg: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  TIP:       { border: 'border-emerald-300', bg: 'bg-emerald-50', icon: 'text-emerald-600', label: 'Tip',       svg: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
  IMPORTANT: { border: 'border-violet-300',  bg: 'bg-violet-50',  icon: 'text-violet-600',  label: 'Important', svg: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z' },
  WARNING:   { border: 'border-amber-300',   bg: 'bg-amber-50',   icon: 'text-amber-600',   label: 'Warning',   svg: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z' },
  CAUTION:   { border: 'border-red-300',     bg: 'bg-red-50',     icon: 'text-red-600',     label: 'Caution',   svg: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728A9 9 0 015.636 5.636' },
}

/**
 * Preprocess markdown to convert GitHub-style alert blockquotes into
 * a detectable format. Converts:
 *   > [!NOTE]
 *   > Some content here
 * Into:
 *   > %%ALERT:NOTE%% Some content here
 */
function preprocessAlerts(md: string): string {
  const pattern = /^> \[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n((?:^> .*(?:\n|$))*)/gm
  return md.replace(pattern, (_match, type: string, body: string) => {
    const bodyLines = body
      .split('\n')
      .map((line) => line.replace(/^> ?/, ''))
      .filter((line) => line.length > 0 || body.includes('\n\n'))
    return `> %%ALERT:${type}%% ${bodyLines.join('\n> ')}\n`
  })
}

/**
 * Preprocess markdown to detect YouTube embeds and convert them into a
 * detectable %%YOUTUBE:ID%% marker on its own paragraph. Accepts a raw
 * <iframe> embed, a youtu.be link, or a watch?v= / embed/ URL on its own line.
 */
function preprocessYouTube(md: string): string {
  const idPattern = '([\\w-]{11})'
  const patterns = [
    new RegExp(`^<iframe[^>]*src="[^"]*(?:youtube\\.com/embed/|youtu\\.be/)${idPattern}[^"]*"[^>]*></iframe>\\s*$`, 'gim'),
    new RegExp(`^\\s*https?://(?:www\\.)?youtube\\.com/watch\\?v=${idPattern}[^\\s]*\\s*$`, 'gim'),
    new RegExp(`^\\s*https?://(?:www\\.)?youtube\\.com/embed/${idPattern}[^\\s]*\\s*$`, 'gim'),
    new RegExp(`^\\s*https?://(?:www\\.)?youtu\\.be/${idPattern}[^\\s]*\\s*$`, 'gim'),
  ]
  let out = md
  for (const p of patterns) {
    out = out.replace(p, (_m, id: string) => `\n%%YOUTUBE:${id}%%\n`)
  }
  return out
}

/** Recursively extract plain text from React children */
function extractText(node: React.ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (!node) return ''
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (isValidElement(node)) {
    return extractText((node.props as { children?: React.ReactNode }).children)
  }
  return ''
}

/** Strip the %%ALERT:TYPE%% marker from React children, returning cleaned children */
function stripMarker(children: React.ReactNode, marker: string): React.ReactNode {
  let done = false
  function walk(node: React.ReactNode): React.ReactNode {
    if (done) return node
    if (typeof node === 'string') {
      const idx = node.indexOf(marker)
      if (idx !== -1) {
        done = true
        const after = node.slice(idx + marker.length).replace(/^ /, '')
        return after
      }
      return node
    }
    if (Array.isArray(node)) return node.map(walk)
    if (isValidElement(node)) {
      const props = node.props as { children?: React.ReactNode }
      const newChildren = walk(props.children)
      if (newChildren !== props.children) {
        return React.cloneElement(node, {}, newChildren)
      }
    }
    return node
  }
  return walk(children)
}

const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl md:text-5xl font-light tracking-tight text-gray-900 mb-6 antialiased">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mt-12 mb-4 antialiased">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 mt-8 mb-3 antialiased">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-lg md:text-xl font-bold tracking-tight text-gray-900 mt-10 mb-3 pt-2 border-t border-gray-100 antialiased">
      {children}
    </h4>
  ),
  h5: ({ children }) => (
    <h5 className="text-base md:text-lg font-bold tracking-tight text-gray-900 mt-6 mb-2 antialiased">
      {children}
    </h5>
  ),
  h6: ({ children }) => (
    <h6 className="text-sm md:text-base font-bold text-gray-900 mt-4 mb-2 antialiased">
      {children}
    </h6>
  ),
  p: ({ children }) => {
    const nodes = Children.toArray(children)

    // YouTube embed marker (see preprocessYouTube). Render a responsive 16:9 player.
    const ytMatch = extractText(children).trim().match(/^%%YOUTUBE:([\w-]{11})%%$/)
    if (ytMatch) {
      const id = ytMatch[1]
      return (
        <span className="block my-8">
          <span className="block relative w-full overflow-hidden rounded-xl border border-gray-200 shadow-premium" style={{ paddingTop: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${id}`}
              title="YouTube video player"
              frameBorder={0}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </span>
        </span>
      )
    }

    const single = nodes.length === 1 && isValidElement(nodes[0]) ? nodes[0] : null

    // Many migrated posts wrap entire paragraphs in **...**, which renders as a
    // single <strong> child. When that's the case, we treat it as normal body
    // copy (light weight) instead of shouting the whole paragraph.
    if (single && (single as any).type === 'strong') {
      return (
        <p className="text-lg leading-relaxed text-gray-700 font-light mb-5 antialiased">
          {(single as any).props.children}
        </p>
      )
    }

    return (
      <p className="text-lg leading-relaxed text-gray-700 font-light mb-5 antialiased [&_strong]:font-medium [&_strong]:text-gray-900">
        {children}
      </p>
    )
  },
  ul: ({ children }) => (
    <ul className="list-disc list-outside pl-6 text-lg text-gray-700 font-light mb-5 space-y-2 antialiased [&_strong]:font-semibold [&_strong]:text-gray-900">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside pl-6 text-lg text-gray-700 font-light mb-5 space-y-2 antialiased [&_strong]:font-semibold [&_strong]:text-gray-900">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-medium text-gray-800 antialiased">{children}</strong>
  ),
  a: ({ children, href }) => (
    <a
      className="text-[var(--accent-700)] underline underline-offset-4 hover:text-[var(--accent-900)] transition-colors font-normal"
      href={href}
    >
      {children}
    </a>
  ),
  code: ({ children, className }) => {
    if (className) {
      return (
        <code className={`text-sm font-mono antialiased ${className}`}>{children}</code>
      )
    }
    return (
      <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 text-sm font-mono font-normal antialiased">
        {children}
      </code>
    )
  },
  pre: ({ children }) => (
    <pre className="bg-gray-950 text-gray-100 rounded-xl p-5 overflow-x-auto mb-6 text-sm font-normal antialiased [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit [&_code]:rounded-none [&_code]:font-normal [&_a]:text-inherit [&_a]:underline [&_a]:underline-offset-2">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => {
    const text = extractText(children).trim()
    const markerMatch = text.match(/^%%ALERT:(NOTE|TIP|IMPORTANT|WARNING|CAUTION)%%/)
    if (markerMatch) {
      const type = markerMatch[1] as AlertType
      const s = alertStyles[type]
      const stripped = stripMarker(children, markerMatch[0])
      return (
        <div className={`${s.bg} ${s.border} border-l-4 rounded-r-lg px-5 py-4 mb-6`}>
          <div className={`flex items-center gap-2 ${s.icon} font-semibold text-sm mb-1`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d={s.svg} />
            </svg>
            {s.label}
          </div>
          <div className="text-gray-700 text-base font-light [&>p]:mb-0 [&>p]:text-base [&>p]:font-light">
            {stripped}
          </div>
        </div>
      )
    }
    return (
      <blockquote className="border-l-4 border-[var(--accent-200)] pl-4 italic text-gray-600 mb-5 font-normal antialiased">
        {children}
      </blockquote>
    )
  },
  hr: () => <hr className="border-gray-200 my-10" />,
  img: ({ src, alt }) => {
    const isAuthorImage = alt?.startsWith('Writer:')
    if (isAuthorImage) {
      return (
        <img
          src={src}
          alt={alt || ''}
          className="inline-block w-8 h-8 rounded-full object-cover border border-gray-200"
          loading="lazy"
        />
      )
    }
    return (
      <span className="block my-8">
        <img
          src={src}
          alt={alt || ''}
          className="w-full rounded-xl border border-gray-200 shadow-premium"
          loading="lazy"
        />
        {alt && alt !== '' && (
          <span className="block text-center text-sm text-gray-500 mt-3 font-light">{alt}</span>
        )}
      </span>
    )
  },
  table: ({ children }) => (
    <div className="overflow-x-auto my-8 rounded-xl border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-gray-50">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-sm text-gray-700 border-t border-gray-100">{children}</td>
  ),
}

export default function MarkdownContent({ content }: { content: string }) {
  const processed = preprocessYouTube(preprocessAlerts(content))
  return (
    <div className="article-prose antialiased">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {processed}
      </ReactMarkdown>
    </div>
  )
}
