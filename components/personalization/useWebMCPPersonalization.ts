'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  buildExperienceManifest,
  getPersonalizationCapabilities,
  isExperienceManifest,
} from '@/lib/personalization/engine'
import {
  BUYER_ROLES,
  BUYER_STAGES,
  COMPANY_SIZES,
  DESIRED_ACTIONS,
  GOALS,
  INDUSTRIES,
  PRIORITIES,
  type ExperienceManifest,
} from '@/lib/personalization/types'

const ACTIVE_EXPERIENCE_KEY = 'newtuple:webmcp:active-experience'
const PREVIEW_PREFIX = 'newtuple:webmcp:preview:'

const buyerContextSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['industry', 'role', 'goals', 'stage', 'priorities', 'desiredAction'],
  properties: {
    industry: { type: 'string', enum: INDUSTRIES },
    role: { type: 'string', enum: BUYER_ROLES },
    goals: { type: 'array', minItems: 1, uniqueItems: true, items: { type: 'string', enum: GOALS } },
    stage: { type: 'string', enum: BUYER_STAGES },
    priorities: { type: 'array', minItems: 1, uniqueItems: true, items: { type: 'string', enum: PRIORITIES } },
    companySize: { type: 'string', enum: COMPANY_SIZES },
    desiredAction: { type: 'string', enum: DESIRED_ACTIONS },
  },
}

function readStoredManifest(key: string): ExperienceManifest | null {
  try {
    const stored = window.sessionStorage.getItem(key)
    if (!stored) return null
    const value: unknown = JSON.parse(stored)
    return isExperienceManifest(value) ? value : null
  } catch {
    return null
  }
}

function announceExperience(name: string, detail: unknown) {
  window.dispatchEvent(new CustomEvent(name, { detail }))
}

export function useWebMCPPersonalization() {
  const [manifest, setManifest] = useState<ExperienceManifest | null>(null)
  const [webMcpAvailable, setWebMcpAvailable] = useState(false)
  const activeManifestRef = useRef<ExperienceManifest | null>(null)
  const previewsRef = useRef(new Map<string, ExperienceManifest>())

  const applyManifest = useCallback((nextManifest: ExperienceManifest) => {
    activeManifestRef.current = nextManifest
    setManifest(nextManifest)
    window.sessionStorage.setItem(ACTIVE_EXPERIENCE_KEY, JSON.stringify(nextManifest))
    announceExperience('newtuple:experience-applied', nextManifest)
  }, [])

  const resetManifest = useCallback(() => {
    activeManifestRef.current = null
    setManifest(null)
    window.sessionStorage.removeItem(ACTIVE_EXPERIENCE_KEY)
    announceExperience('newtuple:experience-reset', {})
  }, [])

  useEffect(() => {
    const stored = readStoredManifest(ACTIVE_EXPERIENCE_KEY)
    if (stored) {
      activeManifestRef.current = stored
      setManifest(stored)
    }
  }, [])

  useEffect(() => {
    const modelContext = document.modelContext
    setWebMcpAvailable(Boolean(modelContext))
    if (!modelContext) return

    const controller = new AbortController()
    const toolOptions = { signal: controller.signal }

    const tools: WebMCPToolDefinition[] = [
      {
        name: 'get_personalization_capabilities',
        description: 'List the buyer context values and personalization actions that Newtuple.com supports. This tool does not change the website.',
        inputSchema: { type: 'object', additionalProperties: false, properties: {} },
        execute: async () => ({ ok: true, capabilities: getPersonalizationCapabilities() }),
      },
      {
        name: 'preview_personalized_experience',
        description: 'Create a controlled Newtuple.com experience plan for a buyer. This tool does not change the website. Review the plan before you apply it.',
        inputSchema: buyerContextSchema,
        execute: async input => {
          try {
            const preview = buildExperienceManifest(input)
            previewsRef.current.set(preview.experienceId, preview)
            window.sessionStorage.setItem(`${PREVIEW_PREFIX}${preview.experienceId}`, JSON.stringify(preview))
            return { ok: true, experience: preview }
          } catch (error) {
            return { ok: false, error: error instanceof Error ? error.message : 'The buyer context is invalid.' }
          }
        },
      },
      {
        name: 'apply_personalized_experience',
        description: 'Apply a previously previewed Newtuple.com experience. This changes the current homepage narrative, examples, demos, call to action, and section order for this browser session.',
        inputSchema: {
          type: 'object',
          additionalProperties: false,
          required: ['experienceId'],
          properties: { experienceId: { type: 'string', minLength: 1, maxLength: 160 } },
        },
        execute: async input => {
          const experienceId = input.experienceId
          if (typeof experienceId !== 'string') return { ok: false, error: 'experienceId must be a string.' }
          const preview = previewsRef.current.get(experienceId) ?? readStoredManifest(`${PREVIEW_PREFIX}${experienceId}`)
          if (!preview) return { ok: false, error: 'Preview this experience before you apply it.' }
          applyManifest(preview)
          return { ok: true, experience: preview }
        },
      },
      {
        name: 'get_current_experience',
        description: 'Return the buyer context and content selections for the active Newtuple.com experience. This tool does not change the website.',
        inputSchema: { type: 'object', additionalProperties: false, properties: {} },
        execute: async () => ({ ok: true, experience: activeManifestRef.current, isPersonalized: Boolean(activeManifestRef.current) }),
      },
      {
        name: 'reset_personalized_experience',
        description: 'Restore the standard Newtuple.com experience for this browser session.',
        inputSchema: { type: 'object', additionalProperties: false, properties: {} },
        execute: async () => {
          resetManifest()
          return { ok: true, message: 'The standard Newtuple.com experience is active.' }
        },
      },
      {
        name: 'submit_experience_feedback',
        description: 'Record whether the active personalized Newtuple.com experience was useful. This does not submit a sales request or personal information.',
        inputSchema: {
          type: 'object',
          additionalProperties: false,
          required: ['rating'],
          properties: {
            rating: { type: 'string', enum: ['helpful', 'not_helpful'] },
            reason: { type: 'string', maxLength: 500 },
          },
        },
        execute: async input => {
          if (input.rating !== 'helpful' && input.rating !== 'not_helpful') {
            return { ok: false, error: 'rating must be helpful or not_helpful.' }
          }
          const feedback = {
            experienceId: activeManifestRef.current?.experienceId ?? null,
            rating: input.rating,
            reason: typeof input.reason === 'string' ? input.reason : undefined,
          }
          announceExperience('newtuple:experience-feedback', feedback)
          return { ok: true, message: 'The experience feedback was recorded for this session.' }
        },
      },
    ]

    Promise.allSettled(tools.map(tool => modelContext.registerTool(tool, toolOptions)))

    return () => controller.abort()
  }, [applyManifest, resetManifest])

  return { manifest, webMcpAvailable, resetManifest }
}

