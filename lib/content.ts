import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDir = path.join(process.cwd(), 'content')

export function getPageContent<T = Record<string, unknown>>(slug: string): {
  data: T
  body: string
} {
  const filePath = path.join(contentDir, `${slug}.md`)
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  // Enrich careers positions with JD file content
  if (slug === 'careers') {
    const d = data as Record<string, unknown>
    const positions = d.positions as { items?: { jdFile?: string; jdContent?: string }[] } | undefined
    if (positions?.items) {
      for (const item of positions.items) {
        if (item.jdFile) {
          const jdPath = path.join(contentDir, 'JDs', item.jdFile)
          if (fs.existsSync(jdPath)) {
            item.jdContent = fs.readFileSync(jdPath, 'utf-8')
          }
        }
      }
    }
  }

  return { data: data as T, body: content }
}

export interface CaseStudySummary {
  slug: string
  title: string
  competency: string
  cardSummary: string
}

export interface AuthorDetails {
  name: string
  linkedin?: string
  avatar?: string
}

const blogAuthorProfiles: Record<string, AuthorDetails> = {
  'Dhiraj Nambiar': {
    name: 'Dhiraj Nambiar',
    linkedin: 'https://www.linkedin.com/in/dhirajnambiar/',
    avatar: '/images/leadership/dhiraj-nambiar.webp',
  },
}

export interface BlogFrontmatter {
  title: string
  description: string
  date: string
  updated?: string
  author?: string
  authors?: AuthorDetails[]
  slug: string
  tags?: string[]
  heroImage?: string
  socialImage?: string
  coverImage?: string
  canonical?: string
  comments?: boolean
}

export interface BlogPostSummary {
  slug: string
  title: string
  description: string
  date: string
  updated?: string
  author?: string
  authors?: AuthorDetails[]
  tags?: string[]
  heroImage?: string
  socialImage?: string
  coverImage?: string
  readingTime: number
}

export interface BlogPost {
  slug: string
  frontmatter: BlogFrontmatter
  body: string
  readingTime: number
}

