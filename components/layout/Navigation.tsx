'use client'
/* eslint-disable @next/next/no-img-element */

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, Bot, RotateCcw } from 'lucide-react'
import { NAV_SERVICES, NAV_ACCELERATORS, NAV_INDUSTRIES, NAV_COMPANY } from '@/lib/constants'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import { useVisitorContext } from '@/components/webmcp/useVisitorContext'

interface DropdownItem {
  label: string
  href: string
  description?: string
  external?: boolean
}

const STRIP_ACCENTS: Record<string, { bar: string; text: string; reset: string; link: string; underline: string }> = {
  general: { bar: 'border-[var(--accent-100)] bg-[var(--accent-50)]', text: 'text-[var(--accent-900)]', reset: 'text-[var(--accent-700)] hover:text-[var(--accent-900)]', link: 'hover:text-[var(--accent-900)]', underline: 'bg-[var(--accent-900)]' },
  services: { bar: 'border-cyan-100 bg-cyan-50', text: 'text-cyan-900', reset: 'text-cyan-700 hover:text-cyan-900', link: 'hover:text-cyan-700', underline: 'bg-cyan-700' },
  products: { bar: 'border-amber-100 bg-amber-50', text: 'text-amber-900', reset: 'text-amber-700 hover:text-amber-900', link: 'hover:text-amber-700', underline: 'bg-amber-600' },
  careers: { bar: 'border-emerald-100 bg-emerald-50', text: 'text-emerald-900', reset: 'text-emerald-700 hover:text-emerald-900', link: 'hover:text-emerald-700', underline: 'bg-emerald-700' },
}

const BLOG_NAV_ITEM: DropdownItem =
  NAV_COMPANY.find((item) => item.label === 'Blog') ?? {
    label: 'Blog',
    href: 'https://www.newtuple.com/blog',
    external: true,
  }
const NAV_COMPANY_DROPDOWN = NAV_COMPANY.filter((item) => item.label !== 'Blog')

