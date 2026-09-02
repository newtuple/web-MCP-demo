# Newtuple - The AI-Native Website (WebMCP Demo)

**A website that both humans and AI agents can use as first-class visitors.** Humans browse, chat, and click. Agents discover 18 in-page [WebMCP](https://github.com/webmachinelearning/webmcp) tools and do everything a human can - navigate, personalize the whole site, filter job openings, and send leads - **without clicking a single pixel**.

Built by [Newtuple Technologies](https://newtuple.com) as a hackathon submission.

---

## For non-developers: what does this actually do?

Most websites are built only for human eyes. AI agents visiting them have to "look" at the screen and guess where to click - slow and fragile.

This site is different. Every page **announces a menu of actions** (tools) that any WebMCP-capable browser agent (e.g. Chrome agents, Codex in the browser) can call directly:

- **The site rebuilds itself per visitor.** Tell it (or have your agent tell it) *"I'm a retail CIO on SAP evaluating vendors"* - navigation, headlines, colors, calls-to-action, and case studies all reshape around you, live, with no page reload.
- **Navigation without navigating.** Ask for a product and its page is rendered **in place** on the current screen - the URL never changes, nothing reloads.
- **A single chatbot, everywhere.** The "Ask Newtuple" assistant handles navigation, personalization, and contact in one conversation. A human typing there and an agent calling tools go through the *same* logic and get the *same* results.
- **Contact with context.** Contact requests carry a "Regarding" field that auto-fills from the page you came from (visit Flowtuple → contact is about Flowtuple). Your agent can submit a lead on your behalf - but only with your explicit consent, and production bot-protection still applies.
- **Job search for agents.** Say *"I'm looking for a business analyst role"* - the careers page filters itself exactly as if a human used the filter controls, and the agent can read the full job description.

**The demo pitch in one line:** the same website, two audiences - pixels for people, tools for agents, one source of truth.

---

## For developers

### Stack

- **Next.js 14** (App Router, static export in production) + React 18 + Tailwind CSS
- **WebMCP** - tools registered on `navigator.modelContext` / `document.modelContext`
- **OpenAI Agents SDK** (`@openai/agents`) - server-side natural-language navigator (`gpt` classifier behind `/api/navigate`)
- **Cloudflare Pages** - static hosting + Pages Functions for the API; AWS SES for lead email; Turnstile for bot protection
- **Vitest** for tests

### Quick start

```bash
npm install
cp .env.example .env      # fill in OPENAI_API_KEY at minimum
npm run dev               # http://localhost:3000
npm test                  # unit tests
npm run build             # static export to ./out
```

Without `OPENAI_API_KEY`, everything works except the natural-language `navigate_site` classifier (the chatbot's routing). Without SES/Turnstile config, contact submissions log an error instead of sending email - fine for local demos.

### The 18 WebMCP tools

Registered site-wide by `components/webmcp/WebMCPProvider.tsx`:

| Category | Tools |
|---|---|
| Orient (read) | `get_site_state`, `list_site_pages` |
| Personalize | `infer_visitor_context`, `set_visitor_context`, `update_visitor_profile`, `reset_visitor_context` |
| Read the adaptation | `generate_page_variant`, `reorder_navigation`, `select_case_studies`, `choose_cta` |
| Navigate in place | `render_page_view`, `close_page_view`, `navigate_site` |
| Contact | `prepare_contact_request` (human confirms), `submit_contact_request` (direct, consent-gated) |
| Careers | `list_open_roles`, `get_role_details`, `filter_careers_page` |

### Architecture map

```
components/webmcp/
  WebMCPProvider.tsx        registers all tools; applies accent theme per intent
  SiteAssistant.tsx         the site-wide chatbot (navigate / personalize / contact)
  PageView.tsx              in-place page rendering (render_page_view)
  navigateTools.ts          navigate_site + list_site_pages
  contactTools.ts           prepare/submit contact request
  careersTools.ts           list/read/filter open roles
  AdaptiveSiteExperience.tsx  the adaptive homepage
  AdaptiveRecommendations.tsx personalization band on every page
lib/
  adaptiveSite.ts           visitor context model + keyword inference + variants
  pageView/store.ts         in-place page view state (CSS-driven content swap)
  careers/roles.ts          shared role matcher (page UI == tool results)
  navigate/                 server-side LLM navigator + client session
  server/                   contact/careers form validation, email, rate limits
app/api + functions/api     dev routes + Cloudflare Pages Functions
```

Key design rules:

1. **One logic path for humans and agents.** The chatbot's send button and the `navigate_site` tool call the same classifier; the careers page's filter UI and `filter_careers_page` use the same matcher (`lib/careers/roles.ts`). Agent results can never disagree with what the human sees.
2. **In-place rendering over routing.** `render_page_view` hides the current route's `<main>` with a CSS attribute switch (`html[data-page-view]`) and renders the requested page's view in its place - URL unchanged, tool registrations preserved.
3. **Personalization is a theme + content contract.** All gradients, accents, and grid tints read `--accent-*` CSS variables swapped per visitor intent, so one context write repaints every page.
4. **Consent and safety gates stay.** `submit_contact_request` refuses without `consent: true`; production Turnstile still blocks headless submits (the tool then hands off to the human-confirmed flow).

### Testing with an agent

Point any WebMCP-capable browser agent at the site and say things like:

- "I'm the CIO of a large retail company, we run SAP, and I'm evaluating vendors for product-data automation."
- "Show me your LLM evaluation product - right here, without changing the page."
- "I'm looking for a business analyst position - show me matching openings."
- "Send Newtuple a contact request on my behalf about Flowtuple." (it will ask for consent)

No WebMCP browser handy? Simulate one in DevTools before/after load:

```js
window.__tools = []
navigator.modelContext = { registerTool: async (t) => window.__tools.push(t) }
// wait ~1s, then:
window.__tools.map(t => t.name)   // → 18 tool names
```

---

## License

MIT © Newtuple Technologies Private Ltd. - see [LICENSE](LICENSE).