export function getAllCaseStudies(): CaseStudySummary[] {
  const caseStudiesDir = path.join(contentDir, 'case_studies')
  const files = fs.readdirSync(caseStudiesDir).filter(f => f.endsWith('.md'))

  return files.map(file => {
    const slug = file.replace('.md', '')
    const raw = fs.readFileSync(path.join(caseStudiesDir, file), 'utf-8')
    const lines = raw.split('\n')

    const title = (lines[0] || '').replace(/^#\s+/, '').trim()
    const competency = (lines[2] || '').replace(/\*\*/g, '').trim()

    let cardSummary = ''
    const summaryIdx = lines.findIndex(l => l.startsWith('## Card Summary'))
    if (summaryIdx !== -1) {
      cardSummary = (lines[summaryIdx + 1] || '').trim()
    }

    return { slug, title, competency, cardSummary }
  })
}

const blogDir = path.join(contentDir, 'blog')

/**
 * Strip from the start of markdown body: duplicate H1 title and inline metadata block
 * (author/date/read time/updated) so the post page hero is the single source of truth.
 */
function stripLeadingRedundantContent(body: string): string {
  const lines = body.split('\n')
  let i = 0

  // Skip optional first # heading and following blank lines
  if (/^#\s+.+/.test(lines[i]?.trim() ?? '')) {
    i++
    while (i < lines.length && lines[i]?.trim() === '') i++
  }

  // Skip metadata block: list items (* ...), "Updated: ...", optional "Authors:" line,
  // blank lines, and a single leading image block (typically the hero image).
  while (i < lines.length) {
    const line = lines[i] ?? ''
    const trimmed = line.trim()
    if (trimmed === '') {
      i++
      continue
    }
    // List item (bullet with optional writer image / date / "min read")
    if (/^\*\s+/.test(line) || /^\*\s+$/.test(line)) {
      i++
      continue
    }
    // Continuation of list item (indented)
    if (line.startsWith('    ') && i > 0) {
      i++
      continue
    }
    // Optional authors line (e.g. "Authors: Name and Name") that sometimes appears
    // in migrated content before a duplicated hero image.
    if (/^Authors?:\s+/i.test(trimmed)) {
      i++
      continue
    }
    if (/^Updated:?\s+/i.test(trimmed)) {
      i++
      continue
    }
    // Single leading image block (duplicate hero image) — image is one line ![...](url)
    if (trimmed.startsWith('![')) {
      i++
      while (i < lines.length && lines[i]?.trim() === '') i++
      // Optional caption line after image (e.g. "Dagster Logo")
      const next = lines[i]?.trim() ?? ''
      if (next && !next.startsWith('#') && !next.startsWith('*') && !next.startsWith('[') && !next.startsWith('```')) {
        i++
      }
      continue
    }
    // Stop at first real content (heading, bold, code block, or paragraph)
    break
  }

  return lines.slice(i).join('\n').trimStart()
}

/**
 * Strip trailing metadata/footer blocks that come from the legacy blog platform:
 * category links, view/like/comment counters, etc.
 */
function stripTrailingRedundantContent(body: string): string {
  const lines = body.split('\n')
  let j = lines.length - 1

  while (j >= 0) {
    const line = lines[j] ?? ''
    const trimmed = line.trim()

    if (trimmed === '') {
      j--
      continue
    }

    // Pure numeric counters like "1885" or "1,885"
    if (/^\d[\d,]*$/.test(trimmed)) {
      j--
      continue
    }

    // Lines mentioning views / comments / likes
    if (/\b(views?|comments?|likes?)\b/i.test(trimmed)) {
      j--
      continue
    }

    // Category bullets from migrated content (e.g. "*   [AI + Data](.../blog/categories/ai-data)")
    if (/^\*\s+/.test(trimmed) && /blog\/categories\//.test(trimmed)) {
      j--
      continue
    }

    break
  }

  return lines.slice(0, j + 1).join('\n').trimEnd()
}

/**
 * Normalize legacy blog content into nicer markdown structures (e.g. convert
 * vertical scorecard lists into proper tables) without having to hand-edit
 * every article.
 */
function normalizeLegacyBlogContent(body: string): string {
  // Currently a no-op normalizer. Leading/trailing legacy chrome is already
  // handled by the dedicated stripping helpers above, and any structural
  // fixes (like tables) are encoded directly in markdown so we avoid
  // overfitting string transforms across all articles.
  return body
}

function resolveBlogAuthor(frontmatter: BlogFrontmatter): BlogFrontmatter {
  if (frontmatter.authors?.length || !frontmatter.author) {
    return frontmatter
  }

  const profile = blogAuthorProfiles[frontmatter.author]
  return profile
    ? { ...frontmatter, authors: [{ ...profile }] }
    : frontmatter
}

function readBlogFile(filePath: string): BlogPost {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const frontmatter = resolveBlogAuthor(data as BlogFrontmatter)
  const body = normalizeLegacyBlogContent(
    stripTrailingRedundantContent(stripLeadingRedundantContent(content)),
  )
  const wordCount = body.split(/\s+/).filter(Boolean).length
  const readingTime = Math.max(1, Math.ceil(wordCount / 238))

  return {
    slug: frontmatter.slug,
    frontmatter,
    body,
    readingTime,
  }
}

export function getAllBlogPosts(): BlogPostSummary[] {
  if (!fs.existsSync(blogDir)) {
    return []
  }

  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'))
  const posts = files.map(file => {
    const post = readBlogFile(path.join(blogDir, file))
    const { frontmatter } = post
    return {
      slug: frontmatter.slug,
      title: frontmatter.title,
      description: frontmatter.description,
      date: frontmatter.date,
      updated: frontmatter.updated,
      author: frontmatter.author,
      authors: frontmatter.authors,
      tags: frontmatter.tags,
      heroImage: frontmatter.heroImage,
      coverImage: frontmatter.coverImage,
      readingTime: post.readingTime,
    }
  }).filter((post) => Boolean(post.slug && post.title && post.description && post.date))

  return posts.sort((a, b) => {
    const aDate = new Date(a.date).getTime()
    const bDate = new Date(b.date).getTime()
    return bDate - aDate
  })
}

export function getBlogPost(slug: string): BlogPost | null {
  if (!fs.existsSync(blogDir)) {
    return null
  }

  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'))
  for (const file of files) {
    const post = readBlogFile(path.join(blogDir, file))
    if (post.slug === slug) {
      return post
    }
  }

  return null
}

export function getRelatedPosts(currentSlug: string, tags: string[], limit = 3): BlogPostSummary[] {
  const allPosts = getAllBlogPosts()
  return allPosts
    .filter(p => p.slug !== currentSlug)
    .map(p => ({
      ...p,
      score: (p.tags ?? []).filter(t => tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score || new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
    .map(({ score, ...post }) => post)
}
