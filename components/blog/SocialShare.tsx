'use client'

import { useState } from 'react'
import { Check, Share2 } from 'lucide-react'

type SocialShareProps = {
  title: string
  description: string
}

export default function SocialShare({ title, description }: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const copyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const input = document.createElement('textarea')
      input.value = url
      input.style.position = 'fixed'
      input.style.opacity = '0'
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      input.remove()
    }

    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  const shareArticle = async () => {
    const url = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({ title, text: description, url })
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
      }
    }

    await copyLink(url)
  }

  return (
    <button
      type="button"
      onClick={shareArticle}
      className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 font-medium text-gray-700 transition-colors hover:border-[var(--accent-300)] hover:bg-[var(--accent-50)] hover:text-[var(--accent-800)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-500)] focus-visible:ring-offset-2"
      aria-label={copied ? 'Article link copied' : 'Share article'}
      title={copied ? 'Link copied' : 'Share article'}
    >
      {copied ? <Check className="h-4 w-4" aria-hidden /> : <Share2 className="h-4 w-4" aria-hidden />}
      <span>{copied ? 'Link copied' : 'Share'}</span>
    </button>
  )
}
