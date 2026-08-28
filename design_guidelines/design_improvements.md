# Design Improvements Tracker

Tracked improvements identified from the site audit (Feb 2025).

## Priority 0  Conversational Contact Experience (Top Priority)

- [ ] Replace traditional contact-detail collection flows with an AI chat-first experience across the website.
- [ ] Implement a Typeform-inspired, minimalist chat UI for contact capture and service discovery:
  - single active input line with a blinking cursor visual anchored after the typed email text,
  - one focused prompt at a time,
  - generous whitespace, low-noise layout, and clear hierarchy.
- [ ] Ensure the conversation feels premium and calm with slow, smooth transitions (message reveal, state change, and step progression animations).
- [ ] Back the chat flow with an LLM-powered real-time conversational agent that can:
  - gather contact details naturally,
  - answer questions about services,
  - guide users toward next best actions.
- [ ] Add appointment scheduling capability directly within the chat journey (collect intent, propose slots, confirm booking context).
- [ ] Define production requirements for this flow:
  - fallback/escalation path when the agent cannot answer,
  - privacy and consent messaging for captured contact details,
  - conversation logging/analytics for lead quality and conversion tracking.

## Priority 1  Functional Fixes

- [ ] Fix navigation dropdowns (hover/click not opening on desktop)
- [ ] Fix page title duplication (e.g. "About | Newtuple | Newtuple")

## Priority 2  Social Proof & Trust

- [x] Add client logos / social proof strip to homepage (below stats bar)
- [ ] Add technology partner logos section (Azure, AWS, LangChain, etc.)
- [x] Add more client testimonials beyond the single aviation quote
- [ ] Add industry trust badges or certification marks if applicable

## Priority 3  Visual Richness

- [ ] Add hero imagery / illustrations to at least homepage, agents, and about-us pages
- [ ] Add product UI screenshots to Dialogtuple, Uttertuple, Omnituple, Gaugetuple pages
- [ ] Add team or culture photos to About Us and Life at Newtuple pages
- [ ] Add architecture diagrams or flow visuals to service pages

## Priority 4  Layout Variety

- [x] Differentiate page layouts per type (services vs products vs industries)
- [x] Reduce hero section vertical padding (compact prop on inner pages)
- [x] Add a split-hero variant (text left, visual right) for product pages
- [ ] Vary section backgrounds beyond white and blue gradient

## Priority 5  Component Polish

- [ ] Improve card hover states (elevation, shadow, color accents)
- [ ] Vary CTAs across the site (not always "Talk to Our Experts")
- [ ] Strengthen the case study section with more visual weight
- [ ] Add a dedicated "Case Studies" page with multiple examples

## Priority 6  Responsive & Interaction

- [ ] Fix hamburger menu showing alongside full nav on desktop
- [ ] Add navigation dropdown animations
- [ ] Review mobile layout for all pages

## Priority 7  Homepage Redesign (Inspired by tenex.co)

### High Impact

- [x] Dark hero section: switch hero from light gradient to dark/near-black background with white text, dramatic AI-related imagery, much larger and bolder headline
- [x] Mixed-weight typography: vary font weights within a single heading (e.g. "Build Your **Agentic** Enterprise." with bold + extralight in one line)
- [x] Full-bleed dark sections: use 2-3 dark background sections (dark navy or near-black) instead of only white/gray alternation
- [x] Bold manifesto section: add a section with opinionated, provocative copy about AI philosophy, personality-driven rather than just describing services
- [x] Accent color pops: highlight key words within dark sections using cobalt or a secondary accent color for visual punch

### Medium Impact

- [x] "Our Approach" stacked cards: replace "Two Paths" 2-column grid with 3 vertically-stacked bordered cards (e.g. Strategy, Engineering, Operations) with illustrations on the right side
- [x] Horizontal testimonial cards: replace carousel with side-scrolling flat cards showing client logos + quotes + decorative accent quote marks
- [x] Accent ticker marquee: add a horizontally-scrolling ticker strip (e.g. "Built by builders, trusted by leaders" style)
- [x] FAQ accordion: add a "Questions? We have answers" section with expandable FAQ items on the homepage
- [x] Dramatic final CTA: dark background with imagery and a punchy one-liner + button instead of standard CTA section

### Lower Priority

- [ ] Simplify nav: reduce nav density to logo + minimal links + hamburger for cleaner top-of-page presence
- [ ] Minimal footer: slim down footer to logo, copyright, email, social icons
- [ ] Vary section spacing: remove uniform vertical padding between sections for a more editorial feel

### Design Principles to Keep

- Light theme as base: use dark for hero + 1-2 key sections, keep the rest light
- Cobalt color system: no need to switch to yellow, just use cobalt more boldly
- Current content structure: stats, client logos, testimonials, accelerators are all good sections; change is in presentation, not content
