'use client'

// Remembers what a contact request is most likely about, so the contact form
// (page or in-chat) opens with its Regarding field already filled in.
//
// Sources, strongest first:
//   1. An explicit ?regarding= query param on /contactus (a product subnav CTA
//      or the assistant set it on navigation).
//   2. The last product page the visitor was on, recorded by ProductSubnav.
//
// sessionStorage, same as the visitor context: per tab, gone when the tab closes.

const STORAGE_KEY = 'newtuple:contact-regarding:v1'
const MAX_LENGTH = 200

const clean = (value: string) => value.replace(/\s+/g, ' ').trim().slice(0, MAX_LENGTH)

export function setContactRegarding(value: string) {
  if (typeof window === 'undefined') return
  const cleaned = clean(value)
  try {
    if (cleaned) window.sessionStorage.setItem(STORAGE_KEY, cleaned)
    else window.sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage unavailable; the field just starts empty.
  }
}

export function getContactRegarding(): string {
  if (typeof window === 'undefined') return ''
  try {
    return clean(window.sessionStorage.getItem(STORAGE_KEY) ?? '')
  } catch {
    return ''
  }
}

/** Query param beats stored value; reads window directly so static export never needs useSearchParams. */
export function resolveContactRegarding(): string {
  if (typeof window === 'undefined') return ''
  const fromQuery = clean(new URLSearchParams(window.location.search).get('regarding') ?? '')
  if (fromQuery) {
    setContactRegarding(fromQuery)
    return fromQuery
  }
  return getContactRegarding()
}
