const { XMLParser } = require('fast-xml-parser')

function normalizeArray(value) {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

function parseRss(xml) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    parseTagValue: true,
    trimValues: true,
    ignoreDeclaration: true,
    removeNSPrefix: true,
  })

  const doc = parser.parse(xml)
  const channel = doc?.rss?.channel || doc?.feed
  const items = normalizeArray(channel?.item || channel?.entry)

  return items.map((item) => {
    const link = item.link?.href || item.link
    const enclosure = item.enclosure?.url || item.enclosure?.['@_url'] || item.enclosure?.['@_href'] || ''
    const content = item['content:encoded'] || item.encoded || item.content || item.description || ''
    const author = item['dc:creator'] || item.creator || item.author?.name || item.author || ''
    const categories = normalizeArray(item.category).map((cat) => {
      if (typeof cat === 'string') return cat
      return cat?.['#text'] || cat?.text || ''
    }).filter(Boolean)

    return {
      title: item.title || '',
      link: link || '',
      pubDate: item.pubDate || item.published || item.updated || '',
      updated: item.updated || item.pubDate || '',
      author,
      categories,
      description: item.description || '',
      content,
      enclosure,
    }
  })
}

module.exports = { parseRss }
