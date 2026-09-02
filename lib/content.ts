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
