'use client'

import { useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string
          callback: (token: string) => void
          'error-callback'?: () => void
          'expired-callback'?: () => void
          appearance?: 'always' | 'execute' | 'interaction-only'
          size?: 'normal' | 'compact' | 'flexible'
        },
      ) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

export type TurnstileRef = {
  reset: () => void
}

type TurnstileProps = {
  onVerify: (token: string) => void
  onError?: () => void
}

const SCRIPT_ID = 'cf-turnstile-script'
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

const Turnstile = forwardRef<TurnstileRef, TurnstileProps>(function Turnstile(
  { onVerify, onError },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''

  const renderWidget = useCallback(() => {
    if (!window.turnstile || !containerRef.current || !siteKey) return
    if (widgetIdRef.current) return

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: onVerify,
      'error-callback': onError,
      'expired-callback': () => onVerify(''),
      appearance: 'interaction-only',
    })
  }, [siteKey, onVerify, onError])

  useEffect(() => {
    if (!siteKey) return

    if (document.getElementById(SCRIPT_ID)) {
      if (window.turnstile) renderWidget()
      return
    }

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = SCRIPT_SRC
    script.async = true
    script.onload = () => renderWidget()
    document.head.appendChild(script)
  }, [siteKey, renderWidget])

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current)
      }
    },
  }))

  if (!siteKey) return null

  return <div ref={containerRef} />
})

export default Turnstile
