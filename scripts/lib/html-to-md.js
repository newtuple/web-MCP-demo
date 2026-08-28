const TurndownService = require('turndown')

function htmlToMarkdown(html) {
  const turndown = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
  })

  turndown.addRule('pre', {
    filter: 'pre',
    replacement(content) {
      const trimmed = content.replace(/\n\n+/g, '\n').trim()
      return `\n\n\`\`\`\n${trimmed}\n\`\`\`\n\n`
    },
  })

  turndown.addRule('br', {
    filter: 'br',
    replacement() {
      return '\n'
    },
  })

  return turndown.turndown(html)
}

module.exports = { htmlToMarkdown }
