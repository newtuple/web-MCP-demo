// Career roles as one shared model: the careers page UI, the WebMCP careers
// tools, and the layout-level data plumbing all use these types and this
// matcher, so what an agent is told always equals what a human sees rendered.
// Client-safe: no fs - the raw data comes from content/careers.md via
// lib/content.ts on the server and is passed down.

export interface CareerRole {
  id: string
  title: string
  level: string
  location: string
  type: string
  /** Full job description markdown. */
  jd?: string
}

export interface CareersFilters {
  query?: string
  level?: string
  type?: string
  location?: string
}

export function normalizeRoleValue(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

export interface CareersPositionItem {
  title: string
  level: string
  location: string
  type: string
  jdContent?: string
}

/** Same construction the careers page uses: only roles with a real JD count. */
export function rolesFromPositions(items: CareersPositionItem[]): CareerRole[] {
  return items
    .filter((item) => Boolean(item.jdContent))
    .map((item, index) => ({
      id: `${normalizeRoleValue(item.title)}-${normalizeRoleValue(item.level)}-${normalizeRoleValue(item.location)}-${normalizeRoleValue(item.type)}-${index}`,
      title: item.title.trim(),
      level: item.level.trim(),
      location: item.location.trim(),
      type: item.type.trim(),
      jd: item.jdContent,
    }))
}

const matchesChoice = (filter: string | undefined, value: string) =>
  !filter || filter === 'All' || normalizeRoleValue(filter) === normalizeRoleValue(value)

/** The one matcher. The page's visible list and every tool result go through it.
 * Generic so the page can pass its own richer role items straight through. */
export function filterCareerRoles<T extends Pick<CareerRole, 'title' | 'level' | 'location' | 'type'>>(
  roles: T[],
  filters: CareersFilters,
): T[] {
  const q = normalizeRoleValue(filters.query ?? '')
  return roles.filter((role) => {
    const matchesQuery =
      q.length === 0 ||
      normalizeRoleValue(role.title).includes(q) ||
      normalizeRoleValue(role.level).includes(q) ||
      normalizeRoleValue(role.location).includes(q) ||
      normalizeRoleValue(role.type).includes(q)

    return (
      matchesQuery &&
      matchesChoice(filters.level, role.level) &&
      matchesChoice(filters.type, role.type) &&
      matchesChoice(filters.location, role.location)
    )
  })
}

export function availableRoleFilters(roles: CareerRole[]) {
  const unique = (values: string[]) => Array.from(new Set(values))
  return {
    levels: unique(roles.map((role) => role.level)),
    types: unique(roles.map((role) => role.type)),
    locations: unique(roles.map((role) => role.location)),
  }
}
