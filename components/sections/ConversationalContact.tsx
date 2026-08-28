'use client'

import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Loader2, Send, Sparkles } from 'lucide-react'
import HighlightedText from '@/components/ui/HighlightedText'
import Turnstile, { TurnstileRef } from '@/components/ui/Turnstile'

type Message = {
  id: string
  role: 'assistant' | 'user'
  content: string
  streaming?: boolean
  stepId?: string
}

type Step = {
  id: string
  prompt: string
  kind: 'text' | 'contact' | 'choice' | 'details'
}

type LeadState = {
  name: string
  email: string
  phone: string
  intent: string
  intentType: 'job' | 'services' | ''
  resumeLink: string
  message: string
  consent: boolean
}

interface ConversationalContactProps {
  title: string
  titleHighlight?: string
  description: string
  thankYouTitle: string
  thankYouDescription: string
}

const STEPS: Step[] = [
  { id: 'name', prompt: "Hi, what's your name?", kind: 'text' },
  { id: 'contact', prompt: "Great! How can we reach you?", kind: 'contact' },
  { id: 'intent-choice', prompt: 'What brings you here today?', kind: 'choice' },
  { id: 'details', prompt: '', kind: 'details' },
]

const STEP_LABELS: Record<Step['id'], string> = {
  name: 'Name',
  contact: 'Contact',
  'intent-choice': 'Interest',
  details: 'Details',
}

const DETAIL_PROMPTS: Record<string, string> = {
  job: 'Share your resume link and any message for us.',
  services: "Tell us what you're hoping to build or explore.",
}

