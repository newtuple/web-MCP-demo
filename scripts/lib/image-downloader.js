const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const { URL } = require('url')

function normalizeWixImageUrl(url) {
  if (!url) return url
  if (!url.includes('static.wixstatic.com/media/')) return url

  // Prefer the original asset without size transforms when possible.
  const match = url.match(/static\.wixstatic\.com\/media\/([^/]+)\//)
  if (match && match[1]) {
    return `https://static.wixstatic.com/media/${match[1]}`
  }

  return url
}

function safeFileName(input, fallback) {
  if (!input) return fallback
  const cleaned = input.replace(/[^a-zA-Z0-9._-]/g, '_')
  return cleaned || fallback
}

function hashSuffix(value) {
  return crypto.createHash('md5').update(value).digest('hex').slice(0, 6)
}

function extFromContentType(contentType) {
  if (!contentType) return ''
  if (contentType.includes('image/png')) return '.png'
  if (contentType.includes('image/jpeg')) return '.jpg'
  if (contentType.includes('image/webp')) return '.webp'
  if (contentType.includes('image/gif')) return '.gif'
  return ''
}

async function downloadImage(url, destDir, usedNames) {
  try {
    const normalizedUrl = normalizeWixImageUrl(url)
    const parsed = new URL(normalizedUrl)
    const baseName = path.basename(parsed.pathname) || 'image'
    let ext = path.extname(baseName)
    let fileName = safeFileName(baseName, `image${ext || '.jpg'}`)

    if (usedNames.has(fileName)) {
      const suffix = hashSuffix(url)
      if (ext) {
        fileName = fileName.replace(ext, `-${suffix}${ext}`)
      } else {
        fileName = `${fileName}-${suffix}`
      }
    }

    usedNames.add(fileName)
    const destPath = path.join(destDir, fileName)

    const res = await fetch(normalizedUrl)
    if (!res.ok) {
      return { ok: false, fileName: null }
    }

    if (!ext) {
      const contentType = res.headers.get('content-type')
      const derivedExt = extFromContentType(contentType)
      if (derivedExt) {
        ext = derivedExt
        const renamed = `${fileName}${derivedExt}`
        usedNames.delete(fileName)
        fileName = renamed
        usedNames.add(fileName)
      }
    }

    const buffer = Buffer.from(await res.arrayBuffer())
    fs.writeFileSync(path.join(destDir, fileName), buffer)
    return { ok: true, fileName }
  } catch {
    return { ok: false, fileName: null }
  }
}

module.exports = { downloadImage, safeFileName, hashSuffix, normalizeWixImageUrl }
