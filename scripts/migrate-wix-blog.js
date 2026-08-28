const fs = require('fs')
const path = require('path')
const { parseRss } = require('./lib/rss')
const { htmlToMarkdown } = require('./lib/html-to-md')
const { downloadImage, normalizeWixImageUrl } = require('./lib/image-downloader')
const { load } = require('cheerio')
const puppeteer = require('puppeteer')

const RSS_URL = 'https://www.newtuple.com/blog-feed.xml'
const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog')
const PUBLIC_BLOG_DIR = path.join(process.cwd(), 'public', 'blog')
const HTML_OVERRIDE_DIR = path.join(process.cwd(), 'reference', 'wix-html')

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function slugFromLink(link) {
  if (!link) return ''
  try {
    const url = new URL(link)
    const parts = url.pathname.split('/').filter(Boolean)
    const idx = parts.indexOf('post')
    if (idx !== -1 && parts[idx + 1]) return parts[idx + 1]
    return parts[parts.length - 1] || ''
  } catch {
    return ''
  }
}

function extractHtmlOverride(slug) {
  const htmlPath = path.join(HTML_OVERRIDE_DIR, `${slug}.html`)
  const mhtmlPath = path.join(HTML_OVERRIDE_DIR, `${slug}.mhtml`)

  if (fs.existsSync(htmlPath)) {
    return fs.readFileSync(htmlPath, 'utf-8')
  }

  if (fs.existsSync(mhtmlPath)) {
    const raw = fs.readFileSync(mhtmlPath, 'utf-8')
    const idx = raw.toLowerCase().indexOf('<html')
    if (idx !== -1) {
      return raw.slice(idx)
    }
  }

  return null
}

function extractDescription(html) {
  const $ = load(html)
  const firstParagraph = $('p').first().text().trim()
  return firstParagraph
}

async function scrapePostHtml(link) {
  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()
  await page.goto(link, { waitUntil: 'networkidle2', timeout: 60000 })

  const data = await page.evaluate(() => {
    const jsonLd = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
      .map((el) => {
        try {
          return JSON.parse(el.textContent || '{}')
        } catch {
          return null
        }
      })
      .filter(Boolean)
    const blogLd = jsonLd.find((entry) => entry['@type'] === 'BlogPosting') || {}

    const selectors = [
      '[data-hook=\"post\"]',
      '[data-hook=\"post-page\"]',
      '[data-hook=\"post-content\"]',
      '[data-hook=\"post-content-wrapper\"]',
      '[data-hook=\"post-content-container\"]',
      '[data-hook=\"rich-content\"]',
      'article',
    ]

    let html = ''
    for (const selector of selectors) {
      const el = document.querySelector(selector)
      if (el && (el.textContent || '').trim().length > 200) {
        html = el.innerHTML
        break
      }
    }

    if (!html) {
      const main = document.querySelector('main') || document.body
      let best = null
      let bestLen = 0
      main.querySelectorAll('div,article,section').forEach((el) => {
        const len = (el.textContent || '').trim().length
        if (len > bestLen) {
          best = el
          bestLen = len
        }
      })
      html = best ? best.innerHTML : ''
    }

    return {
      html,
      meta: {
        title: blogLd.headline || '',
        description: blogLd.description || '',
        author: blogLd.author?.name || '',
        datePublished: blogLd.datePublished || '',
        dateModified: blogLd.dateModified || '',
        image: blogLd.image?.url || '',
      },
    }
  })

  await browser.close()
  return data
}

function buildFrontmatter(post) {
  const tags = post.tags && post.tags.length ? `\n${post.tags.map((tag) => `  - "${tag.replace(/"/g, '\\"')}"`).join('\n')}` : ''

  return [
    '---',
    `title: "${post.title.replace(/"/g, '\\"')}"`,
    `description: "${post.description.replace(/"/g, '\\"')}"`,
    `date: "${post.date}"`,
    post.updated ? `updated: "${post.updated}"` : null,
    post.author ? `author: "${post.author.replace(/"/g, '\\"')}"` : null,
    `slug: "${post.slug}"`,
    post.tags && post.tags.length ? `tags:${tags}` : null,
    post.heroImage ? `heroImage: "${post.heroImage}"` : null,
    'comments: true',
    '---',
    '',
  ].filter(Boolean).join('\n')
}

