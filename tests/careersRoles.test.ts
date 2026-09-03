import { describe, expect, it } from 'vitest'
import { availableRoleFilters, filterCareerRoles, rolesFromPositions } from '../lib/careers/roles'

const roles = rolesFromPositions([
  { title: 'Business Analyst - AI & Generative AI', level: 'Mid-Level', location: 'Pune', type: 'Full-time', jdContent: 'BA JD' },
  { title: 'Senior Software Engineer (Generative AI)', level: 'Senior', location: 'Remote', type: 'Full-time', jdContent: 'SSE JD' },
  { title: 'Growth Operations Specialist', level: 'Mid-Level', location: 'Pune', type: 'Contract', jdContent: 'GOS JD' },
  { title: 'No JD Role', level: 'Junior', location: 'Pune', type: 'Full-time' },
])

describe('careers role filtering (shared by page UI and WebMCP tools)', () => {
  it('drops positions without a job description', () => {
    expect(roles).toHaveLength(3)
    expect(roles.map((r) => r.title)).not.toContain('No JD Role')
  })

  it('matches free-text queries against title', () => {
    const matches = filterCareerRoles(roles, { query: 'business analyst' })
    expect(matches.map((r) => r.title)).toEqual(['Business Analyst - AI & Generative AI'])
  })

  it('filters by level, type, and location, treating "All" and empty as no filter', () => {
    expect(filterCareerRoles(roles, { level: 'Mid-Level' })).toHaveLength(2)
    expect(filterCareerRoles(roles, { type: 'Contract' })).toHaveLength(1)
    expect(filterCareerRoles(roles, { location: 'Remote' })).toHaveLength(1)
    expect(filterCareerRoles(roles, { level: 'All', type: '', location: undefined })).toHaveLength(3)
  })

  it('combines query and choice filters', () => {
    expect(filterCareerRoles(roles, { query: 'generative', location: 'Pune' }).map((r) => r.title)).toEqual([
      'Business Analyst - AI & Generative AI',
    ])
  })

  it('reports available filter values from the data', () => {
    const available = availableRoleFilters(roles)
    expect(available.levels).toEqual(['Mid-Level', 'Senior'])
    expect(available.types).toEqual(['Full-time', 'Contract'])
    expect(available.locations).toEqual(['Pune', 'Remote'])
  })
})
