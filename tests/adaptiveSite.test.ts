import { describe, expect, it } from 'vitest'
import { inferVisitorContext, productSlugForGoal } from '../lib/adaptiveSite'

const goalFor = (statement: string) => inferVisitorContext(statement).goal
const productFor = (statement: string) => productSlugForGoal(goalFor(statement))

describe('keyword-to-product mapping', () => {
  it('maps eval language to Gaugetuple', () => {
    expect(productFor('we need evals for our LLM outputs')).toBe('gaugetuple')
    expect(productFor('how do you handle LLM evaluation?')).toBe('gaugetuple')
  })

  it('maps the retail CIO vendor-evaluation statement to Gaugetuple', () => {
    expect(productFor("I'm the CIO of a large retail company, we run SAP, and I'm evaluating vendors for product-data automation.")).toBe('gaugetuple')
  })

  it('maps workflow and generic automation language to Flowtuple', () => {
    expect(productFor('we want to automate our approval workflow')).toBe('flowtuple')
    expect(productFor('looking for invoice automation')).toBe('flowtuple')
    expect(productFor('humans and agents with a state machine')).toBe('flowtuple')
  })

  it('maps multi-agent and conversation language to Dialogtuple', () => {
    expect(productFor('we are designing a multi agent architecture')).toBe('dialogtuple')
    expect(productFor('need a customer support agent chatbot')).toBe('dialogtuple')
  })

  it('maps voice language to Uttertuple', () => {
    expect(productFor('we want a voice bot for our call center')).toBe('uttertuple')
    expect(productFor('speech to text for field workers')).toBe('uttertuple')
  })

  it('keeps product-data phrasing (without eval words) a retail-services goal, not a product', () => {
    expect(goalFor('we struggle with product-data operations in our PIM')).toBe('product-data automation')
    expect(productFor('we struggle with product-data operations in our PIM')).toBeNull()
  })

  it('returns null for non-product goals', () => {
    expect(productFor('I want a job at Newtuple')).toBeNull()
    expect(productFor('we need production AI security and observability')).toBeNull()
  })
})
