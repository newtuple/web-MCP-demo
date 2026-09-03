'use client'

// The one conversational surface on the site, present on every page - home
// included. It merges what used to be two inputs (the homepage hero box and
// the floating launcher) into a single chatbot that:
//
//   - navigates: sends the visitor to the one real page that matches
//   - personalizes: reshapes the current page around the visitor's profile
//   - contacts: collects a lead right here in the chat, with a Regarding
//     field auto-filled from the page the conversation started on
//   - clarifies: asks one question when the request is too vague
//
// The same classifier an agent reaches through the navigate_site WebMCP tool
// is what this panel calls (lib/navigate/client.ts), so a human typing here
// and an agent calling the tool get identical behaviour.

import { FormEvent, useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Activity, ArrowUpRight, Loader2, Send, Sparkles, X } from 'lucide-react'
import Turnstile, { TurnstileRef } from '@/components/ui/Turnstile'
import { registerAssistant, type AssistantCommand } from '@/lib/assistant/store'
import { agentActivityVisibilityStore, logAgentActivity, toggleAgentActivityVisibility } from '@/lib/agentActivity/store'
import { inferVisitorContext, productSlugForGoal } from '@/lib/adaptiveSite'
import { resolveContactRegarding, setContactRegarding } from '@/lib/contactRegarding'
import { askNavigator } from '@/lib/navigate/client'
import { setSiteNavigator } from '@/lib/navigate/router'
import { PAGE_CATALOG } from '@/lib/navigate/schema'
import { closePageView, openPageView } from '@/lib/pageView/store'
import { regardingForPath } from '@/lib/products'
import { useVisitorContext } from './useVisitorContext'

type TurnKind = 'user' | 'assistant' | 'error'
interface Turn {
  kind: TurnKind
  text: string
}

type ContactStage = 'name' | 'reach' | 'details' | 'done'

interface ContactLeadDraft {
  name: string
  email: string
  phone: string
  consent: boolean
  regarding: string
  message: string
}

const EMPTY_LEAD: ContactLeadDraft = { name: '', email: '', phone: '', consent: false, regarding: '', message: '' }

const isValidEmail = (value: string) =>
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/.test(value)
const isValidPhone = (value: string) => !value || /^[+]?[\d\s()-]{7,20}$/.test(value)

const pageTitle = (slug: string) => PAGE_CATALOG.find((p) => p.slug === slug)?.title ?? slug

const inputClass =
  'min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-[var(--accent-400,#6090fa)] focus:bg-white focus:ring-2 focus:ring-[var(--accent-100,#dbe6fe)]'
const primaryButtonClass =
  'inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[var(--accent-900,#0047AB)] px-3 text-sm font-semibold text-white transition disabled:opacity-40'

