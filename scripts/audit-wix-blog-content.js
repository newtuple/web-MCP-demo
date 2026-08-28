const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const root = process.cwd()
const wixRawDir = path.join(root, 'reference', 'wix-raw')
const blogDir = path.join(root, 'content', 'blog')
const reportPath = path.join(root, 'reference', 'wix-export-report.json')
const outputJson = path.join(root, 'reference', 'wix-content-audit.json')
const outputMarkdown = path.join(root, 'reference', 'wix-content-audit.md')
const intentionallyUpdatedSlugs = new Set([
  'the-ultimate-pricing-cheat-sheet-for-large-language-models',
])

function normalizeText(value) {
  return String(value || '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    // Match HTML tags only. A broad angle-bracket match can delete article
    // text such as a score written as "<60%" through the next ">".
    .replace(/<\/?[A-Za-z][^>]*>/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

function sourceLines(text) {
  return String(text || '')
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => normalizeText(line).length >= 30)
}

function readSourcesInOrder() {
  const exportReport = JSON.parse(fs.readFileSync(reportPath, 'utf8'))
  return Object.keys(exportReport.sources)
}

function readCaptureFiles() {
  return fs.readdirSync(wixRawDir)
    .filter((file) => /^\d{2}-.*\.json$/.test(file))
    .sort()
    .map((file) => ({
      file,
      data: JSON.parse(fs.readFileSync(path.join(wixRawDir, file), 'utf8')),
    }))
}

function main() {
  const sourceSlugs = readSourcesInOrder()
  const captures = readCaptureFiles()
  const results = captures.map(({ file, data }) => {
    const slug = data.index <= sourceSlugs.length
      ? sourceSlugs[data.index - 1]
      : 'google-analytics-ua-vs-ga4-data-model-changes'
    const markdownPath = path.join(blogDir, `${slug}.md`)
    const exists = fs.existsSync(markdownPath)
    const body = exists ? matter(fs.readFileSync(markdownPath, 'utf8')).content : ''
    const localText = normalizeText(body)
    const missingLines = sourceLines(data.richText)
      .filter((line) => !localText.includes(normalizeText(line)))

    const embeds = (data.embeds || []).map((embed) => ({
      src: embed.src,
      htmlLength: (embed.bodyHtml || '').length,
      tables: (embed.tables || []).map((table) => ({
        rows: table.length,
        columns: Math.max(0, ...table.map((row) => row.length)),
      })),
    }))
    const intentionallyUpdated = intentionallyUpdatedSlugs.has(slug)

    return {
      index: data.index,
      slug,
      title: data.title,
      capture: file,
      markdown: exists ? path.relative(root, markdownPath) : null,
      sourceTextLength: data.richText.length,
      localBodyLength: body.length,
      missingLineCount: missingLines.length,
      missingLines,
      embedCount: embeds.length,
      embeds,
      intentionallyUpdated,
      status: !exists
        ? 'missing-post'
        : intentionallyUpdated
          ? 'updated-after-migration'
          : missingLines.length
            ? 'text-diff'
            : embeds.length
              ? 'embedded-content'
              : 'text-match',
    }
  })

  const summary = {
    captures: results.length,
    missingPosts: results.filter((item) => item.status === 'missing-post').length,
    textDiffs: results.filter((item) => item.status === 'text-diff').length,
    intentionalUpdates: results.filter((item) => item.status === 'updated-after-migration').length,
    postsWithEmbeds: results.filter((item) => item.embedCount > 0).length,
    textMatches: results.filter((item) => item.status === 'text-match').length,
  }

  fs.writeFileSync(outputJson, `${JSON.stringify({ summary, results }, null, 2)}\n`)

  const lines = [
    '# Wix blog content audit',
    '',
    `- Captured posts: ${summary.captures}`,
    `- Missing posts: ${summary.missingPosts}`,
    `- Posts with text differences: ${summary.textDiffs}`,
    `- Posts intentionally updated after migration: ${summary.intentionalUpdates}`,
    `- Posts with embedded content: ${summary.postsWithEmbeds}`,
    `- Exact text matches without embeds: ${summary.textMatches}`,
    '',
    '## Results',
    '',
    '| # | Post | Status | Missing lines | Embeds |',
    '|---:|---|---|---:|---:|',
    ...results.map((item) => `| ${item.index} | ${item.title.replace(/\|/g, '\\|')} | ${item.status} | ${item.missingLineCount} | ${item.embedCount} |`),
    '',
  ]
  fs.writeFileSync(outputMarkdown, `${lines.join('\n')}\n`)
  console.log(JSON.stringify(summary, null, 2))
}

main()
