import { describe, expect, it } from 'vitest'
import { DEFAULT_VISITOR_CONTEXT, normalizeVisitorContext } from '../lib/adaptiveSite'
import { applyPersonaAnswers, missingPersonaQuestions } from '../lib/persona/questions'

const ctx = (patch: Partial<typeof DEFAULT_VISITOR_CONTEXT> = {}) =>
  normalizeVisitorContext({ ...DEFAULT_VISITOR_CONTEXT, ...patch })

describe('persona question tracks', () => {
  it('asks the track-deciding intent question first when nothing is known', () => {
    const questions = missingPersonaQuestions(ctx(), {})
    expect(questions).toHaveLength(1)
    expect(questions[0].id).toBe('intent')
  })

  it('asks career questions for a careers visitor - never buying stage', () => {
    const ids = missingPersonaQuestions(ctx({ intent: 'careers' }), {}).map((q) => q.id)
    expect(ids).toEqual(['career_focus', 'career_level'])
    expect(ids).not.toContain('buying_stage')
  })

  it('asks services questions for a services visitor - never experience level', () => {
    const ids = missingPersonaQuestions(ctx({ intent: 'services' }), {}).map((q) => q.id)
    expect(ids).toContain('industry')
    expect(ids).toContain('buying_stage')
    expect(ids).not.toContain('career_level')
  })

  it('asks product questions for a products visitor', () => {
    const ids = missingPersonaQuestions(ctx({ intent: 'products' }), {}).map((q) => q.id)
    expect(ids).toEqual(['product_area', 'technical_depth', 'buying_stage'])
  })

  it('never repeats answered questions, from either recorded answers or context', () => {
    const answers = { buying_stage: 'evaluating' }
    const ids = missingPersonaQuestions(ctx({ intent: 'services', industry: 'retail', role: 'CIO' }), answers).map((q) => q.id)
    expect(ids).toEqual(['goal_area'])
  })
})

describe('applying persona answers', () => {
  it('a product-area answer patches the goal AND names the page to render', () => {
    const result = applyPersonaAnswers({ product_area: 'evals' })
    expect(result.patch.goal).toBe('Gaugetuple evaluation readiness')
    expect(result.pageViewSlug).toBe('gaugetuple')
  })

  it('an industry answer auto-renders that industry page - no extra ask needed', () => {
    expect(applyPersonaAnswers({ industry: 'healthcare' }).pageViewSlug).toBe('social-care-healthcare')
    expect(applyPersonaAnswers({ industry: 'retail' }).pageViewSlug).toBe('retail')
  })

  it('career answers become careers-page filters', () => {
    const result = applyPersonaAnswers({ career_focus: 'business analyst', career_level: 'Mid-Level' })
    expect(result.careersFilters).toEqual({ query: 'business analyst', level: 'Mid-Level' })
  })

  it('accepts option labels as well as values, and reports unknown answers', () => {
    const result = applyPersonaAnswers({ intent: 'A career opportunity', bogus: 'x' })
    expect(result.patch.intent).toBe('careers')
    expect(result.patch.role).toBe('Candidate')
    expect(result.invalid).toEqual(['bogus'])
  })
})
