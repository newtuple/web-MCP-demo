// WebMCP surface for careers. An agent acting for a candidate can list open
// roles, read a full job description, and - the human-parity move - apply the
// same filters the on-page controls apply, so the visitor sees exactly the
// filtered job list a human filtering by hand would see. Role data is loaded
// server-side from content/careers.md and passed down through
// WebMCPProvider, so these tools work from ANY page, not only /careers.

import {
  availableRoleFilters,
  filterCareerRoles,
  normalizeRoleValue,
  type CareerRole,
  type CareersFilters,
} from '@/lib/careers/roles'
import { applyCareersFilters } from '@/lib/careers/store'
import { goToSitePage } from '@/lib/navigate/router'
import { reply } from '@/lib/webmcpReply'

const roleSummary = (role: CareerRole) => ({
  title: role.title,
  level: role.level,
  location: role.location,
  type: role.type,
})

const filtersFromInput = (input: Record<string, unknown>): CareersFilters => ({
  query: String(input.query ?? '').trim() || undefined,
  level: String(input.level ?? '').trim() || undefined,
  type: String(input.type ?? '').trim() || undefined,
  location: String(input.location ?? '').trim() || undefined,
})

const filterInputSchema = (roles: CareerRole[]) => {
  const available = availableRoleFilters(roles)
  return {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Free-text match against title, level, location, and employment type - e.g. "business analyst" or "engineer".' },
      level: { type: 'string', enum: ['All', ...available.levels], description: 'Seniority level filter.' },
      type: { type: 'string', enum: ['All', ...available.types], description: 'Employment type filter.' },
      location: { type: 'string', enum: ['All', ...available.locations], description: 'Location filter.' },
    },
  }
}

export function createCareersTools(roles: CareerRole[]): WebMCPToolDefinition[] {
  if (roles.length === 0) return []

  return [
    {
      name: 'list_open_roles',
      title: 'List open roles at Newtuple',
      description:
        'List the open positions at Newtuple, optionally filtered by free-text query, level, employment type, or location - the exact same matching the careers page filters use. Changes nothing on screen.',
      inputSchema: filterInputSchema(roles),
      annotations: { readOnlyHint: true },
      execute: (input = {}) => {
        const filters = filtersFromInput(input)
        const matches = filterCareerRoles(roles, filters)
        return reply(`${matches.length} of ${roles.length} open roles match.`, {
          matches: matches.map(roleSummary),
          availableFilters: availableRoleFilters(roles),
        })
      },
    },
    {
      name: 'get_role_details',
      title: 'Read a Newtuple job description',
      description:
        'Read the full job description for one open role at Newtuple, by role title (fuzzy match is fine, e.g. "business analyst"). Changes nothing on screen.',
      inputSchema: {
        type: 'object',
        properties: {
          role_title: { type: 'string', description: 'The role title, or enough of it to identify one role.' },
        },
        required: ['role_title'],
      },
      annotations: { readOnlyHint: true },
      execute: (input = {}) => {
        const wanted = normalizeRoleValue(String(input.role_title ?? ''))
        if (!wanted) return reply('Say which role you want, e.g. "business analyst".')
        const matches = roles.filter((role) => normalizeRoleValue(role.title).includes(wanted))
        if (matches.length === 0) {
          return reply(`No open role matches "${String(input.role_title)}".`, { openRoles: roles.map((r) => r.title) })
        }
        if (matches.length > 1) {
          return reply('More than one role matches - be more specific.', { matches: matches.map((r) => r.title) })
        }
        const role = matches[0]
        return reply(`${role.title} (${role.level}, ${role.location}, ${role.type})`, {
          ...roleSummary(role),
          jobDescription: role.jd ?? 'No job description on file.',
        })
      },
    },
    {
      name: 'filter_careers_page',
      title: 'Filter the careers page on screen',
      description:
        'Apply filters to the careers page UI exactly as a human using the on-page controls would: the visible job list narrows to the matching roles. Navigates to the careers page first when the visitor is elsewhere, then applies the filters and scrolls the open-roles section into view. Returns the same matching roles the visitor now sees. If nothing matches, the page is left unchanged and the result carries needsClarification: true plus nearbyOptions - ask the visitor which of those they want, then call this again.',
      inputSchema: filterInputSchema(roles),
      annotations: { readOnlyHint: false },
      execute: (input = {}) => {
        const filters = filtersFromInput(input)
        const matches = filterCareerRoles(roles, filters)

        // Bidirectional: a zero-match filter doesn't fail silently or blank
        // the page. It leaves the visible list alone and hands the agent a
        // real question to relay back verbatim, with the actual open roles
        // spelled out right in the summary line - not just in the JSON below,
        // where a summarizing agent might never look - so there is no way to
        // collapse this into "0 results found" without also seeing the ask.
        if (matches.length === 0) {
          const available = availableRoleFilters(roles)
          const openTitles = roles.map((r) => r.title).join(', ')
          return reply(
            `Nothing matches that filter. Careers page left unchanged - do NOT report zero results to the visitor, ask them this instead: "We don't have that exact role open right now, but we do have: ${openTitles}. Want me to show you any of these?" Then call filter_careers_page again with whichever they pick.`,
            {
              needsClarification: true,
              applied: filters,
              nearbyOptions: available,
              allOpenRoles: roles.map(roleSummary),
            },
          )
        }

        applyCareersFilters(filters)
        if (window.location.pathname !== '/careers') goToSitePage('/careers')
        return reply(
          `Careers page filtered - the visitor now sees ${matches.length} of ${roles.length} roles.`,
          { applied: filters, matches: matches.map(roleSummary) },
        )
      },
    },
  ]
}