export default function SiteAssistant() {
  const router = useRouter()
  const pathname = usePathname()
  const { replaceContext } = useVisitorContext()

  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [turns, setTurns] = useState<Turn[]>([])
  const [busy, setBusy] = useState(false)

  const [contactStage, setContactStage] = useState<ContactStage | null>(null)
  const [lead, setLead] = useState<ContactLeadDraft>(EMPTY_LEAD)
  const [contactError, setContactError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const turnstileRef = useRef<TurnstileRef>(null)
  const contactStartedAt = useRef(Date.now())
  const onTurnstileVerify = useCallback((token: string) => setTurnstileToken(token), [])

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const pathnameRef = useRef(pathname)
  pathnameRef.current = pathname

  // Bridge for navigate_site (the WebMCP tool) to move the browser client-side.
  useEffect(() => setSiteNavigator((path) => router.push(path)), [router])

  useEffect(() => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [turns, contactStage, busy])

  const pushTurn = useCallback((kind: TurnKind, text: string) => {
    setTurns((prev) => [...prev, { kind, text }])
  }, [])

  const startContactFlow = useCallback(
    (regarding?: string) => {
      const resolved =
        (regarding ?? '').trim() || regardingForPath(pathnameRef.current) || resolveContactRegarding()
      if (resolved) setContactRegarding(resolved)
      contactStartedAt.current = Date.now()
      setLead((prev) => ({ ...EMPTY_LEAD, ...prev, regarding: resolved }))
      setContactStage('name')
      setContactError(null)
      pushTurn(
        'assistant',
        resolved
          ? `Happy to connect you with the team about ${resolved}. First, what's your name?`
          : "Happy to connect you with the team. First, what's your name?",
      )
    },
    [pushTurn],
  )

  const send = useCallback(
    async (raw: string) => {
      const value = raw.trim()
      if (!value || busy) return

      pushTurn('user', value)
      setMessage('')

      // Local shortcut: closing the in-place page view needs no model call.
      if (/^(go back|back|close( the (page|view))?|close it)$/i.test(value)) {
        closePageView()
        logAgentActivity('close_page_view', 'Assistant closed the in-place page view')
        pushTurn('assistant', 'Closed the page view - you are back on the original page.')
        return
      }

      setBusy(true)

      const result = await askNavigator(value)

      if (!result.ok || !result.decision) {
        pushTurn('error', result.error ?? 'Something went wrong. Try again.')
        setBusy(false)
        return
      }

      const { decision } = result

      if (decision.decision === 'navigate' && decision.page) {
        // WebMCP-native: morph the current screen into the page instead of
        // routing. Only "home" routes for real - it means the site itself.
        if (decision.page === 'home') {
          closePageView()
          logAgentActivity('close_page_view', 'Assistant took you back to the homepage')
          pushTurn('assistant', 'Taking you back to the homepage.')
          router.push('/')
        } else {
          openPageView(decision.page)
          logAgentActivity('render_page_view', `Assistant opened "${decision.page}" in place, no reload`)
          pushTurn('assistant', `Showing ${pageTitle(decision.page)} right here - no page reload. Say "go back" or close the view to return.`)
        }
        setBusy(false)
        return
      }

      if (decision.decision === 'contact') {
        startContactFlow(decision.regarding ?? undefined)
        logAgentActivity('prepare_contact_request', 'Assistant staged a contact request for you to confirm')
        setBusy(false)
        return
      }

      if (decision.decision === 'personalize') {
        const context = replaceContext(inferVisitorContext(value))
        logAgentActivity('set_visitor_context', `Assistant personalized the site for: ${context.goal}`)
        // When the profile clearly points at one product, don't just re-theme -
        // bring that product's view up on this screen too.
        const productSlug = productSlugForGoal(context.goal)
        if (productSlug) {
          openPageView(productSlug)
          logAgentActivity('render_page_view', `Assistant opened "${productSlug}" in place, no reload`)
          pushTurn(
            'assistant',
            `Done - the site is now shaped around ${context.goal}, and ${pageTitle(productSlug)} is on your screen right now. Keep telling me what you need, or say "go back".`,
          )
        } else {
          pushTurn('assistant', `Done - the site is now shaped around: ${context.goal}. Look around, or keep telling me what you need.`)
        }
        setBusy(false)
        return
      }

      pushTurn('assistant', decision.question || 'Could you say more about what you are looking for?')
      setBusy(false)
    },
    [busy, pushTurn, replaceContext, router, startContactFlow],
  )

  // Commands from the rest of the site: hero prompt chips, product subnav
  // CTAs, and the prepare_contact_request WebMCP tool.
  useEffect(() => {
    return registerAssistant((command: AssistantCommand) => {
      setOpen(true)
      if (command.contact) {
        startContactFlow(command.regarding)
        if (command.message) setLead((prev) => ({ ...prev, message: command.message ?? '' }))
        return
      }
      if (command.message) {
        if (command.sendNow) void send(command.message)
        else setMessage(command.message)
      }
    })
  }, [send, startContactFlow])

  const submitChat = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void send(message)
  }

  const handleNameSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = lead.name.trim()
    if (name.length < 2) {
      setContactError('Please enter your name.')
      return
    }
    setContactError(null)
    pushTurn('user', name)
    setLead((prev) => ({ ...prev, name }))
    pushTurn('assistant', 'How can we reach you?')
    setContactStage('reach')
  }

  const handleReachSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const email = lead.email.trim()
    const phone = lead.phone.trim()
    if (!isValidEmail(email)) {
      setContactError('Please enter a valid email address.')
      return
    }
    if (!isValidPhone(phone)) {
      setContactError('Please enter a valid phone number.')
      return
    }
    if (!lead.consent) {
      setContactError('Please agree to be contacted.')
      return
    }
    setContactError(null)
    pushTurn('user', phone ? `${email} · ${phone}` : email)
    setLead((prev) => ({ ...prev, email, phone }))
    pushTurn('assistant', 'What would you like to discuss? You can adjust what this is regarding too.')
    setContactStage('details')
  }

  const handleDetailsSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return
    const regarding = lead.regarding.trim()
    const body = lead.message.trim()
    if (!body) {
      setContactError('Please add a short message.')
      return
    }
    setContactError(null)
    setSubmitting(true)

    const shownMessage = regarding ? `Regarding ${regarding}: ${body}` : body
    const transcript = [...turns, { kind: 'user' as const, text: shownMessage }]
      .map((turn) => `${turn.kind === 'user' ? 'User' : 'Assistant'}: ${turn.text}`)
      .join('\n')

    try {
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead: {
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            intentType: 'services',
            intent: regarding ? `Contact regarding ${regarding}` : 'Website chat contact',
            resumeLink: '',
            message: body,
            consent: lead.consent,
            regarding,
          },
          transcript,
          _hp: honeypot,
          _t: contactStartedAt.current,
          _cf_turnstile: turnstileToken,
        }),
      })

      const payload = (await response.json().catch(() => ({}))) as { error?: string }

      if (!response.ok) {
        setContactError(payload.error ?? 'Failed to submit your request. Try again.')
        turnstileRef.current?.reset()
        setTurnstileToken('')
        setSubmitting(false)
        return
      }

      pushTurn('user', shownMessage)
      logAgentActivity('submit_contact_request', 'Assistant submitted a contact request (consent given)')
      pushTurn('assistant', "Thanks! Your message is with the team - we'll get back to you shortly. Anything else I can help with?")
      setContactStage('done')
      setLead(EMPTY_LEAD)
      setSubmitting(false)
    } catch {
      setContactError('Network error. Please try again in a moment.')
      turnstileRef.current?.reset()
      setTurnstileToken('')
      setSubmitting(false)
    }
  }

  const cancelContact = () => {
    setContactStage(null)
    setContactError(null)
    pushTurn('assistant', 'No problem - what else can I help you find?')
  }

  const contactActive = contactStage === 'name' || contactStage === 'reach' || contactStage === 'details'

  const activityFeedVisible = useSyncExternalStore(
    agentActivityVisibilityStore.subscribe,
    agentActivityVisibilityStore.getSnapshot,
    agentActivityVisibilityStore.getServerSnapshot,
  )

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 print:hidden">
      {open && (
        <div className="flex w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <Sparkles className="h-3.5 w-3.5 text-[var(--accent-900,#0047AB)]" />
              Newtuple Assistant
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleAgentActivityVisibility}
                className={
                  activityFeedVisible
                    ? 'inline-flex items-center gap-1 rounded-full bg-[var(--accent-50,#eff4ff)] px-2 py-1 text-[11px] font-medium text-[var(--accent-700,#1d38d8)] transition'
                    : 'inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium text-slate-400 transition hover:text-slate-600'
                }
                aria-pressed={activityFeedVisible}
                aria-label="Toggle the WebMCP tool activity feed"
              >
                <Activity className="h-3.5 w-3.5" />
                Tool activity
              </button>
              <button type="button" onClick={() => setOpen(false)} className="text-slate-400 transition hover:text-slate-700" aria-label="Close assistant">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="max-h-80 space-y-2 overflow-y-auto px-4 py-3">
            {turns.length === 0 && (
              <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-600">
                Tell me what you&apos;re trying to do - I can take you to the right page, reshape the site around your goals, or connect you with the team.
              </div>
            )}
            {turns.map((turn, index) => (
              <div
                key={index}
                className={
                  turn.kind === 'user'
                    ? 'ml-auto max-w-[85%] rounded-lg bg-[var(--accent-900,#0047AB)] px-3 py-2 text-sm text-white'
                    : turn.kind === 'error'
                      ? 'max-w-[85%] rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700'
                      : 'max-w-[85%] rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700'
                }
              >
                {turn.text}
              </div>
            ))}
            {busy && (
              <div className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-500">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Thinking
              </div>
            )}
          </div>

          {contactStage === 'name' && (
            <form onSubmit={handleNameSubmit} className="space-y-2 border-t border-slate-100 p-3">
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={lead.name}
                  onChange={(event) => setLead((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Your name"
                  className={inputClass}
                  aria-label="Your name"
                />
                <button type="submit" className={primaryButtonClass}>Next</button>
              </div>
              {contactError && <p className="text-xs text-red-600">{contactError}</p>}
              <button type="button" onClick={cancelContact} className="text-xs font-medium text-slate-400 transition hover:text-slate-700">
                Cancel
              </button>
            </form>
          )}

          {contactStage === 'reach' && (
            <form onSubmit={handleReachSubmit} className="space-y-2 border-t border-slate-100 p-3">
              <input
                autoFocus
                type="email"
                value={lead.email}
                onChange={(event) => setLead((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="Email address *"
                className={`${inputClass} w-full`}
                aria-label="Email address"
              />
              <input
                type="tel"
                value={lead.phone}
                onChange={(event) => setLead((prev) => ({ ...prev, phone: event.target.value }))}
                placeholder="Phone (optional)"
                className={`${inputClass} w-full`}
                aria-label="Phone number"
              />
              <label className="flex cursor-pointer items-center gap-2 select-none">
                <input
                  type="checkbox"
                  checked={lead.consent}
                  onChange={(event) => setLead((prev) => ({ ...prev, consent: event.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-[var(--accent-900,#0047AB)]"
                />
                <span className="text-xs text-slate-600">I agree to be contacted by Newtuple</span>
              </label>
              {contactError && <p className="text-xs text-red-600">{contactError}</p>}
              <div className="flex items-center justify-between">
                <button type="button" onClick={cancelContact} className="text-xs font-medium text-slate-400 transition hover:text-slate-700">
                  Cancel
                </button>
                <button type="submit" className={primaryButtonClass}>Next</button>
              </div>
            </form>
          )}

          {contactStage === 'details' && (
            <form onSubmit={handleDetailsSubmit} className="space-y-2 border-t border-slate-100 p-3">
              {/* Honeypot - hidden from real users */}
              <div className="absolute -z-10 h-0 overflow-hidden opacity-0" aria-hidden="true">
                <input type="text" name="website" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} tabIndex={-1} autoComplete="off" />
              </div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Regarding
                <input
                  value={lead.regarding}
                  onChange={(event) => setLead((prev) => ({ ...prev, regarding: event.target.value }))}
                  placeholder="What is this about?"
                  className={`${inputClass} mt-1 w-full font-normal normal-case tracking-normal`}
                  aria-label="Regarding"
                />
              </label>
              <textarea
                autoFocus
                value={lead.message}
                onChange={(event) => setLead((prev) => ({ ...prev, message: event.target.value }))}
                placeholder="Your message *"
                rows={3}
                className={`${inputClass} w-full resize-none`}
                aria-label="Message"
              />
              <Turnstile ref={turnstileRef} onVerify={onTurnstileVerify} />
              {contactError && <p className="text-xs text-red-600">{contactError}</p>}
              <div className="flex items-center justify-between">
                <button type="button" onClick={cancelContact} className="text-xs font-medium text-slate-400 transition hover:text-slate-700">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className={primaryButtonClass}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {submitting ? 'Sending' : 'Send'}
                </button>
              </div>
            </form>
          )}

          {!contactActive && (
            <form onSubmit={submitChat} className="flex items-center gap-2 border-t border-slate-100 p-3">
              <input
                autoFocus
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="What are you trying to do or see?"
                disabled={busy}
                className={inputClass}
                aria-label="Message the Newtuple assistant"
              />
              <button
                type="submit"
                disabled={busy || !message.trim()}
                className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--accent-900,#0047AB)] text-white transition disabled:opacity-40"
                aria-label="Send"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </form>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-xl transition hover:border-slate-400"
      >
        <Sparkles className="h-4 w-4 text-[var(--accent-900,#0047AB)]" />
        Ask Newtuple
        <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
      </button>
    </div>
  )
}