export default function ConversationalContact({
  title,
  titleHighlight = 'AI experts',
  description,
  thankYouTitle,
  thankYouDescription,
}: ConversationalContactProps) {
  const prefersReducedMotion = useReducedMotion()
  const [messages, setMessages] = useState<Message[]>([])
  const [stepIndex, setStepIndex] = useState(0)
  const [nameInput, setNameInput] = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [phoneInput, setPhoneInput] = useState('')
  const [consentChecked, setConsentChecked] = useState(false)
  const [resumeInput, setResumeInput] = useState('')
  const [intentInput, setIntentInput] = useState('')
  const [messageInput, setMessageInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'failed' | 'success'>('idle')
  const [honeypot, setHoneypot] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const formLoadedAt = useRef(Date.now())
  const turnstileRef = useRef<TurnstileRef>(null)
  const onTurnstileVerify = useCallback((token: string) => setTurnstileToken(token), [])
  const [lead, setLead] = useState<LeadState>({
    name: '',
    email: '',
    phone: '',
    intent: '',
    intentType: '',
    resumeLink: '',
    message: '',
    consent: false,
  })

  const promptRef = useRef<number | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const promptTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const currentStep = STEPS[stepIndex]

  useEffect(() => {
    if (submitted || !currentStep) return
    if (promptRef.current !== stepIndex) {
      const prompt = currentStep.id === 'details'
        ? DETAIL_PROMPTS[lead.intentType] || "Tell us more."
        : currentStep.prompt
      streamStaticPrompt(prompt, currentStep.id)
      promptRef.current = stepIndex
    }
  }, [currentStep, stepIndex, submitted]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, isStreaming])

  useEffect(() => {
    if (submitted) return
    if (currentStep?.kind === 'choice') return
    if (currentStep?.id === 'details') return
    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, 120)
    return () => clearTimeout(timer)
  }, [currentStep, submitted])

  useEffect(() => {
    if (submitted) return
    if (currentStep?.kind === 'choice') return
    if (currentStep?.id === 'details') return
    if (isStreaming) return
    const raf = requestAnimationFrame(() => {
      inputRef.current?.focus()
      requestAnimationFrame(() => {
        inputRef.current?.focus()
      })
    })
    return () => cancelAnimationFrame(raf)
  }, [isStreaming, currentStep, submitted])

  const messageVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 10 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: prefersReducedMotion ? 0 : -6 },
    }),
    [prefersReducedMotion]
  )

  const addMessage = (role: Message['role'], content: string, streaming = false, stepId?: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        role,
        content,
        streaming,
        stepId,
      },
    ])
  }

  const updateMessage = (id: string, updater: (current: string) => string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, content: updater(msg.content) } : msg))
    )
  }

  const setMessageStreaming = (id: string, streaming: boolean) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, streaming } : msg))
    )
  }

  const isValidEmail = (value: string) =>
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/.test(value)

  const isValidPhone = (value: string) => !value || /^[+]?[\d\s()-]{7,20}$/.test(value)

  const advanceStep = () => {
    setStepIndex((prev) => prev + 1)
    setError(null)
  }

  const goToStep = (stepId: string) => {
    if (isStreaming || submitted) return
    const targetIndex = STEPS.findIndex((s) => s.id === stepId)
    if (targetIndex === -1) return

    // Find the assistant message for this step and truncate everything from there
    const assistantIdx = messages.findIndex(
      (msg) => msg.role === 'assistant' && msg.stepId === stepId
    )
    if (assistantIdx === -1) return

    setMessages(messages.slice(0, assistantIdx))

    // Pre-fill inputs with existing lead data
    if (stepId === 'name') setNameInput(lead.name)
    if (stepId === 'contact') {
      setEmailInput(lead.email)
      setPhoneInput(lead.phone)
      setConsentChecked(lead.consent)
    }
    if (stepId === 'intent-choice') {
      // Reset intent type so they can re-choose
      setLead((prev) => ({ ...prev, intentType: '' }))
    }
    if (stepId === 'details') {
      setResumeInput(lead.resumeLink)
      setIntentInput(lead.intent)
      setMessageInput(lead.message)
    }

    setStepIndex(targetIndex)
    promptRef.current = null
    setError(null)
  }

  const streamStaticPrompt = (text: string, stepId?: string) => {
    if (promptTimerRef.current) {
      clearInterval(promptTimerRef.current)
      promptTimerRef.current = null
    }

    const assistantId = `assistant-${Date.now()}`
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '', streaming: true, stepId },
    ])
    setIsStreaming(true)

    let index = 0
    promptTimerRef.current = setInterval(() => {
      if (index >= text.length) {
        if (promptTimerRef.current) {
          clearInterval(promptTimerRef.current)
          promptTimerRef.current = null
        }
        setMessageStreaming(assistantId, false)
        setIsStreaming(false)
        return
      }
      const slice = text.slice(index, index + 2)
      index += 2
      updateMessage(assistantId, (current) => current + slice)
    }, 45)
  }

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isStreaming || submitted) return
    const trimmed = nameInput.trim()
    if (!trimmed) {
      setError('Please enter your name.')
      return
    }
    addMessage('user', trimmed, false, 'name')
    setLead((prev) => ({ ...prev, name: trimmed }))
    setNameInput('')
    advanceStep()
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isStreaming || submitted) return
    const email = emailInput.trim()
    const phone = phoneInput.trim()
    if (!email) {
      setError('Please enter your email.')
      return
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (phone && !isValidPhone(phone)) {
      setError('Please enter a valid phone number.')
      return
    }
    if (!consentChecked) {
      setError('Please agree to be contacted.')
      return
    }
    addMessage('user', phone ? `${email} · ${phone}` : email, false, 'contact')
    setLead((prev) => ({ ...prev, email, phone, consent: true }))
    setEmailInput('')
    setPhoneInput('')
    advanceStep()
  }

  const handleChoice = (choice: 'job' | 'services') => {
    if (isStreaming || submitted) return
    const label =
      choice === 'job' ? 'Applying for a role' : 'Interested in talking to AI experts'
    addMessage('user', label, false, 'intent-choice')
    setLead((prev) => ({ ...prev, intentType: choice }))
    // Jump to details step
    const detailsIndex = STEPS.findIndex((s) => s.id === 'details')
    setStepIndex(detailsIndex)
    setError(null)
  }

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isStreaming || submitted || submitState === 'submitting') return

    const message = messageInput.trim()

    if (lead.intentType === 'job') {
      const resume = resumeInput.trim()
      if (!resume) {
        setError('Please share a link to your resume.')
        return
      }
      try {
        const parsed = new URL(resume)
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          setError('Resume link must be a valid http(s) URL.')
          return
        }
      } catch {
        setError('Please enter a valid URL for your resume.')
        return
      }
      if (!message) {
        setError('Please add a short message.')
        return
      }
      addMessage('user', `Resume: ${resume}${message ? `\n${message}` : ''}`)
      const finalLead = { ...lead, resumeLink: resume, message }
      setLead(finalLead)
      const transcript = buildTranscript([
        ...messages,
        { id: 'latest-user', role: 'user', content: `Resume: ${resume}\n${message}` },
      ])
      const didSubmit = await submitLead(finalLead, transcript)
      if (didSubmit) setSubmitted(true)
    } else {
      const intent = intentInput.trim()
      if (!intent && !message) {
        setError('Please tell us what you\'re looking for or leave a message.')
        return
      }
      addMessage('user', intent + (message ? `\n${message}` : ''))
      const finalLead = { ...lead, intent, message }
      setLead(finalLead)
      const transcript = buildTranscript([
        ...messages,
        { id: 'latest-user', role: 'user', content: `${intent}\n${message}` },
      ])
      const didSubmit = await submitLead(finalLead, transcript)
      if (didSubmit) setSubmitted(true)
    }
  }

  const submitLead = async (payload: LeadState, transcript: string) => {
    setSubmitState('submitting')
    setError(null)

    try {
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lead: payload,
          transcript,
          _hp: honeypot,
          _t: formLoadedAt.current,
          _cf_turnstile: turnstileToken,
        }),
      })

      const body = (await response.json().catch(() => ({}))) as {
        error?: string
      }

      if (!response.ok) {
        const retryAfter = response.headers.get('Retry-After')
        if (response.status === 429) {
          setError(
            retryAfter
              ? `Too many requests. Try again in ${retryAfter} seconds.`
              : 'Too many requests. Please try again later.',
          )
        } else {
          setError(body.error ?? 'Failed to submit your request.')
        }
        setSubmitState('failed')
        turnstileRef.current?.reset()
        setTurnstileToken('')
        return false
      }

      setSubmitState('success')
      return true
    } catch {
      setError('Network error. Please try again in a moment.')
      setSubmitState('failed')
      turnstileRef.current?.reset()
      setTurnstileToken('')
      return false
    }
  }

  const buildTranscript = (items: Message[]) =>
    items
      .map((msg) => `${msg.role === 'assistant' ? 'Assistant' : 'User'}: ${msg.content}`)
      .join('\n')

  // Split messages: everything before the last assistant message = history, last assistant = current
  const lastAssistantIdx = messages.reduce((acc, msg, i) => (msg.role === 'assistant' ? i : acc), -1)
  const historyMessages = lastAssistantIdx > 0 ? messages.slice(0, lastAssistantIdx) : []
  const currentPrompt = lastAssistantIdx >= 0 ? messages[lastAssistantIdx] : null

  const visibleStepCount = STEPS.length

  return (
    <section
      className="h-screen overflow-hidden bg-gradient-hero flex flex-col lg:flex-row"
      onClick={() => {
        if (submitted) return
        if (currentStep?.kind === 'choice') return
        if (currentStep?.id === 'details') return
        inputRef.current?.focus()
      }}
    >
      {/* ── Left sidebar: answered questions ── */}
      {historyMessages.length > 0 && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 320, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="hidden lg:flex h-full flex-col flex-shrink-0 border-r border-gray-200/60 overflow-hidden"
        >
          <div className="p-6 pt-10 overflow-y-auto flex-1">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-cobalt-900" />
              <span className="text-xs font-medium uppercase tracking-wider text-gray-400">Conversation</span>
            </div>
            <div ref={scrollRef} className="space-y-4">
              <AnimatePresence initial={false}>
                {historyMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={(e) => {
                      if (msg.role === 'user' && msg.stepId) {
                        e.stopPropagation()
                        goToStep(msg.stepId)
                      }
                    }}
                    className={`text-sm leading-relaxed ${
                      msg.role === 'assistant'
                        ? 'text-gray-500 font-light'
                        : 'text-gray-900 font-medium cursor-pointer hover:text-cobalt-900 transition-colors'
                    }`}
                  >
                    {msg.content}
                    {msg.role === 'user' && msg.stepId && (
                      <span className="ml-1.5 text-[10px] text-gray-400 font-normal">edit</span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Center: current question + input ── */}
      <div className="flex-1 h-full flex items-center justify-center px-4 py-5 md:px-6 md:py-8">
        <div className="w-full max-w-4xl flex flex-col items-center text-center">
          <div className="mb-6 md:mb-7">
            <h1 className="text-3xl md:text-5xl font-extralight text-gray-900 mb-2.5">
              <HighlightedText text={title} highlight={titleHighlight} highlightClassName="text-cobalt-900" />
            </h1>
            <p className="text-base md:text-lg text-gray-600 font-light max-w-4xl mx-auto">
              {description}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              {!submitted && currentStep ? (
                <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-medium text-gray-600">
                  Step {Math.min(stepIndex + 1, visibleStepCount)} / {visibleStepCount}
                </span>
              ) : null}
            </div>
          </div>

          {submitted ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4 mx-auto">
                <Send className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{thankYouTitle}</h3>
              <p className="text-gray-600 font-light">{thankYouDescription}</p>
            </div>
          ) : (
            <>
              {currentPrompt && (
                <motion.div
                  key={currentPrompt.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-2xl md:text-3xl text-gray-900 leading-snug text-center max-w-3xl font-extralight mb-6 md:mb-7"
                >
                  {currentPrompt.content || (currentPrompt.streaming ? '...' : '')}
                </motion.div>
              )}

              {/* Step-specific form content */}
              <div className="w-full max-w-3xl space-y-3">
                {submitState === 'submitting' ? (
                  <div className="mb-2 flex items-center justify-center text-xs">
                    <span className="inline-flex items-center gap-1 text-gray-500">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Submitting
                    </span>
                  </div>
                ) : null}

                {/* Step: Name */}
                {currentStep?.id === 'name' && (
                  <form onSubmit={handleNameSubmit} className="w-full space-y-3">
                    <div className="relative w-full border-b border-gray-300/90 pb-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        placeholder="Your name"
                        className="w-full bg-transparent text-2xl md:text-3xl text-gray-900 focus:outline-none text-center placeholder:text-gray-300"
                        disabled={isStreaming}
                        aria-label="Your name"
                      />
                    </div>
                    {error ? <p className="text-xs text-red-600 text-center">{error}</p> : null}
                    {nameInput.trim() && (
                      <div className="flex items-center justify-center">
                        <button
                          type="submit"
                          className="rounded-full bg-cobalt-900 text-white px-5 py-2 text-sm font-semibold"
                          disabled={isStreaming}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </form>
                )}

                {/* Step: Contact (email + phone + consent) */}
                {currentStep?.id === 'contact' && (
                  <form onSubmit={handleContactSubmit} className="w-full space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1 border-b border-gray-300/90 pb-2">
                        <input
                          ref={inputRef}
                          type="email"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder="Email address *"
                          className="w-full bg-transparent text-lg md:text-xl text-gray-900 focus:outline-none text-center placeholder:text-gray-300"
                          disabled={isStreaming}
                          aria-label="Email address"
                        />
                      </div>
                      <div className="flex-1 border-b border-gray-300/90 pb-2">
                        <input
                          type="tel"
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value)}
                          placeholder="Phone (optional)"
                          className="w-full bg-transparent text-lg md:text-xl text-gray-900 focus:outline-none text-center placeholder:text-gray-300"
                          disabled={isStreaming}
                          aria-label="Phone number"
                        />
                      </div>
                    </div>
                    <label className="flex items-center justify-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={consentChecked}
                        onChange={(e) => setConsentChecked(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-cobalt-900 focus:ring-cobalt-900"
                      />
                      <span className="text-sm text-gray-600">I agree to be contacted by Newtuple</span>
                    </label>
                    {error ? <p className="text-xs text-red-600 text-center">{error}</p> : null}
                    {emailInput.trim() && (
                      <div className="flex items-center justify-center">
                        <button
                          type="submit"
                          className="rounded-full bg-cobalt-900 text-white px-5 py-2 text-sm font-semibold"
                          disabled={isStreaming}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </form>
                )}

                {/* Step: Intent choice */}
                {currentStep?.kind === 'choice' && (
                  <div className="w-full space-y-3">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleChoice('job')}
                        className="rounded-full border border-cobalt-900 text-cobalt-900 px-5 py-2 text-sm font-semibold"
                      >
                        Applying for a role
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChoice('services')}
                        className="rounded-full bg-cobalt-900 text-white px-5 py-2 text-sm font-semibold"
                      >
                        Interested in talking to AI experts
                      </button>
                    </div>
                    {error ? <p className="text-xs text-red-600 text-center">{error}</p> : null}
                  </div>
                )}

                {/* Step: Details (job: resume + message / services: intent + message) */}
                {currentStep?.id === 'details' && (
                  <form onSubmit={handleDetailsSubmit} className="w-full space-y-4">
                    {/* Honeypot - hidden from real users */}
                    <div className="absolute opacity-0 -z-10 h-0 overflow-hidden" aria-hidden="true" tabIndex={-1}>
                      <input
                        type="text"
                        name="website"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>
                    {lead.intentType === 'job' ? (
                      <>
                        <div className="border-b border-gray-300/90 pb-2">
                          <input
                            ref={inputRef}
                            type="url"
                            value={resumeInput}
                            onChange={(e) => setResumeInput(e.target.value)}
                            placeholder="Link to your resume *"
                            className="w-full bg-transparent text-lg md:text-xl text-gray-900 focus:outline-none text-center placeholder:text-gray-300"
                            disabled={isStreaming}
                            aria-label="Resume link"
                          />
                        </div>
                        <div className="border-b border-gray-300/90 pb-2">
                          <textarea
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder="Any message you'd like to pass on? *"
                            rows={3}
                            className="w-full bg-transparent text-base md:text-lg text-gray-900 focus:outline-none text-center placeholder:text-gray-300 resize-none"
                            disabled={isStreaming}
                            aria-label="Message"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="border-b border-gray-300/90 pb-2">
                          <input
                            ref={inputRef}
                            type="text"
                            value={intentInput}
                            onChange={(e) => setIntentInput(e.target.value)}
                            placeholder="What are you hoping to build or explore?"
                            className="w-full bg-transparent text-lg md:text-xl text-gray-900 focus:outline-none text-center placeholder:text-gray-300"
                            disabled={isStreaming}
                            aria-label="Intent"
                          />
                        </div>
                        <div className="border-b border-gray-300/90 pb-2">
                          <textarea
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder="Any message you'd like to pass on? (optional)"
                            rows={3}
                            className="w-full bg-transparent text-base md:text-lg text-gray-900 focus:outline-none text-center placeholder:text-gray-300 resize-none"
                            disabled={isStreaming}
                            aria-label="Message"
                          />
                        </div>
                      </>
                    )}
                    <div className="flex items-center justify-center">
                      <Turnstile ref={turnstileRef} onVerify={onTurnstileVerify} />
                    </div>
                    {error ? <p className="text-xs text-red-600 text-center">{error}</p> : null}
                    <div className="flex items-center justify-center">
                      <button
                        type="submit"
                        className="rounded-full bg-cobalt-900 text-white px-5 py-2 text-sm font-semibold"
                        disabled={isStreaming || submitState === 'submitting'}
                      >
                        {submitState === 'submitting' ? 'Submitting...' : 'Submit'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
