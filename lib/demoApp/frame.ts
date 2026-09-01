// The sandbox the generated page runs in.
//
// Security model, in order of strength:
//   1. The iframe carries sandbox="allow-scripts allow-forms" and NOT
//      allow-same-origin, so the page gets an opaque origin. It cannot touch
//      this site's DOM, cookies, storage or same-origin APIs, and cannot
//      navigate the top frame. The only channel out is postMessage.
//   2. The document declares a CSP with default-src 'none' and connect-src
//      'none', so the page cannot make a network request of any kind: no
//      exfiltration, no remote code, no beacons.
//   3. Everything is inline, so there is nothing to load and nothing to trust.
//
// On top of that the frame installs the small runtime the page is written
// against: notify(), and shims for the APIs the sandbox would otherwise throw
// on, so a page that reaches for fetch or localStorage degrades with a message
// in the activity log instead of dying halfway through rendering.

export const FRAME_SANDBOX = 'allow-scripts allow-forms'

const CSP = [
  "default-src 'none'",
  "script-src 'unsafe-inline'",
  "style-src 'unsafe-inline'",
  "img-src data: blob:",
  "media-src data:",
  "font-src data:",
  "connect-src 'none'",
  "form-action 'none'",
  "base-uri 'none'",
  "frame-src 'none'",
  "object-src 'none'",
].join('; ')

const RESET = `
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  html { -webkit-text-size-adjust: 100%; }
  body { min-height: 100vh; font: 15px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #14151a; background: #fff; }
  img, svg { max-width: 100%; }
  button, input, select, textarea { font: inherit; color: inherit; }
  :focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
  [hidden] { display: none !important; }
`

/** Runs before the generated script, so the page is written against it. */
const RUNTIME = String.raw`
(function () {
  var post = function (message) {
    try { parent.postMessage(Object.assign({ __newtuple: 1 }, message), '*') } catch (error) { /* nothing to do */ }
  }

  window.notify = function (message) {
    post({ type: 'notify', message: String(message == null ? '' : message).slice(0, 400) })
  }

  // The sandbox has no storage and no network. Rather than let the page die on
  // a SecurityError, give it something that fails politely and says so once.
  var warned = {}
  var warn = function (api) {
    if (warned[api]) return
    warned[api] = true
    window.notify('This page tried to use ' + api + ', which is blocked in the demo sandbox.')
  }

  var memoryStore = (function () {
    var data = {}
    return {
      getItem: function (key) { return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null },
      setItem: function (key, value) { data[key] = String(value) },
      removeItem: function (key) { delete data[key] },
      clear: function () { data = {} },
      key: function (index) { return Object.keys(data)[index] || null },
      get length() { return Object.keys(data).length },
    }
  })()

  try { Object.defineProperty(window, 'localStorage', { configurable: true, get: function () { warn('localStorage'); return memoryStore } }) } catch (error) { /* leave as is */ }
  try { Object.defineProperty(window, 'sessionStorage', { configurable: true, get: function () { warn('sessionStorage'); return memoryStore } }) } catch (error) { /* leave as is */ }

  var blocked = function (api) {
    return function () { warn(api); return Promise.reject(new Error(api + ' is blocked in the demo sandbox')) }
  }
  try { window.fetch = blocked('fetch') } catch (error) { /* leave as is */ }
  try {
    window.XMLHttpRequest = function () {
      warn('XMLHttpRequest')
      this.open = function () {}; this.send = function () {}; this.setRequestHeader = function () {}
      this.addEventListener = function () {}; this.abort = function () {}
    }
    window.WebSocket = function () { warn('WebSocket') }
    window.EventSource = function () { warn('EventSource') }
  } catch (error) { /* leave as is */ }

  var describe = function () {
    var controls = []
    var nodes = document.querySelectorAll('button, [role="button"], a, input, select, textarea, [contenteditable="true"]')
    for (var i = 0; i < nodes.length && controls.length < 60; i += 1) {
      var el = nodes[i]
      var label = el.getAttribute('aria-label') || (el.textContent || '').trim() || el.getAttribute('placeholder') || el.getAttribute('name') || el.value || ''
      controls.push({
        tag: el.tagName.toLowerCase(),
        type: el.getAttribute('type') || '',
        label: String(label).replace(/\s+/g, ' ').trim().slice(0, 70),
        disabled: !!el.disabled,
      })
    }
    return {
      text: ((document.body && document.body.innerText) || '').replace(/\n{3,}/g, '\n\n').trim().slice(0, 6000),
      controls: controls,
      toolsImplemented: Object.keys(window.tools || {}),
    }
  }

  window.addEventListener('message', function (event) {
    var data = event.data
    if (!data || data.__newtuple !== 1 || data.type !== 'call') return
    var id = data.id
    var name = String(data.name || '')
    var args = data.args && typeof data.args === 'object' ? data.args : {}

    var reply = function (ok, message, payload) {
      post({ type: 'result', id: id, ok: !!ok, message: String(message == null ? '' : message).slice(0, 4000), data: payload === undefined ? null : payload })
    }

    if (name === '__describe') {
      try { return reply(true, 'Page read.', describe()) } catch (error) { return reply(false, 'Could not read the page: ' + (error && error.message)) }
    }

    var tools = window.tools || {}
    var fn = tools[name]
    if (typeof fn !== 'function') {
      return reply(false, 'This page does not implement "' + name + '". It implements: ' + Object.keys(tools).join(', ') + '.')
    }

    var settle = function (out) {
      var payload = out && typeof out === 'object' ? out : null
      var ok = payload && Object.prototype.hasOwnProperty.call(payload, 'ok') ? !!payload.ok : true
      var message = payload && payload.message ? payload.message : 'Done.'
      var body = payload && payload.data !== undefined ? payload.data : payload
      reply(ok, message, body === undefined ? null : body)
    }

    try {
      var result = fn(args)
      if (result && typeof result.then === 'function') {
        result.then(settle, function (error) { reply(false, 'The page tool failed: ' + (error && error.message ? error.message : String(error))) })
      } else {
        settle(result)
      }
    } catch (error) {
      reply(false, 'The page tool threw: ' + (error && error.message ? error.message : String(error)))
    }
  })

  var announceReady = function () {
    post({ type: 'ready', tools: Object.keys(window.tools || {}) })
  }
  if (document.readyState === 'complete' || document.readyState === 'interactive') setTimeout(announceReady, 0)
  else window.addEventListener('DOMContentLoaded', announceReady)

  window.addEventListener('error', function (event) {
    post({ type: 'error', message: String((event && event.message) || 'script error').slice(0, 300) })
  })
  window.addEventListener('unhandledrejection', function (event) {
    var reason = event && event.reason
    post({ type: 'error', message: String((reason && reason.message) || reason || 'promise rejection').slice(0, 300) })
  })
})()
`

export function buildFrameDocument(html: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="${CSP}">
<title>Generated demo</title>
<style>${RESET}</style>
<script>${RUNTIME}</script>
</head>
<body>
${html}
</body>
</html>`
}
