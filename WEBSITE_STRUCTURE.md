# Website Structure & Content System Overview

This document summarizes the current codebase structure, how Markdown content is used, and a reusable design direction suitable for a new product website (distinct from Newtuple’s “agentic future” positioning).

## High-Level Architecture
- Framework: Next.js (App Router)
- Output: Static export (`output: 'export'`)
- Styling: Tailwind CSS
- Content: Local Markdown + frontmatter
- Pages: Mix of dynamic Markdown-driven pages and custom React layouts

## Content System (Markdown)
Markdown lives under `content/` and is parsed with `gray-matter` in `lib/content.ts`.

### How it Works
- Each Markdown file contains **frontmatter** (metadata) and **body** content.
- `lib/content.ts` exposes helpers:
  - `getPageContent(slug)` for general pages
  - `getAllCaseStudies()` for case study summaries
  - `getAllBlogPosts()` and `getBlogPost(slug)` for blog posts
- Markdown is rendered via `react-markdown` with custom components for headings, paragraphs, lists, code, etc.

### Content Locations
- General pages: `content/*.md`
- Case studies: `content/case_studies/*.md`
- Blog posts: `content/blog/*.md`

### Frontmatter Conventions
Common fields used across content:
- `title` (string)
- `description` (string)

Blog frontmatter additionally supports:
- `date`, `updated`
- `author`
- `slug`
- `tags` (array)
- `heroImage`
- `canonical`
- `comments` (boolean)

### Rendering Usage
- Some pages directly render Markdown (`privacy-policy`, `service-agreement`).
- Others map frontmatter into bespoke React layouts using content data.

## Routing & Page Patterns
- Static routes live under `app/`.
- Dynamic page routing uses `app/[slug]/page.tsx` with a registry in `app/_pageRegistry.ts`.
- Blog routes:
  - Index: `app/blog/page.tsx`
  - Detail: `app/post/[slug]/page.tsx`

## Components & Layout
- Shared layout: `app/layout.tsx`
- Reusable UI sections: `components/sections/`
- Motion helpers: `components/motion/`
- Core UI primitives: `components/ui/`

## Metadata & SEO
- Centralized metadata helper: `lib/metadata.ts`
- Sitemap generated in `app/sitemap.ts`
- Robots in `app/robots.ts`

## Suggested Design Direction (Reusable, Non‑Newtuple)
This direction avoids the “agentic/tooling future” aesthetic and positions the new product as clear, modern, and confident.

### Visual Theme
- **Tone:** Crisp, editorial, product‑forward.
- **Color palette:** Neutral base (white / light gray) + a single confident accent (e.g., deep teal, cobalt, or ember).
- **Backgrounds:** Subtle gradients or texture blocks, not heavy sci‑fi motifs.
- **Imagery:** Product UI, diagrams, and real workflows. Avoid futuristic abstract agent imagery.

### Typography
- **Headings:** A sharp serif or geometric sans (e.g., “Space Grotesk” or “Söhne‑like”).
- **Body:** Clean sans with high legibility (e.g., “Inter‑like” but can be swapped).
- **Hierarchy:** Large, confident H1; short sub‑headline; well‑spaced sections.

### Layout Principles
- **Hero:** Direct value proposition + short subtext + 1 primary CTA.
- **Sections:** Alternating light panels with clear headers and short copy blocks.
- **Feature grids:** Use icon + short title + 2–3 line descriptions.
- **Proof:** Customer logos, metrics, or a short quote band.
- **Narrative flow:** Problem → Solution → Differentiators → Proof → CTA.

### Content Style
- Short, precise headlines.
- Avoid heavy jargon or speculative futurism.
- Use simple product metaphors and tangible outcomes.

## Recommended Page Set for the New Product
These map cleanly to the current structure:
- `/` (Home)
- `/product` (Deep dive)
- `/pricing` (if applicable)
- `/case-studies` or `/customers`
- `/blog` (optional)
- `/about` / `/team`
- `/contact`

## Migration Notes
- The Markdown system is already production‑ready for a product site.
- New pages can be created by:
  1. Adding a Markdown file under `content/`
  2. Registering the slug in `app/_pageRegistry.ts`
  3. Creating a layout under `app/<slug>/content.tsx`

---

If you want, I can tailor this file to the specific product narrative and create a full page‑by‑page content outline in Markdown.
