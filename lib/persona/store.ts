'use client'

// Records which persona questions this visitor has already answered, so
// neither the chatbot nor an agent asks the same thing twice. Session-scoped,
// like the visitor context itself; cleared together with it on reset.

const STORAGE_KEY = 'newtuple:persona-answers:v1'

export function getPersonaAnswers(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, unknown>
    return Object.fromEntries(Object.entries(parsed).filter(([, v]) => typeof v === 'string')) as Record<string, string>
  } catch {
    return {}
  }
}

export function recordPersonaAnswers(answers: Record<string, string>) {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...getPersonaAnswers(), ...answers }))
  } catch {
    // Storage unavailable: questions may repeat, nothing breaks.
  }
}

export function clearPersonaAnswers() {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nothing to clear.
  }
}