function NavDropdown({
  label,
  items,
}: {
  label: string
  items: DropdownItem[]
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const timeout = useRef<NodeJS.Timeout>()
  const hasDescriptions = items.some((item) => Boolean(item.description))

  const handleEnter = () => {
    clearTimeout(timeout.current)
    setOpen(true)
  }

  const handleLeave = () => {
    timeout.current = setTimeout(() => setOpen(false), 150)
  }

  useEffect(() => {
    return () => clearTimeout(timeout.current)
  }, [])

  return (
    <div ref={ref} className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button
        className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-[var(--accent-900)] transition-colors py-2"
        onClick={() => setOpen(!open)}
      >
        {label}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 ${
            hasDescriptions ? 'w-80' : 'w-56'
          }`}
        >
          <div className="rounded-xl bg-white shadow-premium-lg border border-gray-100 p-2 backdrop-blur-xl">
            {items.map((item) =>
              item.external ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block rounded-lg px-3 hover:bg-[var(--accent-50)] transition-colors ${
                    item.description ? 'py-2.5 min-h-[56px]' : 'py-2'
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <div className="text-sm font-medium text-gray-900">{item.label}</div>
                  {item.description && (
                    <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                  )}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-lg px-3 hover:bg-[var(--accent-50)] transition-colors ${
                    item.description ? 'py-2.5 min-h-[56px]' : 'py-2'
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <div className="text-sm font-medium text-gray-900">{item.label}</div>
                  {item.description && (
                    <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                  )}
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname()
  const initialPathname = useRef(pathname)

  useEffect(() => {
    // Only close on actual navigation, not on initial mount
    if (initialPathname.current !== pathname) {
      onClose()
    }
  }, [pathname, onClose])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  return (
    <div
      className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!isOpen}
    >
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="h-16 px-4 sm:px-6 border-b border-gray-100 bg-white/95 backdrop-blur-xl flex items-center justify-between">
          <Link href="/" onClick={onClose}>
            <img
              src="/images/brand/Logo-white.png"
              alt="Newtuple"
              className="h-14 w-auto object-contain"
            />
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">
          <nav className="space-y-3">
            <MobileSection title="Services" items={NAV_SERVICES} onClose={onClose} />
            <MobileSection title="Accelerators" items={NAV_ACCELERATORS} onClose={onClose} />
            <MobileSection title="Industries" items={NAV_INDUSTRIES} onClose={onClose} />
            <MobileSection title="Company" items={NAV_COMPANY_DROPDOWN} onClose={onClose} />
            <a
              href={BLOG_NAV_ITEM.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="block rounded-xl border border-gray-200 bg-gradient-to-b from-white to-gray-50/70 px-4 py-3 text-sm font-semibold text-gray-900 uppercase tracking-wider hover:text-[var(--accent-900)] hover:bg-white transition-colors"
            >
              {BLOG_NAV_ITEM.label}
            </a>
          </nav>
        </div>

        <div className="px-4 sm:px-6 py-4 border-t border-gray-100 bg-white">
          <Button href="/contactus" className="w-full" onClick={onClose}>
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  )
}

function MobileSection({
  title,
  items,
  onClose,
}: {
  title: string
  items: DropdownItem[]
  onClose: () => void
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-xl border border-gray-200 bg-gradient-to-b from-white to-gray-50/70 p-1">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider hover:bg-white/90 transition-colors"
        aria-expanded={expanded}
      >
        {title}
        <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="mt-1 px-2 pb-2 space-y-1">
            {items.map((item) =>
              item.external ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:text-[var(--accent-900)] hover:bg-white transition-colors"
                  onClick={onClose}
                >
                  <div className="font-medium">{item.label}</div>
                  {item.description && <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:text-[var(--accent-900)] hover:bg-white transition-colors"
                  onClick={onClose}
                >
                  <div className="font-medium">{item.label}</div>
                  {item.description && <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const closeMobile = useCallback(() => setMobileOpen(false), [])
  const { variant, resetContext } = useVisitorContext()
  const stripAccent = STRIP_ACCENTS[variant.intent] ?? STRIP_ACCENTS.general

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {variant.isPersonalized && (
        <div className={`fixed top-0 left-0 right-0 z-50 animate-fade-up border-b ${stripAccent.bar}`}>
          <Container>
            <div className={`flex flex-wrap items-center justify-center gap-2 py-1.5 text-center text-xs font-semibold sm:text-sm ${stripAccent.text}`}>
              <Bot className="h-3.5 w-3.5 shrink-0 animate-pulse-subtle" />
              <span>{variant.adaptationSummary}</span>
              <button
                type="button"
                onClick={resetContext}
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 transition-colors hover:bg-white ${stripAccent.reset}`}
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            </div>
          </Container>
        </div>
      )}

      <header
        className={`fixed left-0 right-0 z-40 transition-all duration-300 ${variant.isPersonalized ? 'top-8' : 'top-0'} ${
          scrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <Container>
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center">
              <img
                src="/images/brand/Logo-white.png"
                alt="Newtuple"
                className="h-14 sm:h-16 md:h-20 w-auto object-contain"
              />
            </Link>

            {variant.isPersonalized ? (
              <nav className="hidden lg:flex items-center gap-6">
                {variant.navigation.map((item, index) => (
                  <Link
                    key={`${item.label}-${index}`}
                    href={item.href}
                    className={`group relative text-sm font-medium text-gray-700 transition-colors py-2 ${stripAccent.link}`}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${stripAccent.underline}`}
                    />
                  </Link>
                ))}
              </nav>
            ) : (
              <nav className="hidden lg:flex items-center gap-8">
                <NavDropdown label="Services" items={NAV_SERVICES} />
                <NavDropdown label="Accelerators" items={NAV_ACCELERATORS} />
                <NavDropdown label="Industries" items={NAV_INDUSTRIES} />
                <NavDropdown label="Company" items={NAV_COMPANY_DROPDOWN} />
                <a
                  href={BLOG_NAV_ITEM.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-700 hover:text-[var(--accent-900)] transition-colors py-2"
                >
                  {BLOG_NAV_ITEM.label}
                </a>
              </nav>
            )}

            <div className="hidden lg:block">
              <Button href="/contactus" size="sm">
                Contact Us
              </Button>
            </div>

            <button
              className="lg:hidden p-2.5 rounded-lg hover:bg-gray-100 active:bg-gray-200"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-gray-900" />
            </button>
          </div>
        </Container>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={closeMobile} />
    </>
  )
}
