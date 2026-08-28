const fs = require('fs')
const path = require('path')
const { load } = require('cheerio')
const { htmlToMarkdown } = require('./lib/html-to-md')

const root = process.cwd()
const wixRawDir = path.join(root, 'reference', 'wix-raw')
const blogDir = path.join(root, 'content', 'blog')
const publicBlogDir = path.join(root, 'public', 'blog')
const exportReport = JSON.parse(
  fs.readFileSync(path.join(root, 'reference', 'wix-export-report.json'), 'utf8'),
)
const sourceSlugs = Object.keys(exportReport.sources)

function escapeYaml(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

function markdownTable(rows) {
  if (!rows.length) return ''
  const width = Math.max(...rows.map((row) => row.length))
  const normalized = rows.map((row) => Array.from({ length: width }, (_, index) => {
    const text = row[index]?.text || ''
    return text.replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>')
  }))
  const header = normalized[0]
  const body = normalized.slice(1)
  return [
    `| ${header.join(' | ')} |`,
    `| ${header.map(() => '---').join(' | ')} |`,
    ...body.map((row) => `| ${row.join(' | ')} |`),
  ].join('\n')
}

function inferCodeLanguage(code, fileName) {
  const name = String(fileName || '').toLowerCase()
  if (name.endsWith('.py') || /(^|\n)\s*(from\s+\S+\s+import|import\s+\S+|def\s+\w+\s*\()/m.test(code)) return 'python'
  if (name.endsWith('.sql') || /\b(select|insert|update|create table|with)\b/i.test(code)) return 'sql'
  if (name.endsWith('.js') || name.endsWith('.ts')) return name.endsWith('.ts') ? 'typescript' : 'javascript'
  return ''
}

function gistEmbedMarkdown(embed) {
  const $ = load(embed.bodyHtml || '', null, false)
  let codeLines = $('td.blob-code').toArray().map((cell) => $(cell).text().replace(/\u00a0/g, ' ').replace(/\s+$/g, ''))
  if (!codeLines.length && embed.tables?.[0]) {
    codeLines = embed.tables[0].map((row) => row[1]?.text || '')
  }
  const fileName = $('.gist-meta a').filter((_, link) => !/view raw/i.test($(link).text())).first().text().trim()
  const source = $('script[src*="gist.github.com"]').attr('src')?.replace(/\.js(?:\?.*)?$/, '')
    || $('.gist-meta a[href*="gist.github.com"]').first().attr('href')
  const code = codeLines.join('\n').trimEnd()
  const language = inferCodeLanguage(code, fileName)
  const parts = [`\`\`\`${language}\n${code}\n\`\`\``]
  if (source) parts.push(`[View the original GitHub Gist](${source})`)
  return parts.join('\n\n')
}

function embedMarkdown(embed) {
  if (/gist\.github\.com/i.test(embed.bodyHtml || '')) return gistEmbedMarkdown(embed)
  const tables = embed.tables || []
  return tables.map(markdownTable).filter(Boolean).join('\n\n')
}

function localizeImageSources($, slug) {
  const assetDir = path.join(publicBlogDir, slug)
  if (!fs.existsSync(assetDir)) return
  const files = fs.readdirSync(assetDir)
  $('img[src]').each((_, image) => {
    const src = $(image).attr('src') || ''
    let decoded = src
    try {
      decoded = decodeURIComponent(src)
    } catch {
      // Keep the source unchanged when it contains invalid URL escapes.
    }
    const mediaMatch = decoded.match(/\/media\/([^/?#]+)/)
    if (!mediaMatch) return
    const expected = mediaMatch[1].replace(/~/g, '_')
    const match = files.find((file) => file === expected || file.startsWith(expected.replace(/\.[^.]+$/, '')))
    if (match) $(image).attr('src', `/blog/${slug}/${match}`)
  })
}

function frontmatterForMissingPost(capture, description) {
  return [
    '---',
    `title: "${escapeYaml(capture.title)}"`,
    `description: "${escapeYaml(description)}"`,
    'date: "2023-05-05"',
    'author: "Dhiraj Nambiar"',
    'slug: "google-analytics-ua-vs-ga4-data-model-changes"',
    'heroImage: "/blog/google-analytics-ua-vs-ga4-data-model-changes/031d94_a0a329693b444a318980b17fafcfa508_mv2.png"',
    'tags:',
    '  - "Google Analytics"',
    '  - "Modern Data Stack"',
    'comments: true',
    '---',
  ].join('\n')
}

function captureFiles() {
  return fs.readdirSync(wixRawDir)
    .filter((file) => /^\d{2}-.*\.json$/.test(file))
    .sort()
}

function main() {
  const results = []
  for (const file of captureFiles()) {
    const capture = JSON.parse(fs.readFileSync(path.join(wixRawDir, file), 'utf8'))
    const slug = capture.index <= sourceSlugs.length
      ? sourceSlugs[capture.index - 1]
      : 'google-analytics-ua-vs-ga4-data-model-changes'
    const outputPath = path.join(blogDir, `${slug}.md`)
    const existing = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, 'utf8') : ''
    const existingFrontmatter = existing.match(/^---\s*\n[\s\S]*?\n---/i)?.[0]

    const $ = load(capture.richHtml || '', null, false)
    localizeImageSources($, slug)
    $('iframe[data-hook="iframe-component"]').each((index, iframe) => {
      $(iframe).replaceWith(`<p>WIXEMBED${index}PLACEHOLDER</p>`)
    })

    let markdown = htmlToMarkdown($.root().html() || '')
    for (let index = 0; index < (capture.embeds || []).length; index += 1) {
      markdown = markdown.replace(
        `WIXEMBED${index}PLACEHOLDER`,
        embedMarkdown(capture.embeds[index]),
      )
    }
    markdown = markdown
      // Wix split this bold label across individual text spans. Normalize it
      // so the migrated sentence remains searchable and renders as one label.
      .replace(/I\*\*ntegrate logit\\_b\*\*ias/g, '**Integrate logit_bias**')
      .replace(/[ \t]+$/gm, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim()

    const description = capture.richText
      .split(/\n+/)
      .map((line) => line.trim())
      .find((line) => line.length >= 80)
      ?.slice(0, 220) || 'Newtuple blog post.'
    const frontmatter = existingFrontmatter || frontmatterForMissingPost(capture, description)
    fs.writeFileSync(outputPath, `${frontmatter}\n${markdown}\n`)

    results.push({
      index: capture.index,
      slug,
      created: !existing,
      embeds: capture.embeds?.length || 0,
      bodyLength: markdown.length,
    })
  }

  fs.writeFileSync(
    path.join(root, 'reference', 'wix-import-report.json'),
    `${JSON.stringify({ total: results.length, results }, null, 2)}\n`,
  )
  console.log(`Imported ${results.length} Wix editor posts.`)
}

main()
