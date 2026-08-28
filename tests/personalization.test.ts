import { describe, expect, it } from 'vitest'
import {
  buildExperienceManifest,
  getPersonalizationCapabilities,
  isExperienceManifest,
  parseBuyerContext,
} from '@/lib/personalization/engine'

describe('personalization engine', () => {
  it('builds a retail CIO experience with secure architecture and support demos', () => {
    const manifest = buildExperienceManifest({
      industry: 'retail',
      role: 'cio',
      goals: ['customer_support', 'workflow_automation'],
      stage: 'evaluation',
      priorities: ['security', 'integration'],
      companySize: 'enterprise',
      desiredAction: 'review_architecture',
    })

    expect(manifest.narrative.id).toBe('retail-enterprise-transformation')
    expect(manifest.audienceSummary).toBe('enterprise retail cio in the evaluation stage')
    expect(manifest.demoIds).toEqual(['dialogtuple', 'flowtuple'])
    expect(manifest.caseStudySlugs.slice(0, 2)).toEqual([
      'enterprise-saas-ai-agents',
      'property-maintenance-ai-platform',
    ])
    expect(manifest.architectureExamples.map(item => item.id)).toContain('retail-operations-automation')
    expect(manifest.cta.id).toBe('architecture-workshop')
    expect(manifest.sectionOrder[0]).toBe('hero')
    expect(manifest.sectionOrder.at(-1)).toBe('cta')
    expect(manifest.sectionOrder.indexOf('architecture')).toBeLessThan(manifest.sectionOrder.indexOf('case_studies'))
  })

  it('builds a financial product experience that starts with product evidence', () => {
    const manifest = buildExperienceManifest({
      industry: 'financial_services',
      role: 'product_leader',
      goals: ['document_processing', 'evaluation', 'application_development'],
      stage: 'pilot',
      priorities: ['accuracy', 'compliance', 'speed'],
      companySize: 'mid_market',
      desiredAction: 'view_demo',
    })

    expect(manifest.narrative.id).toBe('financial-product-velocity')
    expect(manifest.demoIds[0]).toBe('gaugetuple')
    expect(manifest.caseStudySlugs.slice(0, 2)).toEqual([
      'alternative-investments-document-classification',
      'anti-hallucination-platform',
    ])
    expect(manifest.architectureExamples.map(item => item.id)).toContain('financial-document-intelligence')
    expect(manifest.cta.id).toBe('product-proof-of-concept')
    expect(manifest.sectionOrder.indexOf('accelerators')).toBeLessThan(manifest.sectionOrder.indexOf('paths'))
  })

  it('creates the same manifest for the same buyer context', () => {
    const context = {
      industry: 'retail',
      role: 'cio',
      goals: ['ai_agents'],
      stage: 'scale',
      priorities: ['security'],
      desiredAction: 'contact_newtuple',
    }

    expect(buildExperienceManifest(context)).toEqual(buildExperienceManifest(context))
  })

  it('rejects unsupported values and empty goals', () => {
    expect(() => parseBuyerContext({
      industry: 'retail',
      role: 'chief_magic_officer',
      goals: [],
      stage: 'discovery',
      priorities: ['speed'],
      desiredAction: 'explore',
    })).toThrow('role is not supported')

    expect(() => parseBuyerContext({
      industry: 'retail',
      role: 'cio',
      goals: [],
      stage: 'discovery',
      priorities: ['speed'],
      desiredAction: 'explore',
    })).toThrow('goals must contain at least one value')
  })

  it('publishes all six WebMCP tools and validates stored manifests', () => {
    const capabilities = getPersonalizationCapabilities()
    expect(capabilities.tools).toHaveLength(6)

    const manifest = buildExperienceManifest({
      industry: 'general',
      role: 'ai_leader',
      goals: ['ai_agents'],
      stage: 'discovery',
      priorities: ['scale'],
      desiredAction: 'explore',
    })
    expect(isExperienceManifest(manifest)).toBe(true)
    expect(isExperienceManifest({ ...manifest, sectionOrder: ['cta', 'hero'] })).toBe(false)
  })
})
