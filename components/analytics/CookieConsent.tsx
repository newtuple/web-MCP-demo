'use client'

import { useState, useEffect } from 'react'

const CONSENT_KEY = 'cookie-consent'

export type ConsentState = 'accepted' | 'rejected' | null

export function getConsentState(): ConsentState {
  if (typeof window === 'undefined') return null
  const value = localStorage.getItem(CONSENT_KEY)
  if (value === 'accepted' || value === 'rejected') return value
  return null
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (getConsentState() === null) setVisible(true)
  }, [])

  function handleAccept() {
    localStorage.setItem(CONSENT_KEY, 'accepted')
    setVisible(false)
    window.dispatchEvent(new Event('cookie-consent-changed'))
  }

  function handleReject() {
    localStorage.setItem(CONSENT_KEY, 'rejected')
    setVisible(false)
    window.dispatchEvent(new Event('cookie-consent-changed'))
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 md:p-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white/95 backdrop-blur-sm shadow-[0_-8px_32px_-12px_rgba(15,23,42,0.15)] p-5 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <p className="text-sm text-gray-600 font-light leading-relaxed flex-1">
            We use cookies for analytics to improve your experience. See our{' '}
            <a href="/privacy-policy" className="text-cobalt-900 underline underline-offset-2 hover:text-cobalt-700">
              privacy policy
            </a>.
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleReject}
              className="rounded-full px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={handleAccept}
              className="rounded-full px-4 py-2 text-sm font-medium text-white bg-cobalt-900 hover:bg-cobalt-800 transition-colors"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
