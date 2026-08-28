'use client'
/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Hero from '@/components/sections/Hero'
import Section from '@/components/ui/Section'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import FadeIn from '@/components/motion/FadeIn'
import { StaggerItem } from '@/components/motion/StaggerChildren'
import { Clock, Search } from 'lucide-react'
import type { BlogPostSummary } from '@/lib/content'
import { getBlogImageMotionClass } from '@/lib/blogImages'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function PostCard({ post }: { post: BlogPostSummary }) {
  return (
    <Link href={`/post/${post.slug}`} className="group block h-full">
      <div className="h-full rounded-2xl bg-white shadow-premium hover:shadow-premium-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        {post.coverImage || post.heroImage ? (
          <div className="aspect-[16/9] overflow-hidden bg-gray-50/50">
            <img
              src={post.coverImage || post.heroImage}
              alt={post.title}
              className={`w-full h-full object-contain transition-transform duration-500 ${getBlogImageMotionClass(post.coverImage || post.heroImage)}`}
            />
          </div>
        ) : (
          <div className="aspect-[16/9] bg-gradient-to-br from-cobalt-50 to-cobalt-100/80 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-cobalt-200/40" />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
            <span>{formatDate(post.date)}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readingTime} min read
            </span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-cobalt-800 transition-colors mb-2 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-gray-600 font-light text-sm leading-relaxed line-clamp-3 mb-4">
            {post.description}
          </p>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="cobalt" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

function normalizeValue(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

type FilteredPost = {
  post: BlogPostSummary
  normalizedTitle: string
  normalizedDescription: string
  normalizedTags: string[]
  isLatest: boolean
}

export default function BlogListContent({ posts }: { posts: BlogPostSummary[] }) {
  const [query, setQuery] = useState('')
  const [scope, setScope] = useState<'all' | 'latest'>('all')
  const [selectedTagKey, setSelectedTagKey] = useState('all')

  const latestCount = Math.min(8, posts.length)
  const latestSlugs = useMemo(
    () => new Set(posts.slice(0, latestCount).map((post) => post.slug)),
    [posts, latestCount],
  )

  const normalizedPosts = useMemo<FilteredPost[]>(
    () =>
      posts.map((post) => ({
        post,
        normalizedTitle: normalizeValue(post.title),
        normalizedDescription: normalizeValue(post.description),
        normalizedTags: (post.tags ?? []).map((tag) => normalizeValue(tag)),
        isLatest: latestSlugs.has(post.slug),
      })),
    [posts, latestSlugs],
  )

  const tags = useMemo(() => {
    const tagMap = new Map<string, string>()
    normalizedPosts.forEach(({ post }) => {
      ;(post.tags ?? []).forEach((tag) => {
        const key = normalizeValue(tag)
        if (key && !tagMap.has(key)) tagMap.set(key, tag)
      })
    })
    return [
      { key: 'all', label: 'All' },
      ...Array.from(tagMap.entries()).map(([key, label]) => ({ key, label })),
    ]
  }, [normalizedPosts])

  const filteredPosts = useMemo(() => {
    const normalizedQuery = normalizeValue(query)
    return normalizedPosts.filter((item) => {
      const matchesScope = scope === 'all' || item.isLatest
      const matchesTag = selectedTagKey === 'all' || item.normalizedTags.includes(selectedTagKey)
      const matchesQuery =
        normalizedQuery.length === 0 ||
        item.normalizedTitle.includes(normalizedQuery) ||
        item.normalizedDescription.includes(normalizedQuery) ||
        item.normalizedTags.some((tag) => tag.includes(normalizedQuery))

      return matchesScope && matchesTag && matchesQuery
    })
  }, [normalizedPosts, query, scope, selectedTagKey])

  const [featured, ...rest] = filteredPosts

  const hasFilters = query.trim().length > 0 || scope !== 'all' || selectedTagKey !== 'all'

  return (
    <main className="min-h-screen">
      <Hero
        badge="Blog"
        title="Insights from the field"
        description="Practical notes on AI agents, systems engineering, and production delivery."
        compact
      />

      <Section className="pt-10 pb-4 md:pt-12 md:pb-5 bg-white">
        <FadeIn>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5 shadow-[0_18px_34px_-28px_rgba(15,23,42,0.3)]">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-4">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search blogs and articles"
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none transition-colors focus:border-cobalt-300"
                />
              </label>

              <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                <button
                  type="button"
                  onClick={() => setScope('all')}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    scope === 'all'
                      ? 'bg-cobalt-900 text-white'
                      : 'bg-white text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All Articles
                </button>
                <button
                  type="button"
                  onClick={() => setScope('latest')}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    scope === 'latest'
                      ? 'bg-cobalt-900 text-white'
                      : 'bg-white text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Latest Articles
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="overflow-x-auto scrollbar-hide -mx-1 px-1">
                <div className="flex flex-nowrap md:flex-wrap gap-2 min-w-max md:min-w-0">
                  {tags.map((tag) => (
                    <button
                      key={tag.key}
                      type="button"
                      onClick={() => setSelectedTagKey(tag.key)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                        selectedTagKey === tag.key
                          ? 'border-cobalt-300 bg-cobalt-50 text-cobalt-900'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900'
                      }`}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-sm text-gray-600 whitespace-nowrap">
                <span className="font-semibold text-gray-900">{filteredPosts.length}</span>{' '}
                {filteredPosts.length === 1 ? 'result' : 'results'}
              </div>
            </div>
          </div>
        </FadeIn>
      </Section>

      {featured && (
        <Section className="pt-2 pb-10 md:pt-2 md:pb-12">
          <FadeIn>
            <Link href={`/post/${featured.post.slug}`} className="group block">
              <div className="rounded-2xl bg-white shadow-premium hover:shadow-premium-lg transition-all duration-300 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {featured.post.coverImage || featured.post.heroImage ? (
                    <div className="aspect-[16/9] lg:aspect-auto overflow-hidden bg-gray-50/50">
                      <img
                        src={featured.post.coverImage || featured.post.heroImage}
                        alt={featured.post.title}
                        className={`w-full h-full object-contain transition-transform duration-500 ${getBlogImageMotionClass(featured.post.coverImage || featured.post.heroImage)}`}
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] lg:aspect-auto bg-gradient-to-br from-cobalt-50 to-cobalt-100/80 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-2xl bg-cobalt-200/40" />
                    </div>
                  )}
                  <div className="p-8 lg:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                      {featured.isLatest ? <Badge variant="cobalt">Latest</Badge> : <Badge variant="outline">Article</Badge>}
                      <span>{formatDate(featured.post.date)}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {featured.post.readingTime} min read
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 group-hover:text-cobalt-800 transition-colors mb-3">
                      {featured.post.title}
                    </h2>
                    <p className="text-gray-600 font-light leading-relaxed mb-4">
                      {featured.post.description}
                    </p>
                    {featured.post.tags && featured.post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {featured.post.tags.map((tag) => (
                          <Badge key={tag} variant="cobalt" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </FadeIn>
        </Section>
      )}

      {rest.length > 0 && (
        <Section className="bg-gray-50 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rest.map((item) => (
              <StaggerItem key={item.post.slug}>
                <PostCard post={item.post} />
              </StaggerItem>
            ))}
          </div>
        </Section>
      )}

      {!featured && (
        <Section className="bg-gray-50 pt-2">
          <FadeIn>
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
              <p className="text-xl font-semibold text-gray-900 mb-2">No posts found</p>
              <p className="text-sm text-gray-600 mb-6">Try changing your search text or selected tags.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setScope('all')
                  setSelectedTagKey('all')
                }}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  hasFilters
                    ? 'border-cobalt-300 bg-cobalt-50 text-cobalt-900 hover:bg-cobalt-100'
                    : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                disabled={!hasFilters}
              >
                Clear all filters
              </button>
            </div>
          </FadeIn>
        </Section>
      )}

      <section className="py-16 md:py-20 bg-white border-t border-gray-200">
        <Container className="text-center">
          <FadeIn>
            <p className="text-[11px] uppercase tracking-[0.16em] text-cobalt-900 font-semibold mb-3">
              Start Building
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-gray-900 leading-tight mb-4">
              Ready to build production AI?
            </h2>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto mb-8">
              Talk to our team about AI agents, data platforms, and GenAI accelerators.
            </p>
            <Button href="/contactus" size="lg" className="bg-gray-950 text-white hover:text-white" fillClassName="bg-cobalt-900">
              Let&apos;s talk
            </Button>
          </FadeIn>
        </Container>
      </section>
    </main>
  )
}
