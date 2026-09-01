'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  DEFAULT_VISITOR_CONTEXT,
  VISITOR_CONTEXT_EVENT,
  VISITOR_CONTEXT_STORAGE_KEY,
  generateAdaptiveSiteVariant,
  mergeVisitorContext,
  normalizeVisitorContext,
  type VisitorContext,
} from '@/lib/adaptiveSite'

const readStoredContext = (): VisitorContext => {
  if (typeof window === 'undefined') return DEFAULT_VISITOR_CONTEXT
  try {
    const raw = window.sessionStorage.getItem(VISITOR_CONTEXT_STORAGE_KEY)
    if (!raw) return DEFAULT_VISITOR_CONTEXT
    return normalizeVisitorContext(JSON.parse(raw))
  } catch {
    return DEFAULT_VISITOR_CONTEXT
  }
}

const writeStoredContext = (context: VisitorContext) => {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(VISITOR_CONTEXT_STORAGE_KEY, JSON.stringify(context))
  } catch {
    // sessionStorage unavailable — context still works for this render
  }
}

const broadcast = (context: VisitorContext) => {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent<VisitorContext>(VISITOR_CONTEXT_EVENT, { detail: context }))
}

export function useVisitorContext() {
  const [context, setContext] = useState<VisitorContext>(DEFAULT_VISITOR_CONTEXT)

  useEffect(() => {
    setContext(readStoredContext())
    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<VisitorContext>).detail
      if (detail) setContext(detail)
    }
    window.addEventListener(VISITOR_CONTEXT_EVENT, onChange)
    return () => window.removeEventListener(VISITOR_CONTEXT_EVENT, onChange)
  }, [])

  const commit = useCallback((next: VisitorContext) => {
    writeStoredContext(next)
    setContext(next)
    broadcast(next)
    return next
  }, [])

  const replaceContext = useCallback((next: Partial<VisitorContext>) => commit(normalizeVisitorContext(next)), [commit])
  const updateContext = useCallback((patch: Partial<VisitorContext>) => commit(mergeVisitorContext(readStoredContext(), patch)), [commit])
  const resetContext = useCallback(() => commit(DEFAULT_VISITOR_CONTEXT), [commit])

  const variant = generateAdaptiveSiteVariant(context)

  return { context, variant, replaceContext, updateContext, resetContext }
}