async function rewriteImages(html, slug) {
  const $ = load(html)
  const imgTags = $('img')
  const destDir = path.join(PUBLIC_BLOG_DIR, slug)
  ensureDir(destDir)
  const usedNames = new Set()
  const replacements = []

  for (const img of imgTags.toArray()) {
    const src = $(img).attr('src')
    if (!src || src.startsWith('data:')) continue

    const { ok, fileName } = await downloadImage(src, destDir, usedNames)
    if (!ok || !fileName) continue

    const localPath = `/blog/${slug}/${fileName}`
    $(img).attr('src', localPath)
    replacements.push(localPath)
  }

  return { html: $.html(), firstImage: replacements[0] || '' }
}

async function main() {
  ensureDir(CONTENT_DIR)
  ensureDir(PUBLIC_BLOG_DIR)

  const res = await fetch(RSS_URL)
  if (!res.ok) {
    throw new Error(`Failed to fetch RSS: ${res.status}`)
  }

  const xml = await res.text()
  const items = parseRss(xml)

  const report = {
    total: items.length,
    migrated: 0,
    failed: [],
    sources: {},
    discovered: 0,
  }

  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()
  await page.goto('https://www.newtuple.com/blog', { waitUntil: 'networkidle2', timeout: 60000 })
  let lastCount = 0
  for (let i = 0; i < 15; i += 1) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const count = await page.evaluate(() => document.querySelectorAll('a[href*=\"/post/\"]').length)
    if (count <= lastCount) break
    lastCount = count
  }
  const discoveredLinks = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a[href*=\"/post/\"]')).map((a) => a.href)
  )
  await browser.close()

  const discovered = Array.from(new Set(discoveredLinks))
  report.discovered = discovered.length

  const rssBySlug = new Map()
  for (const item of items) {
    const slug = slugFromLink(item.link)
    if (slug) {
      rssBySlug.set(slug, item)
    }
  }

  const allSlugs = new Set([...rssBySlug.keys(), ...discovered.map(slugFromLink)])

  for (const slug of allSlugs) {
    const item = rssBySlug.get(slug)
    const link = item?.link || `https://www.newtuple.com/post/${slug}`

    const overrideHtml = extractHtmlOverride(slug)
    let sourceHtml = overrideHtml || (item ? item.content : '') || ''
    let sourceType = overrideHtml ? 'override' : item?.content ? 'rss' : ''
    let meta = {
      title: item?.title || '',
      description: item?.description ? load(item.description).text().trim() : '',
      author: item?.author || '',
      datePublished: item?.pubDate || '',
      dateModified: item?.updated || '',
      image: item?.enclosure || '',
    }

    if (!sourceHtml || sourceHtml.length < 500) {
      try {
        const scraped = await scrapePostHtml(link)
        if (scraped?.html && scraped.html.length > 200) {
          sourceHtml = scraped.html
          meta = {
            title: scraped.meta.title || meta.title,
            description: scraped.meta.description || meta.description,
            author: scraped.meta.author || meta.author,
            datePublished: scraped.meta.datePublished || meta.datePublished,
            dateModified: scraped.meta.dateModified || meta.dateModified,
            image: scraped.meta.image || meta.image,
          }
          sourceType = 'scraped'
        }
      } catch (error) {
        console.warn(`Failed to scrape ${link}:`, error.message || error)
      }
    }

    if (!sourceHtml) {
      report.failed.push({ title: meta.title || slug, slug, reason: 'missing-html' })
      continue
    }

    const description = meta.description || extractDescription(sourceHtml)
    const { html: htmlWithLocalImages, firstImage } = await rewriteImages(sourceHtml, slug)
    let heroImage = ''
    if (meta.image) {
      const destDir = path.join(PUBLIC_BLOG_DIR, slug)
      ensureDir(destDir)
      const { ok, fileName } = await downloadImage(normalizeWixImageUrl(meta.image), destDir, new Set())
      if (ok && fileName) {
        heroImage = `/blog/${slug}/${fileName}`
      }
    }
    const markdown = htmlToMarkdown(htmlWithLocalImages)

    const frontmatter = buildFrontmatter({
      title: meta.title || slug,
      description: description || 'Newtuple blog post.',
      date: new Date(meta.datePublished || Date.now()).toISOString().slice(0, 10),
      updated: meta.dateModified ? new Date(meta.dateModified).toISOString().slice(0, 10) : undefined,
      author: meta.author || 'Newtuple',
      slug,
      tags: item?.categories || [],
      heroImage: heroImage || firstImage || '',
    })

    const output = `${frontmatter}\n${markdown.trim()}\n`
    const outPath = path.join(CONTENT_DIR, `${slug}.md`)
    fs.writeFileSync(outPath, output)

    report.migrated += 1
    report.sources[slug] = sourceType || 'unknown'
  }

  fs.writeFileSync(path.join(process.cwd(), 'reference', 'wix-export-report.json'), JSON.stringify(report, null, 2))
  console.log('Migration complete:', report)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
