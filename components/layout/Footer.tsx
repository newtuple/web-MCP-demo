'use client'
/* eslint-disable @next/next/no-img-element */

import Link from 'next/link'
import { Linkedin, Twitter, Github } from 'lucide-react'
import Container from '@/components/ui/Container'
import { COMPANY, NAV_SERVICES, NAV_ACCELERATORS, NAV_COMPANY } from '@/lib/constants'

export default function Footer() {
  const headingClass = 'text-xs font-semibold uppercase tracking-[0.12em] text-gray-400 mb-3'
  const linkClass =
    "group/link relative inline-flex text-sm text-gray-300 transition-colors duration-200 hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-500)]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded-sm after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[var(--accent-400)] after:transition-transform after:duration-200 hover:after:scale-x-100 focus-visible:after:scale-x-100"
  const socialClass =
    'inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-300 transition-colors duration-200 hover:text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-500)]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950'

  return (
    <footer className="bg-gray-950 text-white">
      <Container className="py-12 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          <div className="col-span-2 md:col-span-4 xl:col-span-1">
            <Link href="/">
              <span className="inline-flex items-center justify-center w-full max-w-[220px] md:max-w-[250px] h-[62px] md:h-[70px] rounded-lg bg-white overflow-hidden shadow-sm">
                <img
                  src="/images/brand/Logo-white.png"
                  alt="Newtuple"
                  className="w-full h-full object-contain scale-[1.26]"
                />
              </span>
            </Link>
            <p className="mt-3 text-gray-300 font-light text-sm leading-relaxed max-w-sm">
              A modern, AI-first consulting company. Bringing the power of AI + Data to your organization.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href={COMPANY.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={socialClass}
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={COMPANY.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className={socialClass}
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={COMPANY.github}
                target="_blank"
                rel="noopener noreferrer"
                className={socialClass}
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className={headingClass}>
              Services
            </h3>
            <ul className="space-y-2.5">
              {NAV_SERVICES.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={linkClass}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={headingClass}>
              Accelerators
            </h3>
            <ul className="space-y-2.5">
              {NAV_ACCELERATORS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={linkClass}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={headingClass}>
              Company
            </h3>
            <ul className="space-y-2.5">
              {NAV_COMPANY.map((item) =>
                item.external ? (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    >
                      {item.label}
                    </a>
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={linkClass}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              )}
              <li>
                <Link
                  href="/contactus"
                  className={linkClass}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400 text-center md:text-left">
              &copy; {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
            </p>
            <div className="flex gap-5">
              <Link href="/privacy-policy" className={linkClass}>
                Privacy Policy
              </Link>
              <Link href="/service-agreement" className={linkClass}>
                Service Agreement
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
